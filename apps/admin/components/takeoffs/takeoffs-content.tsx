'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import {
	Circle,
	Hand,
	Hash,
	Pentagon,
	Ruler,
	Square,
	Type,
} from 'lucide-react';
import {
	type ReactElement,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import type { PageIndexedState } from '@/lib/takeoffs/edit-pdf';
import type { AnnotatedPdfInput } from '@/lib/takeoffs/export-pdf';
import {
	circleRadius,
	clipToParent,
	DEFAULT_WASTAGE,
	distance,
	measure,
	randomShapeColor,
	rectArea,
	resolveMpp,
	type SnapGuide,
	scaleToMpp,
	snapPolylinePoint,
	toMetres,
	translatePoints,
} from '@/lib/takeoffs/geometry';
import { detectLabelForShape, type TextBox } from '@/lib/takeoffs/text-layer';
import type {
	DragKind,
	Legend,
	LengthUnit,
	Measurement,
	MeasurementMethod,
	MeasurementType,
	MethodScope,
	PageGeometry,
	Point,
	ScaleSetting,
	TakeoffPersistState,
	TextAnnotation,
	ToolId,
} from '@/lib/takeoffs/types';
import { AREA_TYPE_SET } from '@/lib/takeoffs/types';
import MeasurementsPanel, { type LegendDisplay } from './measurements-panel';
import PdfStage from './pdf-stage';
import PdfThumbnails from './pdf-thumbnails';
import ScaleControl from './scale-control';
import ScaleDialog from './scale-dialog';
import { usePdfDocument } from './use-pdf-document';
import WastageControl from './wastage-control';

const DEFAULT_PDF_URL = '/sample-plan.pdf';
const UNITS: LengthUnit[] = ['mm', 'cm', 'm'];
// Auto-applied default: most plans are A3 at 1:100, so tools work without any
// manual calibration. The user can change this globally or per page.
const DEFAULT_SCALE: ScaleSetting = { ratio: 100, paper: 'A3' };
// Minimum drag size (base px) before a rectangle/circle is committed; smaller
// drags are treated as an accidental click and discarded.
const MIN_DRAW_PX = 3;

// Screen-pixel tolerance for snapping a new vertex to an earlier vertex's
// row/column while Shift is held (divided by zoom scale at the call site to
// stay constant on screen).
const ALIGN_SNAP_PX = 8;

// Measurements panel width (px): default plus the bounds enforced by the drag
// handle between the canvas and the panel.
const DEFAULT_PANEL_WIDTH = 288;
const MIN_PANEL_WIDTH = 240;
const MAX_PANEL_WIDTH = 640;
// Keyboard nudge per arrow-key press on the resize handle (px).
const PANEL_RESIZE_STEP = 16;

// Default legend box geometry as a fraction of the page's base size (a 3% inset
// from the top-left, ~28% of the page width). Fallbacks (base px) cover the rare
// case where the page geometry hasn't loaded yet when a legend is added.
const LEGEND_INSET_RATIO = 0.03;
const LEGEND_WIDTH_RATIO = 0.28;
const LEGEND_FALLBACK_INSET = 24;
const LEGEND_FALLBACK_WIDTH = 320;

// Area-drawing tools. Add/Subtract lock drawing to the selected target's family
// so a group never mixes areas, lines and counts.
const AREA_TOOL_SET = new Set<ToolId>(['rectangle', 'circle', 'polygon']);

type ShapeFamily = 'area' | 'linear' | 'count';

function toolFamily(tool: ToolId): ShapeFamily | null {
	if (AREA_TOOL_SET.has(tool)) {
		return 'area';
	}
	if (tool === 'linear') {
		return 'linear';
	}
	if (tool === 'count') {
		return 'count';
	}
	return null;
}

function measurementFamily(type: MeasurementType): ShapeFamily {
	if (AREA_TYPE_SET.has(type)) {
		return 'area';
	}
	if (type === 'linear') {
		return 'linear';
	}
	return 'count';
}

const EMPTY_IDS: ReadonlySet<string> = new Set();

// All ids "related" to an anchor measurement: the whole family it belongs to —
// the parent shape, its group members, and all of its deductions. Used to
// highlight a whole group when one member is selected or is the Add/Subtract
// target. Selecting a deduction resolves to its parent first, so the parent
// shape highlights alongside it (just like an Add group).
function relatedIds(measurements: Measurement[], id: string): Set<string> {
	const ids = new Set<string>([id]);
	const anchor = measurements.find((m) => m.id === id);
	if (!anchor) {
		return ids;
	}
	// A deduction's family is rooted at its parent shape; everything else is its
	// own root.
	const root =
		(anchor.parentId
			? measurements.find((m) => m.id === anchor.parentId)
			: anchor) ?? anchor;
	ids.add(root.id);
	for (const m of measurements) {
		if (
			(root.groupId && m.groupId === root.groupId) ||
			m.parentId === root.id
		) {
			ids.add(m.id);
		}
	}
	return ids;
}

// Human-readable label prefix per measurement type.
const TYPE_LABEL: Record<MeasurementType, string> = {
	linear: 'Linear',
	rectangle: 'Rectangle',
	circle: 'Circle',
	polygon: 'Polygon',
	count: 'Count',
};

interface ToolDef {
	icon: typeof Hand;
	id: ToolId;
	label: string;
	needsCalibration?: boolean;
}

const TOOLS: ToolDef[] = [
	{ id: 'pan', label: 'Pan', icon: Hand },
	{ id: 'linear', label: 'Linear', icon: Ruler, needsCalibration: true },
	{ id: 'rectangle', label: 'Rectangle', icon: Square, needsCalibration: true },
	{ id: 'circle', label: 'Circle', icon: Circle, needsCalibration: true },
	{ id: 'polygon', label: 'Polygon', icon: Pentagon, needsCalibration: true },
	{ id: 'count', label: 'Count', icon: Hash },
	{ id: 'text', label: 'Text', icon: Type },
];

function getAddTitle(isCalibrated: boolean, hasSelection: boolean): string {
	if (!isCalibrated) {
		return 'Calibrate this page first';
	}
	if (!hasSelection) {
		return 'Select a measurement on the canvas, then turn on Add to draw more shapes into it';
	}
	return 'Every shape you draw while Add is on joins the selected measurement — switch to Pan or Select to finish';
}

function getSubtractTitle(isCalibrated: boolean, canSubtract: boolean): string {
	if (!isCalibrated) {
		return 'Calibrate this page first';
	}
	if (!canSubtract) {
		return 'Select an area shape on the canvas, then turn on Subtract to deduct from it';
	}
	return 'Draw an area while Subtract is on to deduct it from the selected shape';
}

function dedupeConsecutive(points: Point[]): Point[] {
	const result: Point[] = [];
	for (const p of points) {
		const last = result.at(-1);
		if (!last || distance(last, p) > 0.5) {
			result.push(p);
		}
	}
	return result;
}

// How long to keep a download blob URL alive after opening it in a new tab, so
// the tab has time to load the PDF before the URL is revoked.
const TAB_REVOKE_MS = 60_000;

// Open the given PDF bytes in a new browser tab via a blob URL. Called only
// once the bytes are ready so the user never sees a blank loading tab.
function openPdfBytesInTab(bytes: Uint8Array) {
	const url = URL.createObjectURL(
		new Blob([bytes as BlobPart], { type: 'application/pdf' })
	);
	window.open(url, '_blank', 'noopener');
	setTimeout(() => URL.revokeObjectURL(url), TAB_REVOKE_MS);
}

// Imperative handle the parent uses to trigger a PDF save/download from outside
// the component (e.g. buttons next to the PDF-selection combobox).
export interface TakeoffsHandle {
	downloadPdf: () => Promise<void>;
}

export interface TakeoffsContentProps {
	/** Persisted working set to hydrate from; omitted for the prototype page. */
	initial?: TakeoffPersistState;
	/** Called (debounced by the caller) whenever the persisted state changes. */
	onPersist?: (state: TakeoffPersistState) => void;
	/** Persist a structural page edit (copy/delete) to storage immediately. Given
	 * the restructured PDF bytes (no overlays burned in) so the stored PDF stays
	 * in sync with the page-indexed working set. */
	onUploadStructural?: (bytes: Uint8Array) => Promise<void>;
	/** PDF to load. Defaults to the bundled sample plan (prototype mode). */
	pdfUrl?: string;
	ref?: Ref<TakeoffsHandle>;
}

export default function TakeoffsContent({
	pdfUrl = DEFAULT_PDF_URL,
	initial,
	onPersist,
	onUploadStructural,
	ref,
}: TakeoffsContentProps = {}) {
	// The PDF source fed to pdfjs. Starts as the parent's `pdfUrl` and is swapped
	// to an in-memory blob URL after a structural page edit (copy/delete) so the
	// viewer reflects the new page structure before it is re-uploaded.
	const [workingUrl, setWorkingUrl] = useState(pdfUrl);
	// The current working PDF bytes (post structural edits); seeded lazily from
	// `workingUrl` on the first edit.
	const workingBytesRef = useRef<Uint8Array | null>(null);
	// The live blob URL backing `workingUrl`, tracked so it can be revoked when
	// replaced or on unmount.
	const blobUrlRef = useRef<string | null>(null);
	// Serializes structural edits and Save PDF so they never read stale bytes.
	const opBusyRef = useRef(false);

	const {
		numPages,
		renderPage,
		renderThumbnail,
		extractText,
		getPageGeometry,
		error,
		ready,
	} = usePdfDocument(workingUrl);

	const [page, setPage] = useState(1);
	const [tool, setTool] = useState<ToolId>('pan');
	// When on, area shapes drawn from the main toolbar are clipped to and
	// subtracted from the parent shape that contains them.
	const [subtractMode, setSubtractMode] = useState(false);
	// When on, every shape/line drawn joins one combined "Add" group: area
	// members union into a single area, linear members sum into one length.
	const [addMode, setAddMode] = useState(false);
	// When on, each shape shows a badge with its actual measured value, both on
	// the canvas and in the exported/downloaded PDF. Off by default.
	const [showMeasurements, setShowMeasurements] = useState(false);
	// Id of the group currently being drawn into (ref so commit reads it
	// imperatively without re-running on every change). Null when Add is off.
	const currentGroupId = useRef<string | null>(null);
	// The existing measurement that Add/Subtract is locked to (the shape new
	// draws join as group members or deductions). Set from the selection when the
	// mode is turned on; survives the tool switch that drawing requires.
	const addTargetRef = useRef<string | null>(null);
	const [measurements, setMeasurements] = useState<Measurement[]>(
		initial?.measurements ?? []
	);
	// Pages that belong to the measurements panel, including ones added with no
	// measurements yet. A page only leaves via "Delete page from measurements";
	// emptying a page's measurements keeps it here (and the panel shows a warning).
	const [measurementPages, setMeasurementPages] = useState<number[]>(
		initial?.measurementPages ?? []
	);
	// PDF text boxes per page (base-pixel space), prefetched so commit() can read
	// them synchronously to auto-name area shapes.
	const pageTextRef = useRef<Map<number, TextBox[]>>(new Map());
	// PDF-wide default measurement method (scale or calibration), plus optional
	// per-page overrides. Defaults to a 1:100 A3 drawing scale so tools work
	// immediately.
	const [documentMethod, setDocumentMethod] =
		useState<MeasurementMethod | null>(
			initial ? initial.documentMethod : { kind: 'scale', scale: DEFAULT_SCALE }
		);
	const [pageMethods, setPageMethods] = useState<
		Record<number, MeasurementMethod>
	>(initial?.pageMethods ?? {});
	// Custom per-page titles, keyed by page number; falls back to `Page {n}`.
	const [pageTitles, setPageTitles] = useState<Record<number, string>>(
		initial?.pageTitles ?? {}
	);
	// Default wastage allowance (%) applied to every measurement; individual
	// measurements may override it via their row in the measurements panel.
	const [globalWastage, setGlobalWastage] = useState<number>(
		initial?.globalWastage ?? DEFAULT_WASTAGE
	);
	// Geometry of the current page (natural + base-pixel dims), needed to resolve
	// a drawing scale into metres-per-pixel.
	const [pageGeometry, setPageGeometry] = useState<PageGeometry | null>(null);
	const [draft, setDraft] = useState<Point[]>([]);
	const [cursor, setCursor] = useState<Point | null>(null);
	const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
	// Currently selected committed shape (Select tool) for editing/move.
	const [selectedId, setSelectedId] = useState<string | null>(null);
	// Index of the selected marker within the selected count (null otherwise).
	const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
		null
	);
	// Id of the shape most recently drawn on this page. Acts as the implicit
	// Add/Subtract anchor so the next shape can group/deduct without leaving the
	// drawing tool to reselect. Set on commit; cleared on tool/page change.
	const [lastDrawnId, setLastDrawnId] = useState<string | null>(null);
	// Clear both the shape selection and any marker sub-selection together.
	const clearSelection = useCallback(() => {
		setSelectedId(null);
		setSelectedMarkerIndex(null);
	}, []);
	// Width (px) of the measurements panel, adjustable via the drag handle.
	const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
	// Per-page legend boxes (base-pixel space). In-memory only, matching the rest
	// of this prototype; one legend per page.
	const [legends, setLegends] = useState<Record<number, Legend>>(
		initial?.legends ?? {}
	);
	// Per-page text annotations (base-pixel space). In-memory only, like legends,
	// but many per page (keyed by id). `newTextId` flags the just-placed box so its
	// textarea auto-focuses once.
	const [texts, setTexts] = useState<TextAnnotation[]>(initial?.texts ?? []);
	const [newTextId, setNewTextId] = useState<string | null>(null);
	// Mirrors `draft` synchronously so rapid clicks accumulate correctly even
	// before React re-renders (state reads in handlers would otherwise be stale).
	const draftRef = useRef<Point[]>([]);
	// Active pointer drag (draw / move / resize). Ref-driven like `draftRef` so
	// native SVG listeners read the latest value without stale closures.
	const dragRef = useRef<DragKind | null>(null);
	// Id of the count measurement currently being built. Enter/Escape or leaving
	// the count tool closes it so the next marker starts a new set.
	const activeCountIdRef = useRef<string | null>(null);
	const writeDraft = useCallback((points: Point[]) => {
		draftRef.current = points;
		setDraft(points);
	}, []);

	// Calibration dialog state.
	const [calibLine, setCalibLine] = useState<[Point, Point] | null>(null);
	const [calibValue, setCalibValue] = useState('');
	const [calibUnit, setCalibUnit] = useState<LengthUnit>('mm');
	const [calibScope, setCalibScope] = useState<MethodScope>('all');
	// Intended scope captured when a calibration is initiated (toolbar = all,
	// page chip = page); used to default the dialog's scope selector.
	const [calibTargetScope, setCalibTargetScope] = useState<MethodScope>('all');

	// Scale dialog state.
	const [scaleDialogOpen, setScaleDialogOpen] = useState(false);
	const [scaleDialogScope, setScaleDialogScope] = useState<MethodScope>('all');
	const [scaleDialogPage, setScaleDialogPage] = useState(1);

	// Effective method for the current page (override wins over document default).
	const method = pageMethods[page] ?? documentMethod;
	const metersPerPixel = method ? resolveMpp(method, pageGeometry) : null;
	const isCalibrated = metersPerPixel !== null;

	// Method whose scale seeds the scale dialog when it opens.
	const scaleDialogMethod =
		scaleDialogScope === 'all'
			? documentMethod
			: (pageMethods[scaleDialogPage] ?? documentMethod);

	const resetDraft = useCallback(() => {
		writeDraft([]);
		setCursor(null);
		setSnapGuides([]);
		activeCountIdRef.current = null;
	}, [writeDraft]);

	// Any page that gains a measurement joins the measurements panel and stays
	// there even after its measurements are later deleted (only the explicit
	// delete-page action removes it). This effect just unions new pages in.
	useEffect(() => {
		setMeasurementPages((prev) => {
			const next = new Set(prev);
			let changed = false;
			for (const m of measurements) {
				if (!next.has(m.page)) {
					next.add(m.page);
					changed = true;
				}
			}
			return changed ? [...next].sort((a, b) => a - b) : prev;
		});
	}, [measurements]);

	// Persist the working set whenever a persisted slice changes. The caller
	// supplies a debounced `onPersist`; we skip the first run so hydrating from
	// `initial` doesn't immediately echo back a redundant save.
	const onPersistRef = useRef(onPersist);
	onPersistRef.current = onPersist;
	const persistHydratedRef = useRef(false);
	useEffect(() => {
		if (!onPersistRef.current) {
			return;
		}
		if (!persistHydratedRef.current) {
			persistHydratedRef.current = true;
			return;
		}
		onPersistRef.current({
			measurements,
			measurementPages,
			legends,
			texts,
			pageTitles,
			documentMethod,
			pageMethods,
			globalWastage,
		});
	}, [
		measurements,
		measurementPages,
		legends,
		texts,
		pageTitles,
		documentMethod,
		pageMethods,
		globalWastage,
	]);

	// Follow the parent when it supplies a new source PDF (e.g. switching takeoffs):
	// drop any working blob/bytes so the new document loads fresh.
	useEffect(() => {
		setWorkingUrl(pdfUrl);
		workingBytesRef.current = null;
		if (blobUrlRef.current) {
			URL.revokeObjectURL(blobUrlRef.current);
			blobUrlRef.current = null;
		}
	}, [pdfUrl]);

	// Revoke the live blob URL on unmount.
	useEffect(
		() => () => {
			if (blobUrlRef.current) {
				URL.revokeObjectURL(blobUrlRef.current);
			}
		},
		[]
	);

	// The current working PDF bytes, seeded from `workingUrl` on first use.
	const currentWorkingBytes = useCallback(async (): Promise<Uint8Array> => {
		if (workingBytesRef.current) {
			return workingBytesRef.current;
		}
		const response = await fetch(workingUrl);
		const bytes = new Uint8Array(await response.arrayBuffer());
		workingBytesRef.current = bytes;
		return bytes;
	}, [workingUrl]);

	// Adopt restructured PDF bytes: cache them, point the viewer at a fresh blob
	// URL, and revoke the previous blob (pdfjs reads the blob synchronously when
	// the load effect fires, so the old one is safe to release immediately).
	const swapWorkingPdf = useCallback((bytes: Uint8Array) => {
		workingBytesRef.current = bytes;
		const url = URL.createObjectURL(
			new Blob([bytes as BlobPart], { type: 'application/pdf' })
		);
		const previous = blobUrlRef.current;
		blobUrlRef.current = url;
		setWorkingUrl(url);
		if (previous) {
			URL.revokeObjectURL(previous);
		}
	}, []);

	// Gather the un-annotated working bytes plus the overlay input (measurements,
	// legends, texts, and per-page geometry) that the PDF exporters consume.
	// Shared by Save PDF, Download PDF, and Download Page.
	const buildInput = useCallback(async (): Promise<{
		originalBytes: Uint8Array;
		input: AnnotatedPdfInput;
	}> => {
		const originalBytes = await currentWorkingBytes();

		// Geometry for every page that has any overlay to draw.
		const pagesWithOverlays = new Set<number>();
		for (const m of measurements) {
			pagesWithOverlays.add(m.page);
		}
		for (const t of texts) {
			pagesWithOverlays.add(t.page);
		}
		for (const key of Object.keys(legends)) {
			pagesWithOverlays.add(Number(key));
		}
		const geometryByPage = new Map<number, PageGeometry>();
		for (const pageNumber of pagesWithOverlays) {
			const geom = await getPageGeometry(pageNumber);
			if (geom) {
				geometryByPage.set(pageNumber, geom);
			}
		}

		return {
			originalBytes,
			input: {
				measurements,
				legends,
				texts,
				pageMethods,
				documentMethod,
				globalWastage,
				geometryByPage,
				showMeasurements,
			},
		};
	}, [
		currentWorkingBytes,
		measurements,
		texts,
		legends,
		pageMethods,
		documentMethod,
		globalWastage,
		getPageGeometry,
		showMeasurements,
	]);

	// Download PDF: burn the overlays into a copy of the document and open it in a
	// new tab once the bytes are ready (so the user never sees a blank loading
	// tab). The stored PDF is never touched — overlays stay live in Convex.
	const handleDownloadPdf = useCallback(async () => {
		const toastId = toastManager.add({
			title: 'Preparing PDF…',
			type: 'loading',
		});
		try {
			const { buildAnnotatedPdf } = await import('@/lib/takeoffs/export-pdf');
			const { originalBytes, input } = await buildInput();
			const bytes = await buildAnnotatedPdf(originalBytes, input);
			openPdfBytesInTab(bytes);
			toastManager.update(toastId, { title: 'PDF ready', type: 'success' });
		} catch {
			toastManager.update(toastId, {
				title: 'Could not download PDF',
				description: 'Please try again.',
				type: 'error',
			});
		}
	}, [buildInput]);

	// Download Page: open just the given page (with its overlays burned in) in a
	// new tab so the user can view/download it. The stored PDF is never touched.
	const handleDownloadPage = useCallback(
		async (pageNumber: number) => {
			const toastId = toastManager.add({
				title: `Preparing page ${pageNumber}…`,
				type: 'loading',
			});
			try {
				const { buildPageAnnotatedPdf } = await import(
					'@/lib/takeoffs/export-pdf'
				);
				const { originalBytes, input } = await buildInput();
				const pageBytes = await buildPageAnnotatedPdf(
					originalBytes,
					input,
					pageNumber
				);
				openPdfBytesInTab(pageBytes);
				toastManager.update(toastId, { title: 'PDF ready', type: 'success' });
			} catch {
				toastManager.update(toastId, {
					title: 'Could not download page',
					description: 'Please try again.',
					type: 'error',
				});
			}
		},
		[buildInput]
	);

	// Expose the download action to the parent so the button can live alongside
	// the PDF-selection combobox (the build needs this component's PDF geometry
	// and live measurement state, so it stays here).
	useImperativeHandle(ref, () => ({ downloadPdf: handleDownloadPdf }), [
		handleDownloadPdf,
	]);

	const selectTool = useCallback(
		(next: ToolId) => {
			setTool(next);
			// Add/Subtract stay locked to their target only while drawing within the
			// target's family; switching to Pan/Select or a mismatched family ends the
			// session. The target ref (not selectedId) drives the highlight, so it
			// survives the selection clear below.
			const target = addTargetRef.current
				? measurements.find((m) => m.id === addTargetRef.current)
				: undefined;
			const nextFamily = toolFamily(next);
			const sameFamily =
				target != null && nextFamily === measurementFamily(target.type);
			const keepSubtract = subtractMode && sameFamily && nextFamily === 'area';
			const keepAdd = addMode && sameFamily;
			setSubtractMode(keepSubtract);
			setAddMode(keepAdd);
			if (!(keepAdd || keepSubtract)) {
				addTargetRef.current = null;
				currentGroupId.current = null;
			}
			resetDraft();
			setSelectedId(null);
			// Switching tools starts fresh — the implicit anchor only holds while you
			// stay on the tool you drew with.
			setLastDrawnId(null);
		},
		[resetDraft, addMode, subtractMode, measurements]
	);

	// Toggle Subtract mode. Turning it on locks onto the selected area shape and
	// switches to its drawing tool; every area drawn becomes that shape's
	// deduction. Add and Subtract are mutually exclusive.
	const setSubtract = useCallback(
		(on: boolean) => {
			// Drop focus off the toggle so a subsequent Enter commits the draft via
			// the global handler instead of re-toggling this still-focused switch.
			(document.activeElement as HTMLElement | null)?.blur();
			if (on) {
				// Lock onto the selection if there is one, else the shape just drawn.
				const target =
					measurements.find((m) => m.id === selectedId) ??
					(lastDrawnId
						? measurements.find((m) => m.id === lastDrawnId)
						: undefined);
				// Subtract only applies to area shapes.
				if (!(target && AREA_TYPE_SET.has(target.type))) {
					return;
				}
				setSubtractMode(true);
				setAddMode(false);
				addTargetRef.current = target.id;
				currentGroupId.current = null;
				// Auto-switch to the target's drawing tool without clearing the
				// selection (selectTool would reset selectedId).
				setTool(target.type);
				resetDraft();
				return;
			}
			setSubtractMode(false);
			addTargetRef.current = null;
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft, measurements, selectedId, lastDrawnId]
	);

	// Toggle Add mode. Turning it on locks onto the selected measurement and
	// switches to its drawing tool; every shape drawn joins that measurement
	// (area/linear as a group, count as extra markers). Mutually exclusive with
	// Subtract; turning it off ends the session.
	const setAdd = useCallback(
		(on: boolean) => {
			// Drop focus off the toggle so a subsequent Enter commits the draft via
			// the global handler instead of re-toggling this still-focused switch.
			(document.activeElement as HTMLElement | null)?.blur();
			if (on) {
				// Lock onto the selection if there is one, else the shape just drawn.
				const target =
					measurements.find((m) => m.id === selectedId) ??
					(lastDrawnId
						? measurements.find((m) => m.id === lastDrawnId)
						: undefined);
				if (!target) {
					return;
				}
				setAddMode(true);
				setSubtractMode(false);
				addTargetRef.current = target.id;
				// Auto-switch to the target's drawing tool without clearing the
				// selection (selectTool would reset selectedId).
				setTool(target.type);
				resetDraft();
				if (target.type === 'count') {
					// Count: subsequent clicks append markers to this count. Set after
					// resetDraft, which clears the active-count ref.
					activeCountIdRef.current = target.id;
					currentGroupId.current = null;
				} else {
					// Area/linear: join the target's group, created on first draw.
					currentGroupId.current = target.groupId ?? null;
				}
				return;
			}
			setAddMode(false);
			addTargetRef.current = null;
			currentGroupId.current = null;
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft, measurements, selectedId, lastDrawnId]
	);

	const goToPage = useCallback(
		(next: number) => {
			setPage(() => Math.min(Math.max(next, 1), numPages || 1));
			resetDraft();
			setSelectedId(null);
			// The Add/Subtract target lives on the page being left, so end the
			// session: clear the target and turn both modes off.
			setAddMode(false);
			setSubtractMode(false);
			addTargetRef.current = null;
			currentGroupId.current = null;
			// The implicit anchor also lives on the page being left.
			setLastDrawnId(null);
		},
		[numPages, resetDraft]
	);

	// Push a remapped page-indexed working set into the slice setters (one batched
	// render → a single persist).
	const applyPageIndexedState = useCallback((next: PageIndexedState) => {
		setMeasurements(next.measurements);
		setMeasurementPages(next.measurementPages);
		setTexts(next.texts);
		setLegends(next.legends);
		setPageMethods(next.pageMethods);
		setPageTitles(next.pageTitles);
	}, []);

	// Clear transient editing state before a structural page edit so a half-drawn
	// draft or stale auto-naming cache never binds to a now-shifted page.
	const resetForPageEdit = useCallback(() => {
		resetDraft();
		setSelectedId(null);
		currentGroupId.current = null;
		pageTextRef.current.clear();
	}, [resetDraft]);

	// Copy a page: duplicate it in the PDF below the source page, shift the
	// page-indexed working set up past it (the copy starts empty), persist the new
	// PDF structure, and reveal the copy.
	const handleCopyPage = useCallback(
		async (targetPage: number) => {
			if (opBusyRef.current) {
				return;
			}
			opBusyRef.current = true;
			const toastId = toastManager.add({
				title: 'Copying page…',
				type: 'loading',
			});
			try {
				resetForPageEdit();
				const { copyPageInPdf, remapForCopy } = await import(
					'@/lib/takeoffs/edit-pdf'
				);
				const bytes = await currentWorkingBytes();
				const newBytes = await copyPageInPdf(bytes, targetPage);
				swapWorkingPdf(newBytes);
				applyPageIndexedState(
					remapForCopy(
						{
							measurements,
							measurementPages,
							texts,
							legends,
							pageMethods,
							pageTitles,
						},
						targetPage
					)
				);
				setPage(targetPage + 1);
				await onUploadStructural?.(newBytes);
				toastManager.update(toastId, { title: 'Page copied', type: 'success' });
			} catch {
				toastManager.update(toastId, {
					title: 'Could not copy page',
					description: 'Please try again.',
					type: 'error',
				});
			} finally {
				opBusyRef.current = false;
			}
		},
		[
			measurements,
			measurementPages,
			texts,
			legends,
			pageMethods,
			pageTitles,
			currentWorkingBytes,
			swapWorkingPdf,
			applyPageIndexedState,
			resetForPageEdit,
			onUploadStructural,
		]
	);

	// Delete a page: remove it from the PDF, drop its measurements/annotations and
	// shift the rest down, persist the new structure, and move to a valid page.
	const handleDeletePage = useCallback(
		async (targetPage: number) => {
			if (opBusyRef.current || numPages <= 1) {
				return;
			}
			opBusyRef.current = true;
			const toastId = toastManager.add({
				title: 'Deleting page…',
				type: 'loading',
			});
			try {
				resetForPageEdit();
				const { removePageInPdf, remapForDelete } = await import(
					'@/lib/takeoffs/edit-pdf'
				);
				const bytes = await currentWorkingBytes();
				const newBytes = await removePageInPdf(bytes, targetPage);
				swapWorkingPdf(newBytes);
				applyPageIndexedState(
					remapForDelete(
						{
							measurements,
							measurementPages,
							texts,
							legends,
							pageMethods,
							pageTitles,
						},
						targetPage
					)
				);
				// numPages is momentarily stale (the new blob hasn't reloaded yet), so
				// clamp against the post-delete count computed locally.
				const newCount = numPages - 1;
				setPage((current) => {
					if (current > targetPage) {
						return current - 1;
					}
					return Math.min(current, newCount);
				});
				await onUploadStructural?.(newBytes);
				toastManager.update(toastId, {
					title: 'Page deleted',
					type: 'success',
				});
			} catch {
				toastManager.update(toastId, {
					title: 'Could not delete page',
					description: 'Please try again.',
					type: 'error',
				});
			} finally {
				opBusyRef.current = false;
			}
		},
		[
			numPages,
			measurements,
			measurementPages,
			texts,
			legends,
			pageMethods,
			pageTitles,
			currentWorkingBytes,
			swapWorkingPdf,
			applyPageIndexedState,
			resetForPageEdit,
			onUploadStructural,
		]
	);

	// Add a page to the measurements panel with no measurements yet, then navigate
	// to it so the user can start drawing. The page shows a warning until it has a
	// measurement. No-op if it is already part of the panel.
	const handleAddToMeasurements = useCallback(
		(targetPage: number) => {
			setMeasurementPages((prev) =>
				prev.includes(targetPage)
					? prev
					: [...prev, targetPage].sort((a, b) => a - b)
			);
			goToPage(targetPage);
		},
		[goToPage]
	);

	// Remove a page from the measurements panel entirely: drop its membership and
	// every measurement on it. The PDF page itself is untouched. Page-keyed
	// titles/methods/legends are left in place (reused if the page is re-added).
	const handleDeletePageFromMeasurements = useCallback(
		(targetPage: number) => {
			setMeasurementPages((prev) => prev.filter((p) => p !== targetPage));
			setMeasurements((prev) => prev.filter((m) => m.page !== targetPage));
			resetDraft();
			setSelectedId(null);
			setAddMode(false);
			setSubtractMode(false);
			addTargetRef.current = null;
			currentGroupId.current = null;
		},
		[resetDraft]
	);

	// Replace a committed shape's points and recompute its value/perimeter live.
	const updateMeasurementPoints = useCallback(
		(id: string, points: Point[]) => {
			setMeasurements((prev) =>
				prev.map((m) =>
					m.id === id
						? {
								...m,
								points,
								...(metersPerPixel
									? measure(m.type, points, metersPerPixel)
									: {}),
							}
						: m
				)
			);
		},
		[metersPerPixel]
	);

	// Prefetch the current page's text layer so commit() can auto-name shapes
	// without awaiting. Naming silently falls back to defaults until it resolves.
	useEffect(() => {
		if (!ready) {
			return;
		}
		let cancelled = false;
		(async () => {
			const boxes = await extractText(page);
			if (!cancelled) {
				pageTextRef.current.set(page, boxes);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ready, page, extractText]);

	// Load the current page's geometry so a drawing scale can be resolved into
	// metres-per-pixel. Cleared first so stale geometry from the previous page is
	// never used for the new one.
	useEffect(() => {
		if (!ready) {
			return;
		}
		let cancelled = false;
		setPageGeometry(null);
		(async () => {
			const geom = await getPageGeometry(page);
			if (!cancelled) {
				setPageGeometry(geom);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ready, page, getPageGeometry]);

	// Recompute the value/perimeter of every measurement on the given pages using
	// the supplied method maps. Resolves a drawing scale per page via geometry.
	const recomputePages = useCallback(
		async (
			pagesToUpdate: number[],
			docMethod: MeasurementMethod | null,
			pgMethods: Record<number, MeasurementMethod>
		) => {
			const mppByPage = new Map<number, number>();
			for (const p of pagesToUpdate) {
				const m = pgMethods[p] ?? docMethod;
				if (!m) {
					continue;
				}
				if (m.kind === 'calibration') {
					mppByPage.set(p, m.mpp);
					continue;
				}
				const geom = await getPageGeometry(p);
				if (geom) {
					mppByPage.set(p, scaleToMpp(m.scale, geom));
				}
			}
			if (mppByPage.size === 0) {
				return;
			}
			setMeasurements((prev) =>
				prev.map((shape) => {
					const mpp = mppByPage.get(shape.page);
					return mpp === undefined
						? shape
						: { ...shape, ...measure(shape.type, shape.points, mpp) };
				})
			);
		},
		[getPageGeometry]
	);

	// Set the document default (scope 'all', also clearing the target page's
	// override) or a per-page override (scope 'page'), then recompute affected
	// measurements with the new method.
	const applyMethod = useCallback(
		async (
			nextMethod: MeasurementMethod,
			scope: MethodScope,
			targetPage = page
		) => {
			let nextDocument = documentMethod;
			let nextPageMethods = pageMethods;
			if (scope === 'all') {
				nextDocument = nextMethod;
				nextPageMethods = { ...pageMethods };
				delete nextPageMethods[targetPage];
				setDocumentMethod(nextMethod);
				setPageMethods(nextPageMethods);
			} else {
				nextPageMethods = { ...pageMethods, [targetPage]: nextMethod };
				setPageMethods(nextPageMethods);
			}
			const affectedPages =
				scope === 'all'
					? [...new Set(measurements.map((m) => m.page))]
					: [targetPage];
			await recomputePages(affectedPages, nextDocument, nextPageMethods);
		},
		[documentMethod, pageMethods, page, measurements, recomputePages]
	);

	// Drop a page's override so it follows the document default again, then
	// recompute that page.
	const resetPageMethod = useCallback(
		async (targetPage: number) => {
			const nextPageMethods = { ...pageMethods };
			delete nextPageMethods[targetPage];
			setPageMethods(nextPageMethods);
			await recomputePages([targetPage], documentMethod, nextPageMethods);
		},
		[pageMethods, documentMethod, recomputePages]
	);

	const commit = useCallback(
		(type: MeasurementType, points: Point[]) => {
			if (!metersPerPixel) {
				return;
			}
			// In Add mode, the shape joins the locked target's group. Resolve/create
			// the group id here (not inside the state updater) so the ref/UUID side
			// effects stay out of the pure updater. Count targets append markers via
			// handleStageClick and never reach commit. A family mismatch (guarded
			// against by tool gating) is ignored so a group can't be corrupted.
			const targetId = addTargetRef.current;
			// Hoisted out of the updater so it can be recorded as the implicit
			// Add/Subtract anchor (see setLastDrawnId below) once the shape commits.
			const newId = crypto.randomUUID();
			let groupId: string | undefined;
			if (addMode && targetId) {
				const target = measurements.find((m) => m.id === targetId);
				if (
					target &&
					target.type !== 'count' &&
					AREA_TYPE_SET.has(target.type) === AREA_TYPE_SET.has(type)
				) {
					const gid =
						currentGroupId.current ?? target.groupId ?? crypto.randomUUID();
					currentGroupId.current = gid;
					groupId = gid;
				}
			}
			setMeasurements((prev) => {
				// In subtract mode, clip the new area shape to the parent it overlaps
				// and store it as that parent's deduction; if none overlaps, it commits
				// as a normal area shape. Add and Subtract are mutually exclusive.
				let finalType = type;
				let finalPoints = points;
				let parentId: string | undefined;
				if (!addMode && subtractMode && AREA_TYPE_SET.has(type)) {
					// When subtracting from a group, any of its area members is an
					// eligible parent (so the deduction attaches to whichever it's drawn
					// over); for a lone target, only that shape is eligible.
					const target = targetId
						? prev.find((m) => m.id === targetId)
						: undefined;
					let allowedParentIds: string[] | undefined;
					if (target) {
						allowedParentIds = target.groupId
							? prev
									.filter(
										(m) =>
											m.groupId === target.groupId &&
											!m.parentId &&
											AREA_TYPE_SET.has(m.type)
									)
									.map((m) => m.id)
							: [target.id];
					}
					const clipped = clipToParent(
						{ type, points },
						prev,
						page,
						allowedParentIds
					);
					if (clipped) {
						parentId = clipped.parentId;
						finalType = clipped.type;
						finalPoints = clipped.points;
					}
				}
				// Auto-name area shapes from the PDF text inside them; fall back to the
				// generic numbered label when no text is detected.
				const detectedText =
					detectLabelForShape(
						{ type: finalType, points: finalPoints },
						pageTextRef.current.get(page) ?? []
					) ?? undefined;
				const fallbackLabel = parentId
					? `Deduction ${prev.filter((m) => m.parentId).length + 1}`
					: `${TYPE_LABEL[finalType]} ${
							prev.filter((m) => m.type === finalType && !m.parentId).length + 1
						}`;
				const label = detectedText ?? fallbackLabel;
				// Deductions render red; every other shape gets a colour. Group members
				// reuse the group's existing colour (or the anchor's, the first time a
				// lone shape becomes a group) so the whole group stays uniform.
				let color: string | undefined;
				if (!parentId) {
					color = groupId
						? (prev.find((m) => m.groupId === groupId)?.color ??
							(targetId
								? prev.find((m) => m.id === targetId)?.color
								: undefined) ??
							randomShapeColor())
						: randomShapeColor();
				}
				// When this is the first shape added to a lone target, tag the anchor
				// with the new group id so the two read as one group.
				const tagged =
					groupId && targetId
						? prev.map((m) =>
								m.id === targetId && !m.groupId ? { ...m, groupId } : m
							)
						: prev;
				return [
					...tagged,
					{
						id: newId,
						page,
						type: finalType,
						points: finalPoints,
						...measure(finalType, finalPoints, metersPerPixel),
						parentId,
						groupId,
						color,
						label,
						detectedText,
					},
				];
			});
			// Lock the implicit anchor to the shape just drawn so Add/Subtract can
			// group/deduct the next one without leaving the drawing tool.
			setLastDrawnId(newId);
		},
		[page, metersPerPixel, subtractMode, addMode, measurements]
	);

	const finishDraft = useCallback(() => {
		const points = dedupeConsecutive(draftRef.current);
		if (tool === 'linear' && points.length >= 2) {
			commit('linear', points);
		} else if (tool === 'polygon' && points.length >= 3) {
			commit('polygon', points);
		} else if (
			tool === 'rectangle' &&
			points.length >= 2 &&
			rectArea(points) > MIN_DRAW_PX ** 2
		) {
			commit('rectangle', points);
		} else if (
			tool === 'circle' &&
			points.length >= 2 &&
			circleRadius(points) >= MIN_DRAW_PX
		) {
			commit('circle', points);
		}
		writeDraft([]);
		setCursor(null);
		setSnapGuides([]);
		// Close any open count set so the next marker starts a fresh one.
		activeCountIdRef.current = null;
	}, [tool, commit, writeDraft]);

	// Hold Shift to (1) lock the current segment to the nearest 0°/45°/90°/…
	// direction relative to the last placed vertex, and (2) align the new point
	// with any earlier vertex's row/column (with a guide line) so right-angled
	// polygons are easy to draw. `scale` keeps the alignment tolerance constant
	// on screen across zoom levels.
	const computeSnap = useCallback(
		(
			point: Point,
			snap: boolean,
			scale: number
		): { guides: SnapGuide[]; point: Point } => {
			if (
				!snap ||
				(tool !== 'linear' && tool !== 'polygon' && tool !== 'calibrate')
			) {
				return { guides: [], point };
			}
			const prev = draftRef.current.at(-1);
			if (!prev) {
				return { guides: [], point };
			}
			const others = draftRef.current.slice(0, -1);
			return snapPolylinePoint(prev, point, others, ALIGN_SNAP_PX / scale);
		},
		[tool]
	);

	const handleStageClick = useCallback(
		(rawPoint: Point, snap = false, scale = 1) => {
			const { point } = computeSnap(rawPoint, snap, scale);
			if (tool === 'text') {
				const id = crypto.randomUUID();
				const width = 220;
				const height = 80;
				setTexts((prev) => [
					...prev,
					{
						id,
						page,
						x: point.x - width / 2,
						y: point.y - height / 2,
						width,
						height,
						text: '',
					},
				]);
				setNewTextId(id);
				// Drop back to Pan so the box is immediately editable/movable and
				// further clicks don't keep spawning boxes.
				selectTool('pan');
				return;
			}
			if (tool === 'count') {
				setMeasurements((prev) => {
					const active = activeCountIdRef.current
						? prev.find(
								(m) => m.id === activeCountIdRef.current && m.page === page
							)
						: undefined;
					if (active) {
						return prev.map((m) =>
							m.id === active.id
								? {
										...m,
										points: [...m.points, point],
										count: m.points.length + 1,
									}
								: m
						);
					}
					const id = crypto.randomUUID();
					activeCountIdRef.current = id;
					const countOnPage = prev.filter(
						(m) => m.type === 'count' && m.page === page
					).length;
					return [
						...prev,
						{
							id,
							page,
							type: 'count',
							points: [point],
							count: 1,
							color: randomShapeColor(),
							label: countOnPage === 0 ? 'Count' : `Count ${countOnPage + 1}`,
						},
					];
				});
				return;
			}

			if (tool === 'calibrate') {
				const next = [...draftRef.current, point];
				if (next.length === 2) {
					setCalibLine([next[0], next[1]]);
					// Default to the scope captured when calibration was initiated.
					setCalibScope(calibTargetScope);
					writeDraft([]);
				} else {
					writeDraft(next);
				}
				return;
			}

			if (tool === 'linear' || tool === 'polygon') {
				writeDraft([...draftRef.current, point]);
			}
		},
		[tool, page, calibTargetScope, writeDraft, computeSnap, selectTool]
	);

	// A pointer drag has begun (rectangle/circle draw, or move/resize of a
	// committed shape via the Select tool). Hit-testing happens in PdfStage,
	// which has the page scale; here we just record the drag and select.
	const handleDragStart = useCallback(
		(drag: DragKind) => {
			dragRef.current = drag;
			if (drag.mode === 'draw-rect' || drag.mode === 'draw-circle') {
				writeDraft([drag.start]);
			} else {
				setSelectedId(drag.id);
				// Track which marker was grabbed (for highlight/delete); clear the
				// sub-selection when grabbing a non-count shape.
				setSelectedMarkerIndex(drag.mode === 'marker' ? drag.index : null);
			}
		},
		[writeDraft]
	);

	// Pointer moved. Apply the active drag live, or update the draft cursor for
	// multi-click tools (linear/polygon/calibrate).
	const handleCursorMove = useCallback(
		(point: Point | null, snap = false, scale = 1) => {
			const drag = dragRef.current;
			if (drag && point) {
				if (drag.mode === 'draw-rect' || drag.mode === 'draw-circle') {
					writeDraft([drag.start, point]);
				} else if (drag.mode === 'move') {
					const dx = point.x - drag.start.x;
					const dy = point.y - drag.start.y;
					updateMeasurementPoints(drag.id, translatePoints(drag.orig, dx, dy));
				} else if (drag.mode === 'edge') {
					// Slide the whole edge along its perpendicular axis: shift the
					// owning vertices by the pointer's delta on that axis.
					const delta = point[drag.axis] - drag.start[drag.axis];
					const owners = new Set(drag.indices);
					updateMeasurementPoints(
						drag.id,
						drag.orig.map((p, i) =>
							owners.has(i) ? { ...p, [drag.axis]: p[drag.axis] + delta } : p
						)
					);
				} else if (drag.mode === 'marker') {
					// Move a single count marker; markers are independent points so no
					// alignment snapping is applied.
					updateMeasurementPoints(
						drag.id,
						drag.orig.map((p, i) => (i === drag.index ? point : p))
					);
				} else {
					// Dragging a single vertex handle. With Shift held, lock its motion
					// to horizontal/vertical (relative to its original position) and
					// align it to the shape's other vertices, showing guide lines.
					const shape = measurements.find((m) => m.id === drag.id);
					let next = point;
					let guides: SnapGuide[] = [];
					if (snap && (shape?.type === 'polygon' || shape?.type === 'linear')) {
						const anchor = drag.orig[drag.index];
						const others = drag.orig.filter((_, i) => i !== drag.index);
						const result = snapPolylinePoint(
							anchor,
							point,
							others,
							ALIGN_SNAP_PX / scale
						);
						next = result.point;
						guides = result.guides;
					}
					updateMeasurementPoints(
						drag.id,
						drag.orig.map((p, i) => (i === drag.index ? next : p))
					);
					setSnapGuides(guides);
				}
				return;
			}
			if (tool === 'linear' || tool === 'polygon' || tool === 'calibrate') {
				if (point) {
					const { point: snapped, guides } = computeSnap(point, snap, scale);
					setCursor(snapped);
					setSnapGuides(guides);
				} else {
					setCursor(null);
					setSnapGuides([]);
				}
			}
		},
		[tool, writeDraft, updateMeasurementPoints, computeSnap, measurements]
	);

	// Pointer released — commit a rectangle/circle draw; move/resize already
	// applied live, so just clear the drag and any alignment guides.
	const handlePointerUp = useCallback(() => {
		const drag = dragRef.current;
		dragRef.current = null;
		setSnapGuides([]);
		if (drag?.mode === 'draw-rect' || drag?.mode === 'draw-circle') {
			finishDraft();
		}
	}, [finishDraft]);

	const confirmCalibration = useCallback(() => {
		if (!calibLine) {
			return;
		}
		const realMeters = toMetres(Number(calibValue), calibUnit);
		const pixels = distance(calibLine[0], calibLine[1]);
		if (realMeters > 0 && pixels > 0) {
			const mpp = realMeters / pixels;
			applyMethod({ kind: 'calibration', mpp }, calibScope).catch(() => {
				// Recompute failure leaves existing values; nothing to surface.
			});
		}
		setCalibLine(null);
		setCalibValue('');
	}, [calibLine, calibValue, calibUnit, calibScope, applyMethod]);

	// Activate the calibrate tool with the intended scope, navigating first when
	// targeting a different page (calibration must be drawn on that page).
	const startCalibration = useCallback(
		(scope: MethodScope, targetPage?: number) => {
			setCalibTargetScope(scope);
			if (targetPage !== undefined && targetPage !== page) {
				goToPage(targetPage);
			}
			selectTool('calibrate');
		},
		[page, goToPage, selectTool]
	);

	// Open the drawing-scale dialog for the document default or a specific page.
	const openScaleDialog = useCallback(
		(scope: MethodScope, targetPage = page) => {
			setScaleDialogScope(scope);
			setScaleDialogPage(targetPage);
			setScaleDialogOpen(true);
		},
		[page]
	);

	const deleteMeasurement = useCallback((id: string) => {
		// Deleting a parent also removes its deductions, but deleting a member of an
		// Add group removes only that member (the rest of the group stays intact).
		setMeasurements((prev) =>
			prev.filter((m) => m.id !== id && m.parentId !== id)
		);
		setSelectedId((current) => (current === id ? null : current));
		setSelectedMarkerIndex(null);
		// If the deleted shape was the Add/Subtract target, end the session.
		if (addTargetRef.current === id) {
			setAddMode(false);
			setSubtractMode(false);
			addTargetRef.current = null;
			currentGroupId.current = null;
		}
	}, []);

	// Remove a single marker from a count. Dropping the last marker removes the
	// whole count measurement and clears its selection.
	const deleteMarker = useCallback((id: string, index: number) => {
		let removed = false;
		setMeasurements((prev) =>
			prev.flatMap((m) => {
				if (m.id !== id) {
					return [m];
				}
				const points = m.points.filter((_, i) => i !== index);
				if (points.length === 0) {
					removed = true;
					return [];
				}
				return [{ ...m, points, count: points.length }];
			})
		);
		setSelectedMarkerIndex(null);
		if (removed) {
			setSelectedId((current) => (current === id ? null : current));
			if (activeCountIdRef.current === id) {
				activeCountIdRef.current = null;
			}
		}
	}, []);

	// Pages that currently hold at least one measurement (for the thumbnail "M"
	// indicator and the per-page accordion in the measurements panel).
	const pagesWithMeasurements = useMemo(
		() => new Set(measurements.map((m) => m.page)),
		[measurements]
	);
	// Pages already in the measurements panel (with or without measurements) —
	// drives the disabled state of the thumbnail "Add to Measurements" action.
	const pagesInMeasurements = useMemo(
		() => new Set(measurementPages),
		[measurementPages]
	);

	// Jump to a measurement: switch to Pan (the selecting tool), navigate to its
	// page, and select it. Done inline (not via goToPage/selectTool) so the
	// selection isn't cleared.
	const focusMeasurement = useCallback(
		(id: string) => {
			const target = measurements.find((m) => m.id === id);
			if (!target) {
				return;
			}
			setTool('pan');
			setSubtractMode(false);
			setAddMode(false);
			addTargetRef.current = null;
			currentGroupId.current = null;
			setPage(Math.min(Math.max(target.page, 1), numPages || 1));
			resetDraft();
			setSelectedId(id);
		},
		[measurements, numPages, resetDraft]
	);

	const renameMeasurement = useCallback((id: string, label: string) => {
		setMeasurements((prev) =>
			prev.map((m) => (m.id === id ? { ...m, label } : m))
		);
	}, []);

	const setMeasurementDescription = useCallback(
		(id: string, description: string) => {
			setMeasurements((prev) =>
				prev.map((m) =>
					m.id === id ? { ...m, description: description || undefined } : m
				)
			);
		},
		[]
	);

	const renameGroup = useCallback((groupId: string, label: string) => {
		setMeasurements((prev) =>
			prev.map((m) => (m.groupId === groupId ? { ...m, groupLabel: label } : m))
		);
	}, []);

	const renamePage = useCallback((targetPage: number, title: string) => {
		setPageTitles((prev) => ({ ...prev, [targetPage]: title }));
	}, []);

	// Recolour a shape; if it belongs to an Add group, recolour the whole group.
	const recolorMeasurement = useCallback((id: string, color: string) => {
		setMeasurements((prev) => {
			const gid = prev.find((m) => m.id === id)?.groupId;
			return prev.map((m) => {
				if (gid ? m.groupId === gid : m.id === id) {
					return { ...m, color };
				}
				return m;
			});
		});
	}, []);

	// Override a measurement's wastage %, or clear it (null) to follow the global
	// default. If the shape belongs to an Add group, apply to the whole group.
	const setMeasurementWastage = useCallback(
		(id: string, percent: number | null) => {
			setMeasurements((prev) => {
				const gid = prev.find((m) => m.id === id)?.groupId;
				return prev.map((m) => {
					if (gid ? m.groupId === gid : m.id === id) {
						if (percent === null) {
							const { wastagePercent: _removed, ...rest } = m;
							return rest;
						}
						return { ...m, wastagePercent: percent };
					}
					return m;
				});
			});
		},
		[]
	);

	// Set a linear measurement's wall height (metres), or clear it (null). If the
	// shape belongs to an Add group, apply to the whole group.
	const setMeasurementHeight = useCallback(
		(id: string, heightMeters: number | null) => {
			setMeasurements((prev) => {
				const gid = prev.find((m) => m.id === id)?.groupId;
				return prev.map((m) => {
					if (gid ? m.groupId === gid : m.id === id) {
						if (heightMeters === null) {
							const { heightMeters: _removed, ...rest } = m;
							return rest;
						}
						return { ...m, heightMeters };
					}
					return m;
				});
			});
		},
		[]
	);

	// Set or clear a manual +/− area adjustment (m²) on a measurement. If the
	// shape belongs to an Add group, apply to the whole group (like height).
	const setMeasurementAreaAdjust = useCallback(
		(
			id: string,
			field: 'areaAddSqm' | 'areaSubtractSqm',
			value: number | null
		) => {
			setMeasurements((prev) => {
				const gid = prev.find((m) => m.id === id)?.groupId;
				return prev.map((m) => {
					if (gid ? m.groupId === gid : m.id === id) {
						const next = { ...m, [field]: value };
						if (value === null) {
							delete next[field];
						}
						return next;
					}
					return m;
				});
			});
		},
		[]
	);

	// Toggle a shape's canvas visibility (panel still lists it). If the shape
	// belongs to an Add group, toggle the whole group; a parent also toggles its
	// deductions so they stay in sync.
	const toggleMeasurementHidden = useCallback((id: string) => {
		setMeasurements((prev) => {
			const target = prev.find((m) => m.id === id);
			if (!target) {
				return prev;
			}
			const gid = target.groupId;
			const next = !target.hidden;
			return prev.map((m) => {
				const inScope = gid
					? m.groupId === gid
					: m.id === id || m.parentId === id;
				return inScope ? { ...m, hidden: next } : m;
			});
		});
	}, []);

	// Toggle canvas visibility for every shape on a page. If all are already
	// hidden, show them all; otherwise hide them all.
	const togglePageHidden = useCallback((targetPage: number) => {
		setMeasurements((prev) => {
			const onPage = prev.filter((m) => m.page === targetPage);
			const allHidden = onPage.length > 0 && onPage.every((m) => m.hidden);
			return prev.map((m) =>
				m.page === targetPage ? { ...m, hidden: !allHidden } : m
			);
		});
	}, []);

	// Add a legend to a page (no-op if it already has one), sized relative to that
	// page's geometry. The geometry fetch is async, so this resolves it then writes
	// the legend; on failure it falls back to fixed base-pixel defaults.
	const addLegend = useCallback(
		(targetPage: number, display: LegendDisplay) => {
			if (legends[targetPage]) {
				return;
			}
			const flags = {
				showColor: display.color,
				showName: display.name,
				showDescription: display.description,
				showMeasurement: display.measurement,
			};
			const write = (legend: Legend) =>
				setLegends((prev) =>
					prev[targetPage] ? prev : { ...prev, [targetPage]: legend }
				);
			getPageGeometry(targetPage)
				.then((geom) => {
					write(
						geom
							? {
									page: targetPage,
									x: Math.round(geom.baseWidth * LEGEND_INSET_RATIO),
									y: Math.round(geom.baseHeight * LEGEND_INSET_RATIO),
									width: Math.round(geom.baseWidth * LEGEND_WIDTH_RATIO),
									...flags,
								}
							: {
									page: targetPage,
									x: LEGEND_FALLBACK_INSET,
									y: LEGEND_FALLBACK_INSET,
									width: LEGEND_FALLBACK_WIDTH,
									...flags,
								}
					);
				})
				.catch(() => {
					write({
						page: targetPage,
						x: LEGEND_FALLBACK_INSET,
						y: LEGEND_FALLBACK_INSET,
						width: LEGEND_FALLBACK_WIDTH,
						...flags,
					});
				});
		},
		[legends, getPageGeometry]
	);

	const removeLegend = useCallback((targetPage: number) => {
		setLegends((prev) => {
			const next = { ...prev };
			delete next[targetPage];
			return next;
		});
	}, []);

	// Patch the current page's legend position/size (from drag-move / resize).
	const updateLegend = useCallback(
		(next: { width: number; x: number; y: number }) => {
			setLegends((prev) => {
				const current = prev[page];
				if (!current) {
					return prev;
				}
				return { ...prev, [page]: { ...current, ...next } };
			});
		},
		[page]
	);

	// Pages that currently have a legend, for the per-page actions menu.
	const legendPages = useMemo(
		() => new Set(Object.keys(legends).map(Number)),
		[legends]
	);

	// Text annotation edit/geometry/remove handlers (mirrors the legend ones).
	const editText = useCallback((id: string, text: string) => {
		setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)));
	}, []);

	const colorText = useCallback((id: string, color: string) => {
		setTexts((prev) => prev.map((t) => (t.id === id ? { ...t, color } : t)));
	}, []);

	const updateText = useCallback(
		(
			id: string,
			next: { height: number; width: number; x: number; y: number }
		) => {
			setTexts((prev) =>
				prev.map((t) => (t.id === id ? { ...t, ...next } : t))
			);
		},
		[]
	);

	const removeText = useCallback((id: string) => {
		setTexts((prev) => prev.filter((t) => t.id !== id));
		setNewTextId((cur) => (cur === id ? null : cur));
	}, []);

	const clearNewText = useCallback(() => setNewTextId(null), []);

	// Begin a drag on the handle between the canvas and the measurements panel.
	// The panel sits on the right, so dragging left widens it. Width is clamped
	// to [MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]; the cursor/selection are locked for
	// the duration so the drag stays smooth.
	const startPanelResize = useCallback(
		(event: React.PointerEvent) => {
			event.preventDefault();
			const startX = event.clientX;
			const startWidth = panelWidth;
			const prevCursor = document.body.style.cursor;
			const prevSelect = document.body.style.userSelect;
			document.body.style.cursor = 'col-resize';
			document.body.style.userSelect = 'none';
			const onMove = (moveEvent: PointerEvent) => {
				const next = startWidth + (startX - moveEvent.clientX);
				setPanelWidth(
					Math.min(MAX_PANEL_WIDTH, Math.max(MIN_PANEL_WIDTH, next))
				);
			};
			const onUp = () => {
				window.removeEventListener('pointermove', onMove);
				window.removeEventListener('pointerup', onUp);
				document.body.style.cursor = prevCursor;
				document.body.style.userSelect = prevSelect;
			};
			window.addEventListener('pointermove', onMove);
			window.addEventListener('pointerup', onUp);
		},
		[panelWidth]
	);

	// Keyboard resizing for the panel handle: Left widens, Right narrows.
	const handlePanelResizeKey = useCallback((event: React.KeyboardEvent) => {
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			setPanelWidth((w) => Math.min(MAX_PANEL_WIDTH, w + PANEL_RESIZE_STEP));
		} else if (event.key === 'ArrowRight') {
			event.preventDefault();
			setPanelWidth((w) => Math.max(MIN_PANEL_WIDTH, w - PANEL_RESIZE_STEP));
		}
	}, []);

	// Keyboard shortcuts for drawing and editing.
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (calibLine) {
				return;
			}
			// Don't hijack keys while typing into a text annotation (or any field):
			// Enter/Backspace/Escape must edit text, not finish drafts or delete shapes.
			const target = event.target as HTMLElement | null;
			if (
				target &&
				(target.tagName === 'TEXTAREA' ||
					target.tagName === 'INPUT' ||
					target.isContentEditable)
			) {
				return;
			}
			const editingSelection =
				tool === 'pan' && selectedId !== null && draftRef.current.length === 0;
			if (event.key === 'Enter') {
				finishDraft();
			} else if (event.key === 'Escape') {
				resetDraft();
				clearSelection();
			} else if (
				(event.key === 'Delete' || event.key === 'Backspace') &&
				editingSelection
			) {
				event.preventDefault();
				if (selectedMarkerIndex !== null) {
					deleteMarker(selectedId, selectedMarkerIndex);
				} else {
					deleteMeasurement(selectedId);
				}
			} else if (event.key === 'Backspace' && draftRef.current.length > 0) {
				event.preventDefault();
				writeDraft(draftRef.current.slice(0, -1));
			}
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	}, [
		finishDraft,
		resetDraft,
		writeDraft,
		calibLine,
		tool,
		selectedId,
		selectedMarkerIndex,
		deleteMeasurement,
		deleteMarker,
		clearSelection,
	]);

	const canFinish =
		(tool === 'linear' && draft.length >= 2) ||
		(tool === 'polygon' && draft.length >= 3);

	// The currently selected measurement, if any.
	const selectedMeasurement = selectedId
		? measurements.find((m) => m.id === selectedId)
		: undefined;
	// The anchor that enables Add/Subtract: an explicit selection wins, otherwise
	// fall back to the shape just drawn so the next shape can group/deduct without
	// a trip back to Pan to reselect.
	const anchorMeasurement =
		selectedMeasurement ??
		(lastDrawnId ? measurements.find((m) => m.id === lastDrawnId) : undefined);
	// Add works on any anchor measurement; Subtract only on an area shape.
	const canAddToSelection = anchorMeasurement != null;
	const canSubtractFromSelection =
		anchorMeasurement != null && AREA_TYPE_SET.has(anchorMeasurement.type);
	// Switches stay enabled while their mode is on (so you can turn it off) and
	// otherwise require a compatible selection.
	const addDisabled = !(isCalibrated && (addMode || canAddToSelection));
	const subtractDisabled = !(
		isCalibrated &&
		(subtractMode || canSubtractFromSelection)
	);

	// While locked to an Add/Subtract target, only same-family drawing tools stay
	// usable. The target's family drives which tool buttons are disabled.
	const lockedTarget =
		(addMode || subtractMode) && addTargetRef.current
			? measurements.find((m) => m.id === addTargetRef.current)
			: undefined;
	const lockedFamily = lockedTarget
		? measurementFamily(lockedTarget.type)
		: null;

	// Halo every shape that belongs to the selected group/parent or the locked
	// Add/Subtract target so the relationship reads on the canvas.
	const highlightIds = (() => {
		const ids = new Set<string>();
		// Selecting a member halos the whole group/parent — but a lone shape keeps
		// just its edit handles (no halo) to avoid noise on ordinary selection.
		if (selectedId) {
			const related = relatedIds(measurements, selectedId);
			if (related.size > 1) {
				for (const x of related) {
					ids.add(x);
				}
			}
		}
		// The Add/Subtract target always halos (even when lone) so you can see what
		// you're drawing into.
		const targetId = addMode || subtractMode ? addTargetRef.current : null;
		if (targetId) {
			for (const x of relatedIds(measurements, targetId)) {
				ids.add(x);
			}
		}
		return ids.size > 0 ? ids : EMPTY_IDS;
	})();

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-1 rounded-lg border bg-card p-1">
					{TOOLS.map((toolDef) => {
						const Icon = toolDef.icon;
						const family = toolFamily(toolDef.id);
						// While Add/Subtract is locked to a target, disable drawing tools
						// of a different family so a group never mixes families.
						const familyLocked =
							lockedFamily !== null &&
							family !== null &&
							family !== lockedFamily;
						const needsCalibration = toolDef.needsCalibration && !isCalibrated;
						const disabled = needsCalibration || familyLocked;
						let title = toolDef.label;
						if (needsCalibration) {
							title = 'Calibrate this page first';
						} else if (familyLocked) {
							title = 'Turn off Add/Subtract to use a different tool';
						}
						return (
							<Button
								disabled={disabled}
								key={toolDef.id}
								onClick={() => selectTool(toolDef.id)}
								size="sm"
								title={title}
								variant={tool === toolDef.id ? 'default' : 'ghost'}
							>
								<Icon />
								{toolDef.label}
							</Button>
						);
					})}
				</div>

				<div className="flex items-center gap-1 rounded-lg border bg-card p-1">
					<div
						className={cn(
							'flex items-center gap-2 px-3 py-1.5',
							addDisabled && 'opacity-64'
						)}
						title={getAddTitle(isCalibrated, canAddToSelection || addMode)}
					>
						<Switch
							checked={addMode}
							disabled={addDisabled}
							id="add-toggle"
							onCheckedChange={setAdd}
						/>
						<Label htmlFor="add-toggle">Add</Label>
					</div>

					<div
						className={cn(
							'flex items-center gap-2 px-3 py-1.5',
							subtractDisabled && 'opacity-64'
						)}
						title={getSubtractTitle(
							isCalibrated,
							canSubtractFromSelection || subtractMode
						)}
					>
						<Switch
							checked={subtractMode}
							disabled={subtractDisabled}
							id="subtract-toggle"
							onCheckedChange={setSubtract}
						/>
						<Label htmlFor="subtract-toggle">Subtract</Label>
					</div>

					<div
						className="flex items-center gap-2 px-3 py-1.5"
						title="Show each shape's actual measured value on the drawing and in downloads"
					>
						<Switch
							checked={showMeasurements}
							id="measurements-toggle"
							onCheckedChange={setShowMeasurements}
						/>
						<Label htmlFor="measurements-toggle">Measurements</Label>
					</div>
				</div>

				{canFinish && (
					<Button onClick={finishDraft} size="sm" variant="secondary">
						Finish
					</Button>
				)}

				<div className="ml-auto flex items-center gap-2">
					<WastageControl onChange={setGlobalWastage} value={globalWastage} />
					<ScaleControl
						calibrating={tool === 'calibrate' && calibTargetScope === 'all'}
						method={documentMethod}
						onCalibrate={() => startCalibration('all')}
						onOpenScaleDialog={() => openScaleDialog('all')}
					/>
				</div>
			</div>

			<div className="flex min-h-0 min-w-0 flex-1 gap-3">
				<PdfThumbnails
					currentPage={page}
					numPages={numPages}
					onAddToMeasurements={handleAddToMeasurements}
					onCopyPage={handleCopyPage}
					onDeletePage={handleDeletePage}
					onRenamePage={renamePage}
					onSelectPage={goToPage}
					pagesInMeasurements={pagesInMeasurements}
					pagesWithMeasurements={pagesWithMeasurements}
					pageTitles={pageTitles}
					ready={ready}
					renderThumbnail={renderThumbnail}
				/>
				<div className="min-w-0 flex-1">
					<PdfStage
						currentPageName={pageTitles[page] ?? `Page ${page}`}
						cursor={cursor}
						draft={draft}
						error={error}
						globalWastage={globalWastage}
						guides={snapGuides}
						highlightIds={highlightIds}
						legend={legends[page] ?? null}
						measurements={measurements.filter(
							(m) => m.page === page && !m.hidden
						)}
						metersPerPixel={metersPerPixel}
						newTextId={newTextId}
						numPages={numPages}
						onClearSelection={clearSelection}
						onCursorMove={handleCursorMove}
						onDragStart={handleDragStart}
						onLegendChange={updateLegend}
						onLegendRemove={() => removeLegend(page)}
						onPointerUp={handlePointerUp}
						onStageClick={handleStageClick}
						onStageDoubleClick={finishDraft}
						onTextAutoFocused={clearNewText}
						onTextChange={editText}
						onTextColorChange={colorText}
						onTextGeometryChange={updateText}
						onTextRemove={removeText}
						page={page}
						ready={ready}
						renderPage={renderPage}
						selectedId={selectedId}
						selectedMarkerIndex={selectedMarkerIndex}
						showMeasurements={showMeasurements}
						textAnnotations={texts.filter((t) => t.page === page)}
						tool={tool}
					/>
				</div>

				<button
					aria-label="Resize measurements panel"
					className="group -mx-1 flex w-2 shrink-0 cursor-col-resize touch-none items-center justify-center bg-transparent outline-none"
					onKeyDown={handlePanelResizeKey}
					onPointerDown={startPanelResize}
					type="button"
				>
					<span className="h-12 w-1 rounded-full bg-border transition-colors group-hover:bg-primary group-focus-visible:bg-primary" />
				</button>

				<MeasurementsPanel
					documentMethod={documentMethod}
					globalWastage={globalWastage}
					legendPages={legendPages}
					measurementPages={measurementPages}
					measurements={measurements}
					metersPerPixel={metersPerPixel}
					onAddLegend={addLegend}
					onCalibrate={(scope, targetPage) =>
						startCalibration(scope, targetPage)
					}
					onClearAll={() => {
						setMeasurements([]);
						resetDraft();
						setSelectedId(null);
						setAddMode(false);
						setSubtractMode(false);
						addTargetRef.current = null;
						currentGroupId.current = null;
					}}
					onClearPage={() => {
						setMeasurements((prev) => prev.filter((m) => m.page !== page));
						resetDraft();
						setSelectedId(null);
						setAddMode(false);
						setSubtractMode(false);
						addTargetRef.current = null;
						currentGroupId.current = null;
					}}
					onDelete={deleteMeasurement}
					onDeletePageFromMeasurements={handleDeletePageFromMeasurements}
					onDownloadPage={handleDownloadPage}
					onOpenScaleDialog={(scope, targetPage) =>
						openScaleDialog(scope, targetPage)
					}
					onRecolorMeasurement={recolorMeasurement}
					onRemoveLegend={removeLegend}
					onRenameGroup={renameGroup}
					onRenameMeasurement={renameMeasurement}
					onRenamePage={renamePage}
					onResetPage={(targetPage) => {
						resetPageMethod(targetPage).catch(() => {
							// Recompute failure leaves existing values unchanged.
						});
					}}
					onSelectMeasurement={focusMeasurement}
					onSetMeasurementAreaAdjust={setMeasurementAreaAdjust}
					onSetMeasurementDescription={setMeasurementDescription}
					onSetMeasurementHeight={setMeasurementHeight}
					onSetMeasurementWastage={setMeasurementWastage}
					onToggleMeasurementHidden={toggleMeasurementHidden}
					onTogglePageHidden={togglePageHidden}
					page={page}
					pageMethods={pageMethods}
					pageTitles={pageTitles}
					selectedId={selectedId}
					width={panelWidth}
				/>
			</div>

			<CalibrationDialog
				onCancel={() => {
					setCalibLine(null);
					setCalibValue('');
				}}
				onConfirm={confirmCalibration}
				onScopeChange={setCalibScope}
				onUnitChange={setCalibUnit}
				onValueChange={setCalibValue}
				open={calibLine !== null}
				page={page}
				scope={calibScope}
				unit={calibUnit}
				value={calibValue}
			/>

			<ScaleDialog
				initialScale={
					scaleDialogMethod?.kind === 'scale'
						? scaleDialogMethod.scale
						: DEFAULT_SCALE
				}
				initialScope={scaleDialogScope}
				onCancel={() => setScaleDialogOpen(false)}
				onConfirm={(scale, scope) => {
					applyMethod({ kind: 'scale', scale }, scope, scaleDialogPage).catch(
						() => {
							// Recompute failure leaves existing values unchanged.
						}
					);
					setScaleDialogOpen(false);
				}}
				open={scaleDialogOpen}
				page={scaleDialogPage}
			/>
		</div>
	);
}

