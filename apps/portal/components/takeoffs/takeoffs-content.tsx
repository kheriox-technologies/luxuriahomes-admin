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
	Check,
	Circle,
	Hand,
	Hash,
	Pentagon,
	Ruler,
	Square,
	Type,
	X,
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
	TakeoffCategory,
	TakeoffGroup,
	TakeoffPersistState,
	TextAnnotation,
	ToolId,
	UndoSnapshot,
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

// The drawing tools disabled until a group is selected (every measurement must
// be filed into a group). Pan and text stay enabled.
const DRAWING_TOOLS = new Set<ToolId>([
	'linear',
	'rectangle',
	'circle',
	'polygon',
	'count',
]);

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

function getSubtractTitle(isCalibrated: boolean, canDeduct: boolean): string {
	if (!isCalibrated) {
		return 'Calibrate this page first';
	}
	if (!canDeduct) {
		return 'Pick an area tool (rectangle, circle, or polygon) to draw a deduction';
	}
	return 'Draw inside an existing area shape to deduct it from that shape';
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
	saveToDocuments: () => Promise<void>;
}

export interface TakeoffsContentProps {
	/** Persisted working set to hydrate from; omitted for the prototype page. */
	initial?: TakeoffPersistState;
	/** Called (debounced by the caller) whenever the persisted state changes. */
	onPersist?: (state: TakeoffPersistState) => void;
	/** Save an annotated PDF (overlays burned in) into the project's Take Offs
	 * documents folder. `descriptor` labels the saved scope (e.g. "Walls -
	 * Exterior", "Page 3", or "" for the whole takeoff) for the file name. */
	onSaveToDocuments?: (args: {
		bytes: Uint8Array;
		descriptor: string;
	}) => Promise<void>;
	/** PDF to load. Defaults to the bundled sample plan (prototype mode). */
	pdfUrl?: string;
	ref?: Ref<TakeoffsHandle>;
}