function CalibrationDialog({
	open,
	value,
	unit,
	scope,
	page,
	onValueChange,
	onUnitChange,
	onScopeChange,
	onConfirm,
	onCancel,
}: {
	open: boolean;
	value: string;
	unit: LengthUnit;
	scope: MethodScope;
	page: number;
	onValueChange: (value: string) => void;
	onUnitChange: (unit: LengthUnit) => void;
	onScopeChange: (scope: MethodScope) => void;
	onConfirm: () => void;
	onCancel: () => void;
}): ReactElement {
	const scopeOptions: Array<{ id: MethodScope; label: string }> = [
		{ id: 'all', label: 'All pages' },
		{ id: 'page', label: `This page only (${page})` },
	];
	return (
		<Dialog
			onOpenChange={(next) => {
				if (!next) {
					onCancel();
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Set scale from known dimension</DialogTitle>
					<DialogDescription>
						Enter the real-world length of the line you just drew, then choose
						whether this scale applies to the whole PDF or just this page.
					</DialogDescription>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-3">
					<div className="flex items-center gap-2">
						<Input
							autoFocus
							nativeInput
							onChange={(event) => onValueChange(event.target.value)}
							onKeyDown={(event) => {
								if (event.key === 'Enter') {
									onConfirm();
								}
							}}
							placeholder="e.g. 5000"
							type="number"
							value={value}
						/>
						<div className="flex items-center gap-1 rounded-lg border p-1">
							{UNITS.map((u) => (
								<Button
									key={u}
									onClick={() => onUnitChange(u)}
									size="sm"
									variant={unit === u ? 'default' : 'ghost'}
								>
									{u}
								</Button>
							))}
						</div>
					</div>
					<div className="flex flex-col gap-1.5">
						<span className="font-medium text-muted-foreground text-xs">
							Apply scale to
						</span>
						<div className="flex items-center gap-1 rounded-lg border p-1">
							{scopeOptions.map((option) => (
								<Button
									className="flex-1"
									key={option.id}
									onClick={() => onScopeChange(option.id)}
									size="sm"
									variant={scope === option.id ? 'default' : 'ghost'}
								>
									{option.label}
								</Button>
							))}
						</div>
					</div>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!value || Number(value) <= 0}
						onClick={onConfirm}
						type="button"
					>
						Set scale
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