export default function TakeoffsContent({
	pdfUrl = DEFAULT_PDF_URL,
	initial,
	onPersist,
	onSaveToDocuments,
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
	// While the space bar is held the canvas temporarily pans, then snaps back to
	// the real tool on release. Kept separate from `tool` so the toolbar highlight
	// and any in-progress draft survive the transient pan.
	const [spacePanActive, setSpacePanActive] = useState(false);
	const effectiveTool: ToolId = spacePanActive ? 'pan' : tool;
	// When on, area shapes drawn from the main toolbar are clipped to and
	// subtracted from the selected shape (its group's area members).
	const [subtractMode, setSubtractMode] = useState(false);
	// When on, each shape shows a badge with its actual measured value, both on
	// the canvas and in the exported/downloaded PDF. Off by default.
	const [showMeasurements, setShowMeasurements] = useState(false);
	// When off, the thumbnails panel lists only pages that have measurements. On
	// by default so the full document is visible.
	const [showAllPages, setShowAllPages] = useState(true);
	// The group new measurements are filed into. Must be set before drawing (the
	// drawing tools are disabled until it is). Cleared by the panel's Save button.
	const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
	const [measurements, setMeasurements] = useState<Measurement[]>(
		initial?.measurements ?? []
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
	// Category → Group hierarchy for the measurements panel. Measurements are
	// filed into a group via `measurement.groupId`.
	const [categories, setCategories] = useState<TakeoffCategory[]>(
		initial?.categories ?? []
	);
	// Groups (root-level when `categoryId` is unset).
	const [groups, setGroups] = useState<TakeoffGroup[]>(initial?.groups ?? []);
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
	// Bumped on every canvas-originated shape selection, so the measurements
	// panel can exclusively expand the selected shape's category/group/page chain.
	const [canvasSelectNonce, setCanvasSelectNonce] = useState(0);
	// Index of the selected marker within the selected count (null otherwise).
	const [selectedMarkerIndex, setSelectedMarkerIndex] = useState<number | null>(
		null
	);
	// Clear both the shape selection and any marker sub-selection together.
	const clearSelection = useCallback(() => {
		setSelectedId(null);
		setSelectedMarkerIndex(null);
	}, []);
	// Width (px) of the measurements panel, adjustable via the drag handle.
	const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH);
	// Legend boxes (base-pixel space), scoped to a group on a page. Multiple can
	// exist on a page (one per group).
	const [legends, setLegends] = useState<Legend[]>(initial?.legends ?? []);
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

	// Per-group-session undo history. Each snapshot captures the state an undoable
	// drawing action changes; undo pops and restores it. Cleared whenever the
	// selected group changes (creation, selection, or Save), so a freshly selected
	// group starts with nothing to undo. `measurementsRef` mirrors `measurements`
	// so a snapshot can read the current value outside the setter.
	const measurementsRef = useRef<Measurement[]>(measurements);
	useEffect(() => {
		measurementsRef.current = measurements;
	}, [measurements]);
	const undoStackRef = useRef<UndoSnapshot[]>([]);
	const [undoDepth, setUndoDepth] = useState(0);
	const pushUndo = useCallback(() => {
		undoStackRef.current.push({
			measurements: measurementsRef.current,
			draft: [],
			activeCountId: activeCountIdRef.current,
		});
		setUndoDepth(undoStackRef.current.length);
	}, []);
	const clearUndo = useCallback(() => {
		undoStackRef.current = [];
		setUndoDepth(0);
	}, []);
	// Undoable when a shape is mid-draft (a point can be removed) or the history
	// stack holds a committed shape/marker.
	const canUndo = undoDepth > 0 || draft.length > 0;

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

	// Revert the last undoable action in the current group session. While a shape is
	// being drawn (linear/polygon), remove the last placed point; otherwise pop the
	// last committed shape or count marker off the history stack.
	const undo = useCallback(() => {
		if (draftRef.current.length > 0) {
			writeDraft(draftRef.current.slice(0, -1));
			return;
		}
		const snap = undoStackRef.current.pop();
		if (!snap) {
			return;
		}
		setUndoDepth(undoStackRef.current.length);
		setMeasurements(snap.measurements);
		writeDraft(snap.draft);
		activeCountIdRef.current = snap.activeCountId;
		// The restored state may no longer contain the selected shape/marker.
		setSelectedId(null);
		setSelectedMarkerIndex(null);
	}, [writeDraft]);

	// Reset the undo history whenever the active group changes: a group selected
	// right after creation, an explicit selection, or Save (which clears it) all
	// start a fresh session with nothing to undo.
	const lastSessionGroupRef = useRef(selectedGroupId);
	useEffect(() => {
		if (selectedGroupId === lastSessionGroupRef.current) {
			return;
		}
		lastSessionGroupRef.current = selectedGroupId;
		clearUndo();
	}, [selectedGroupId, clearUndo]);

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
			legends,
			texts,
			pageTitles,
			categories,
			groups,
			documentMethod,
			pageMethods,
			globalWastage,
		});
	}, [
		measurements,
		legends,
		texts,
		pageTitles,
		categories,
		groups,
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
		for (const legend of legends) {
			pagesWithOverlays.add(legend.page);
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
	// Pages that actually carry a visible measurement — the whole-document export
	// is limited to these so blank pages aren't included.
	const measurementPages = useMemo(
		() =>
			[
				...new Set(measurements.filter((m) => !m.hidden).map((m) => m.page)),
			].sort((a, b) => a - b),
		[measurements]
	);

	const handleDownloadPdf = useCallback(async () => {
		const toastId = toastManager.add({
			title: 'Preparing PDF…',
			type: 'loading',
		});
		try {
			const { buildAnnotatedPdf, buildPagesAnnotatedPdf } = await import(
				'@/lib/takeoffs/export-pdf'
			);
			const { originalBytes, input } = await buildInput();
			const bytes =
				measurementPages.length > 0
					? await buildPagesAnnotatedPdf(originalBytes, input, measurementPages)
					: await buildAnnotatedPdf(originalBytes, input);
			openPdfBytesInTab(bytes);
			toastManager.update(toastId, { title: 'PDF ready', type: 'success' });
		} catch {
			toastManager.update(toastId, {
				title: 'Could not download PDF',
				description: 'Please try again.',
				type: 'error',
			});
		}
	}, [buildInput, measurementPages]);

	// Download a subset of pages (category/group/page) with overlays burned in,
	// opening the result in a new tab. The stored PDF is never touched.
	const handleDownloadPages = useCallback(
		async (descriptor: string, pages: number[], groupIds?: Set<string>) => {
			if (pages.length === 0) {
				toastManager.add({
					title: 'Nothing to download',
					description: `${descriptor} has no pages with measurements.`,
					type: 'error',
				});
				return;
			}
			const toastId = toastManager.add({
				title: `Preparing ${descriptor}…`,
				type: 'loading',
			});
			try {
				const { buildPagesAnnotatedPdf } = await import(
					'@/lib/takeoffs/export-pdf'
				);
				const { originalBytes, input } = await buildInput();
				const bytes = await buildPagesAnnotatedPdf(
					originalBytes,
					{ ...input, groupIds },
					pages
				);
				openPdfBytesInTab(bytes);
				toastManager.update(toastId, { title: 'PDF ready', type: 'success' });
			} catch {
				toastManager.update(toastId, {
					title: 'Could not download PDF',
					description: 'Please try again.',
					type: 'error',
				});
			}
		},
		[buildInput]
	);

	// Save a subset of pages (category/group/page) into the project's Take Offs
	// documents folder via the parent-supplied upload callback. The descriptor is
	// woven into the saved file name (alongside the takeoff name + timestamp).
	const handleSaveSelection = useCallback(
		async (descriptor: string, pages: number[], groupIds?: Set<string>) => {
			if (!onSaveToDocuments) {
				return;
			}
			if (pages.length === 0) {
				toastManager.add({
					title: 'Nothing to save',
					description: `${descriptor} has no pages with measurements.`,
					type: 'error',
				});
				return;
			}
			const toastId = toastManager.add({
				title: 'Saving to Documents…',
				type: 'loading',
			});
			try {
				const { buildPagesAnnotatedPdf } = await import(
					'@/lib/takeoffs/export-pdf'
				);
				const { originalBytes, input } = await buildInput();
				const bytes = await buildPagesAnnotatedPdf(
					originalBytes,
					{ ...input, groupIds },
					pages
				);
				await onSaveToDocuments({ bytes, descriptor });
				toastManager.update(toastId, {
					title: 'Saved to Documents',
					type: 'success',
				});
			} catch {
				toastManager.update(toastId, {
					title: 'Could not save to Documents',
					description: 'Please try again.',
					type: 'error',
				});
			}
		},
		[buildInput, onSaveToDocuments]
	);

	// Save the whole takeoff (every page that has a measurement) into the Take Offs
	// documents folder. Exposed to the parent via the imperative handle for the
	// top-bar "Save to Documents" button.
	const handleSaveWhole = useCallback(async () => {
		if (!onSaveToDocuments) {
			return;
		}
		const toastId = toastManager.add({
			title: 'Saving to Documents…',
			type: 'loading',
		});
		try {
			const { buildAnnotatedPdf, buildPagesAnnotatedPdf } = await import(
				'@/lib/takeoffs/export-pdf'
			);
			const { originalBytes, input } = await buildInput();
			const bytes =
				measurementPages.length > 0
					? await buildPagesAnnotatedPdf(originalBytes, input, measurementPages)
					: await buildAnnotatedPdf(originalBytes, input);
			await onSaveToDocuments({ bytes, descriptor: '' });
			toastManager.update(toastId, {
				title: 'Saved to Documents',
				type: 'success',
			});
		} catch {
			toastManager.update(toastId, {
				title: 'Could not save to Documents',
				description: 'Please try again.',
				type: 'error',
			});
		}
	}, [buildInput, measurementPages, onSaveToDocuments]);

	// Expose the download/save actions to the parent so the buttons can live
	// alongside the PDF-selection combobox (the build needs this component's PDF
	// geometry and live measurement state, so it stays here).
	useImperativeHandle(
		ref,
		() => ({
			downloadPdf: handleDownloadPdf,
			saveToDocuments: handleSaveWhole,
		}),
		[handleDownloadPdf, handleSaveWhole]
	);

	const selectTool = useCallback(
		(next: ToolId) => {
			setTool(next);
			// Deduct works with area tools; keep it on when switching between them
			// (rectangle/circle/polygon) but end it for any non-area tool.
			if (!AREA_TYPE_SET.has(next as MeasurementType)) {
				setSubtractMode(false);
			}
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft]
	);

	// Toggle Deduct mode. With an area tool active, every area drawn attaches as a
	// deduction of whichever existing shape it lands inside (auto-detected on
	// commit), clipped to that parent's boundary.
	const setSubtract = useCallback(
		(on: boolean) => {
			// Drop focus off the toggle so a subsequent Enter commits the draft via
			// the global handler instead of re-toggling this still-focused switch.
			(document.activeElement as HTMLElement | null)?.blur();
			resetDraft();
			setSelectedId(null);
			setSubtractMode(on);
		},
		[resetDraft]
	);

	const goToPage = useCallback(
		(next: number) => {
			setPage(() => Math.min(Math.max(next, 1), numPages || 1));
			resetDraft();
			setSelectedId(null);
			// The subtract target lives on the page being left, so end that session.
			setSubtractMode(false);
		},
		[numPages, resetDraft]
	);

	// --- Category → Group hierarchy handlers ---

	const addCategory = useCallback(() => {
		const id = crypto.randomUUID();
		setCategories((prev) => [
			...prev,
			{ id, name: `Category ${prev.length + 1}` },
		]);
		return id;
	}, []);

	const renameCategory = useCallback((categoryId: string, name: string) => {
		setCategories((prev) =>
			prev.map((category) =>
				category.id === categoryId ? { ...category, name } : category
			)
		);
	}, []);

	// Delete a category, its groups, and every measurement (and legend) in them.
	const deleteCategory = useCallback(
		(categoryId: string) => {
			const removedGroupIds = new Set(
				groups.filter((g) => g.categoryId === categoryId).map((g) => g.id)
			);
			setGroups((prev) => prev.filter((g) => g.categoryId !== categoryId));
			setCategories((prev) => prev.filter((c) => c.id !== categoryId));
			if (removedGroupIds.size > 0) {
				setMeasurements((prev) =>
					prev.filter((m) => !(m.groupId && removedGroupIds.has(m.groupId)))
				);
				setLegends((prev) =>
					prev.filter((l) => !removedGroupIds.has(l.groupId))
				);
				setSelectedGroupId((cur) =>
					cur && removedGroupIds.has(cur) ? null : cur
				);
			}
		},
		[groups]
	);

	// Create a group (root-level when no categoryId) and auto-select it so drawing
	// files into it immediately.
	const addGroup = useCallback((categoryId?: string) => {
		const id = crypto.randomUUID();
		setGroups((prev) => {
			const siblingCount = prev.filter(
				(g) => g.categoryId === categoryId
			).length;
			return [
				...prev,
				{
					id,
					name: `Measure ${siblingCount + 1}`,
					categoryId,
					color: randomShapeColor(),
				},
			];
		});
		setSelectedGroupId(id);
		return id;
	}, []);

	const renameGroup = useCallback((groupId: string, name: string) => {
		setGroups((prev) =>
			prev.map((g) => (g.id === groupId ? { ...g, name } : g))
		);
	}, []);

	// Move a group into a category (or back to root when categoryId is undefined).
	const moveGroup = useCallback(
		(groupId: string, categoryId: string | undefined) => {
			setGroups((prev) =>
				prev.map((g) => (g.id === groupId ? { ...g, categoryId } : g))
			);
		},
		[]
	);

	// Delete a group and every measurement (and legend) filed into it.
	const deleteGroup = useCallback((groupId: string) => {
		setGroups((prev) => prev.filter((g) => g.id !== groupId));
		setMeasurements((prev) => prev.filter((m) => m.groupId !== groupId));
		setLegends((prev) => prev.filter((l) => l.groupId !== groupId));
		setSelectedId(null);
		setSelectedMarkerIndex(null);
		setSelectedGroupId((cur) => (cur === groupId ? null : cur));
	}, []);

	// Select a group as the drawing target (panel handles the exclusive open).
	const selectGroup = useCallback((groupId: string) => {
		setSelectedGroupId(groupId);
	}, []);

	// End the current group session (the panel's Save button): return to Pan and
	// clear the selection. Autosave has already persisted the measurements.
	const saveGroupSession = useCallback(() => {
		setTool('pan');
		setSubtractMode(false);
		setSelectedGroupId(null);
		resetDraft();
		setSelectedId(null);
	}, [resetDraft]);

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
			// A normal shape files into the selected group; a subtract-mode area shape
			// reuses its parent's group. Without either, there is nowhere to file it.
			if (!(selectedGroupId || subtractMode)) {
				return;
			}
			// A committed shape is undone as a whole (not peeled point-by-point).
			pushUndo();
			const newId = crypto.randomUUID();
			setMeasurements((prev) => {
				// In deduct mode, clip the new area shape to the existing shape it was
				// drawn inside and store it as that parent's deduction.
				let finalType = type;
				let finalPoints = points;
				let parentId: string | undefined;
				if (subtractMode && AREA_TYPE_SET.has(type)) {
					// Auto-detect the parent as the existing area shape the deduction is
					// drawn inside (largest overlap, topmost) and clip it to that
					// parent's boundary. A deduction that lands on no shape is discarded.
					const clipped = clipToParent({ type, points }, prev, page);
					if (!clipped) {
						return prev;
					}
					parentId = clipped.parentId;
					finalType = clipped.type;
					finalPoints = clipped.points;
				}
				// A deduction inherits its parent's group; a normal shape uses the
				// selected group. If neither resolves (a subtract miss with no group),
				// discard the draw so no orphan measurement is created.
				const groupId = parentId
					? prev.find((m) => m.id === parentId)?.groupId
					: (selectedGroupId ?? undefined);
				if (!(parentId || groupId)) {
					return prev;
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
				// Deductions render red (no colour); other shapes take their group's
				// colour so the group reads uniformly, falling back to an existing
				// member's colour (legacy groups) or a new random colour.
				let color: string | undefined;
				if (!parentId) {
					color =
						(groupId && groups.find((g) => g.id === groupId)?.color) ||
						(groupId &&
							prev.find((m) => m.groupId === groupId && !m.parentId)?.color) ||
						randomShapeColor();
				}
				return [
					...prev,
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
		},
		[page, metersPerPixel, subtractMode, selectedGroupId, groups, pushUndo]
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
				pushUndo();
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
					// Take the selected group's colour so the group reads uniformly,
					// falling back to an existing member's colour or a new random colour.
					const countColor =
						(selectedGroupId &&
							groups.find((g) => g.id === selectedGroupId)?.color) ||
						(selectedGroupId &&
							prev.find((m) => m.groupId === selectedGroupId && !m.parentId)
								?.color) ||
						randomShapeColor();
					return [
						...prev,
						{
							id,
							page,
							type: 'count',
							points: [point],
							count: 1,
							color: countColor,
							label: countOnPage === 0 ? 'Count' : `Count ${countOnPage + 1}`,
							groupId: selectedGroupId ?? undefined,
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
		[
			tool,
			page,
			selectedGroupId,
			groups,
			calibTargetScope,
			writeDraft,
			computeSnap,
			selectTool,
			pushUndo,
		]
	);

	// Resolve a shape id to its group id, following deductions (which carry a
	// `parentId` instead of their own `groupId`) up to their parent's group.
	const resolveShapeGroupId = useCallback(
		(id: string): string | null => {
			const target = measurements.find((m) => m.id === id);
			if (!target) {
				return null;
			}
			if (target.groupId) {
				return target.groupId;
			}
			if (target.parentId) {
				return (
					measurements.find((m) => m.id === target.parentId)?.groupId ?? null
				);
			}
			return null;
		},
		[measurements]
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
				// Also select the shape's group so the panel highlights it and shows
				// the Save button (mirrors the panel-row path in focusMeasurement).
				setSelectedGroupId(resolveShapeGroupId(drag.id));
				// Track which marker was grabbed (for highlight/delete); clear the
				// sub-selection when grabbing a non-count shape.
				setSelectedMarkerIndex(drag.mode === 'marker' ? drag.index : null);
				// Signal a canvas-originated selection so the panel can exclusively
				// expand this shape's category/group/page chain (panel-row clicks go
				// through focusMeasurement and don't bump this).
				setCanvasSelectNonce((n) => n + 1);
			}
		},
		[writeDraft, resolveShapeGroupId]
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
		// Deleting a parent also removes its deductions.
		setMeasurements((prev) =>
			prev.filter((m) => m.id !== id && m.parentId !== id)
		);
		setSelectedId((current) => (current === id ? null : current));
		setSelectedMarkerIndex(null);
		// A subtract session is keyed on the selection, so end it on any delete.
		setSubtractMode(false);
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
	// indicator).
	const pagesWithMeasurements = useMemo(
		() => new Set(measurements.map((m) => m.page)),
		[measurements]
	);
	// Page numbers shown in the thumbnails panel: every page when "Show All Pages"
	// is on, otherwise only pages that hold at least one measurement.
	const visiblePages = useMemo(() => {
		if (showAllPages) {
			return Array.from({ length: numPages }, (_, index) => index + 1);
		}
		return [...pagesWithMeasurements].sort((a, b) => a - b);
	}, [showAllPages, numPages, pagesWithMeasurements]);
	const toggleShowAllPages = useCallback(
		(on: boolean) => {
			setShowAllPages(on);
			// When hiding empty pages, jump to the first page with measurements
			// unless the current page already has some.
			if (!(on || pagesWithMeasurements.has(page))) {
				const first = [...pagesWithMeasurements].sort((a, b) => a - b)[0];
				if (first) {
					goToPage(first);
				}
			}
		},
		[pagesWithMeasurements, page, goToPage]
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
			setPage(Math.min(Math.max(target.page, 1), numPages || 1));
			resetDraft();
			setSelectedId(id);
			setSelectedGroupId(resolveShapeGroupId(id));
		},
		[measurements, numPages, resetDraft, resolveShapeGroupId]
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

	const renamePage = useCallback((targetPage: number, title: string) => {
		setPageTitles((prev) => ({ ...prev, [targetPage]: title }));
	}, []);

	// Recolour a group: update the group's colour and repaint every shape in it
	// (deductions stay red, so they are left untouched).
	const recolorGroup = useCallback((groupId: string, color: string) => {
		setGroups((prev) =>
			prev.map((g) => (g.id === groupId ? { ...g, color } : g))
		);
		setMeasurements((prev) =>
			prev.map((m) =>
				m.groupId === groupId && !m.parentId ? { ...m, color } : m
			)
		);
	}, []);

	// Override a measurement's wastage %, or clear it (null) to follow the global
	// default.
	const setMeasurementWastage = useCallback(
		(id: string, percent: number | null) => {
			setMeasurements((prev) =>
				prev.map((m) => {
					if (m.id !== id) {
						return m;
					}
					if (percent === null) {
						const { wastagePercent: _removed, ...rest } = m;
						return rest;
					}
					return { ...m, wastagePercent: percent };
				})
			);
		},
		[]
	);

	// Set a linear measurement's wall height (metres), or clear it (null).
	const setMeasurementHeight = useCallback(
		(id: string, heightMeters: number | null) => {
			setMeasurements((prev) =>
				prev.map((m) => {
					if (m.id !== id) {
						return m;
					}
					if (heightMeters === null) {
						const { heightMeters: _removed, ...rest } = m;
						return rest;
					}
					return { ...m, heightMeters };
				})
			);
		},
		[]
	);

	// Set or clear a manual +/− area adjustment (m²) on a measurement.
	const setMeasurementAreaAdjust = useCallback(
		(
			id: string,
			field: 'areaAddSqm' | 'areaSubtractSqm',
			value: number | null
		) => {
			setMeasurements((prev) =>
				prev.map((m) => {
					if (m.id !== id) {
						return m;
					}
					const next = { ...m, [field]: value };
					if (value === null) {
						delete next[field];
					}
					return next;
				})
			);
		},
		[]
	);

	// Toggle a shape's canvas visibility (panel still lists it). A parent also
	// toggles its deductions so they stay in sync.
	const toggleMeasurementHidden = useCallback((id: string) => {
		setMeasurements((prev) => {
			const target = prev.find((m) => m.id === id);
			if (!target) {
				return prev;
			}
			const next = !target.hidden;
			return prev.map((m) =>
				m.id === id || m.parentId === id ? { ...m, hidden: next } : m
			);
		});
	}, []);

	// Toggle canvas visibility for every measurement in a group. If all are
	// already hidden, show them all; otherwise hide them all.
	const toggleGroupHidden = useCallback((groupId: string) => {
		setMeasurements((prev) => {
			const inGroup = prev.filter((m) => m.groupId === groupId && !m.parentId);
			const allHidden = inGroup.length > 0 && inGroup.every((m) => m.hidden);
			return prev.map((m) =>
				m.groupId === groupId ? { ...m, hidden: !allHidden } : m
			);
		});
	}, []);

	// Toggle canvas visibility for every measurement in a category's groups. If
	// all are already hidden, show them all; otherwise hide them all.
	const toggleCategoryHidden = useCallback(
		(categoryId: string) => {
			const categoryGroupIds = new Set(
				groups.filter((g) => g.categoryId === categoryId).map((g) => g.id)
			);
			setMeasurements((prev) => {
				const inCategory = prev.filter(
					(m) => m.groupId && categoryGroupIds.has(m.groupId) && !m.parentId
				);
				const allHidden =
					inCategory.length > 0 && inCategory.every((m) => m.hidden);
				return prev.map((m) =>
					m.groupId && categoryGroupIds.has(m.groupId)
						? { ...m, hidden: !allHidden }
						: m
				);
			});
		},
		[groups]
	);

	// Toggle canvas visibility for every measurement. If all are already hidden,
	// show them all; otherwise hide them all.
	const toggleAllHidden = useCallback(() => {
		setMeasurements((prev) => {
			const tops = prev.filter((m) => !m.parentId);
			const allHidden = tops.length > 0 && tops.every((m) => m.hidden);
			return prev.map((m) => ({ ...m, hidden: !allHidden }));
		});
	}, []);

	// Add a legend for a group on every page the group covers (skipping pages that
	// already have this group's legend), each sized relative to that page's
	// geometry. The geometry fetch is async; failures fall back to fixed defaults.
	const addLegend = useCallback(
		(groupId: string, display: LegendDisplay) => {
			const flags = {
				showColor: display.color,
				showName: display.name,
				showDescription: display.description,
				showMeasurement: display.measurement,
			};
			const pages = [
				...new Set(
					measurements
						.filter((m) => m.groupId === groupId && !m.parentId)
						.map((m) => m.page)
				),
			];
			for (const targetPage of pages) {
				const legendId = crypto.randomUUID();
				const write = (legend: Legend) =>
					setLegends((prev) =>
						prev.some((l) => l.groupId === groupId && l.page === targetPage)
							? prev
							: [...prev, legend]
					);
				getPageGeometry(targetPage)
					.then((geom) => {
						write(
							geom
								? {
										id: legendId,
										groupId,
										page: targetPage,
										x: Math.round(geom.baseWidth * LEGEND_INSET_RATIO),
										y: Math.round(geom.baseHeight * LEGEND_INSET_RATIO),
										width: Math.round(geom.baseWidth * LEGEND_WIDTH_RATIO),
										...flags,
									}
								: {
										id: legendId,
										groupId,
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
							id: legendId,
							groupId,
							page: targetPage,
							x: LEGEND_FALLBACK_INSET,
							y: LEGEND_FALLBACK_INSET,
							width: LEGEND_FALLBACK_WIDTH,
							...flags,
						});
					});
			}
		},
		[measurements, getPageGeometry]
	);

	// Remove every legend belonging to a group (from the group action menu).
	const removeGroupLegend = useCallback((groupId: string) => {
		setLegends((prev) => prev.filter((l) => l.groupId !== groupId));
	}, []);

	// Patch a legend's position/size by id (from drag-move / resize on canvas).
	const updateLegend = useCallback(
		(id: string, next: { width: number; x: number; y: number }) => {
			setLegends((prev) =>
				prev.map((l) => (l.id === id ? { ...l, ...next } : l))
			);
		},
		[]
	);

	// Remove a single legend by id (the X on the canvas legend box).
	const removeLegend = useCallback((id: string) => {
		setLegends((prev) => prev.filter((l) => l.id !== id));
	}, []);

	// Ids of groups that currently have a legend, for the group action menus.
	const legendGroupIds = useMemo(
		() => new Set(legends.map((l) => l.groupId)),
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
			if (
				(event.metaKey || event.ctrlKey) &&
				(event.key === 'z' || event.key === 'Z') &&
				!event.shiftKey
			) {
				event.preventDefault();
				undo();
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
		undo,
	]);

	// Hold space to temporarily pan, release to return to the active tool.
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.code !== 'Space' || event.repeat) {
				return;
			}
			// Don't hijack space while typing into a text annotation (or any field):
			// it must insert a space, not start panning.
			const target = event.target as HTMLElement | null;
			if (
				target &&
				(target.tagName === 'TEXTAREA' ||
					target.tagName === 'INPUT' ||
					target.isContentEditable)
			) {
				return;
			}
			// Stop the page from scrolling while space pans the canvas.
			event.preventDefault();
			// Drop focus off any focused control (e.g. the active tool button):
			// native buttons fire their click on Space keyup, which would re-run
			// selectTool → resetDraft and close the open count set mid-panning.
			(document.activeElement as HTMLElement | null)?.blur();
			setSpacePanActive(true);
		};
		const handleKeyUp = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				setSpacePanActive(false);
			}
		};
		// Releasing space outside the window never fires keyup, so clear the pan on
		// blur to avoid a stuck pan state.
		const handleBlur = () => setSpacePanActive(false);
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		window.addEventListener('blur', handleBlur);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			window.removeEventListener('blur', handleBlur);
		};
	}, []);

	const canFinish =
		(tool === 'linear' && draft.length >= 2) ||
		(tool === 'polygon' && draft.length >= 3);

	// Deduct is available while an area tool is active (so you can draw a deduction
	// inside an existing shape). The switch stays enabled while its mode is on so
	// you can turn it off again.
	const isAreaTool = AREA_TYPE_SET.has(tool as MeasurementType);
	const subtractDisabled = !(isCalibrated && (subtractMode || isAreaTool));
	// Drawing tools are disabled until a group is selected (every measurement is
	// filed into a group). Subtract editing of an existing shape is exempt.
	const drawingDisabled = selectedGroupId === null && !subtractMode;

	// Halo every shape related to the selected one (its group members and any
	// deductions) so the relationship reads on the canvas.
	const highlightIds = (() => {
		if (!selectedId) {
			return EMPTY_IDS;
		}
		const related = relatedIds(measurements, selectedId);
		return related.size > 1 ? related : EMPTY_IDS;
	})();

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-1 rounded-lg border bg-card p-1">
					{TOOLS.map((toolDef) => {
						const Icon = toolDef.icon;
						const needsCalibration = toolDef.needsCalibration && !isCalibrated;
						// Measurement tools need a selected group; pan/text are exempt.
						const needsGroup = DRAWING_TOOLS.has(toolDef.id) && drawingDisabled;
						const disabled = needsCalibration || needsGroup;
						let title = toolDef.label;
						if (needsCalibration) {
							title = 'Calibrate this page first';
						} else if (needsGroup) {
							title = 'Select or create a group first';
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
							subtractDisabled && 'opacity-64'
						)}
						title={getSubtractTitle(isCalibrated, isAreaTool || subtractMode)}
					>
						<Switch
							checked={subtractMode}
							disabled={subtractDisabled}
							id="deduct-toggle"
							onCheckedChange={setSubtract}
						/>
						<Label htmlFor="deduct-toggle">Deduct</Label>
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
					documentMethod={documentMethod}
					numPages={numPages}
					onCalibrate={(scope, targetPage) =>
						startCalibration(scope, targetPage)
					}
					onOpenScaleDialog={(scope, targetPage) =>
						openScaleDialog(scope, targetPage)
					}
					onRenamePage={renamePage}
					onResetPage={(targetPage) => {
						resetPageMethod(targetPage).catch(() => {
							// Recompute failure leaves existing values unchanged.
						});
					}}
					onSelectPage={goToPage}
					onToggleShowAll={toggleShowAllPages}
					pageMethods={pageMethods}
					pagesWithMeasurements={pagesWithMeasurements}
					pageTitles={pageTitles}
					ready={ready}
					renderThumbnail={renderThumbnail}
					showAllPages={showAllPages}
					visiblePages={visiblePages}
				/>
				<div className="min-w-0 flex-1">
					<PdfStage
						currentPageName={pageTitles[page] ?? `Page ${page}`}
						cursor={cursor}
						draft={draft}
						error={error}
						globalWastage={globalWastage}
						groups={groups}
						guides={snapGuides}
						highlightIds={highlightIds}
						legends={legends.filter((l) => l.page === page)}
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
						onLegendRemove={removeLegend}
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
						tool={effectiveTool}
						transientPan={spacePanActive}
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
					canUndo={canUndo}
					canvasSelectNonce={canvasSelectNonce}
					categories={categories}
					globalWastage={globalWastage}
					groups={groups}
					legendGroupIds={legendGroupIds}
					measurements={measurements}
					onAddCategory={addCategory}
					onAddGroup={addGroup}
					onAddLegend={addLegend}
					onClearAll={() => {
						setMeasurements([]);
						setLegends([]);
						resetDraft();
						setSelectedId(null);
						setSelectedGroupId(null);
						setSubtractMode(false);
					}}
					onDelete={deleteMeasurement}
					onDeleteCategory={deleteCategory}
					onDeleteGroup={deleteGroup}
					onDownloadSelection={handleDownloadPages}
					onMoveGroup={moveGroup}
					onRecolorGroup={recolorGroup}
					onRemoveLegend={removeGroupLegend}
					onRenameCategory={renameCategory}
					onRenameGroup={renameGroup}
					onRenameMeasurement={renameMeasurement}
					onSaveGroup={saveGroupSession}
					onSaveSelection={onSaveToDocuments ? handleSaveSelection : undefined}
					onSelectGroup={selectGroup}
					onSelectMeasurement={focusMeasurement}
					onSetMeasurementAreaAdjust={setMeasurementAreaAdjust}
					onSetMeasurementDescription={setMeasurementDescription}
					onSetMeasurementHeight={setMeasurementHeight}
					onSetMeasurementWastage={setMeasurementWastage}
					onToggleAllHidden={toggleAllHidden}
					onToggleCategoryHidden={toggleCategoryHidden}
					onToggleGroupHidden={toggleGroupHidden}
					onToggleMeasurementHidden={toggleMeasurementHidden}
					onUndo={undo}
					pageTitles={pageTitles}
					selectedGroupId={selectedGroupId}
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
						<X aria-hidden /> Cancel
					</DialogClose>
					<Button
						disabled={!value || Number(value) <= 0}
						onClick={onConfirm}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> Set scale
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
