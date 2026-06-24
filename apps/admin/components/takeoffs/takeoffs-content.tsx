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
import { cn } from '@workspace/ui/lib/utils';
import {
	Circle,
	Hand,
	Hash,
	MousePointer2,
	Pentagon,
	Ruler,
	Square,
} from 'lucide-react';
import {
	type ReactElement,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
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
	LengthUnit,
	Measurement,
	MeasurementMethod,
	MeasurementType,
	MethodScope,
	PageGeometry,
	Point,
	ScaleSetting,
	ToolId,
} from '@/lib/takeoffs/types';
import { AREA_TYPE_SET } from '@/lib/takeoffs/types';
import MeasurementsPanel from './measurements-panel';
import PdfStage from './pdf-stage';
import PdfThumbnails from './pdf-thumbnails';
import ScaleControl from './scale-control';
import ScaleDialog from './scale-dialog';
import { usePdfDocument } from './use-pdf-document';
import WastageControl from './wastage-control';

const PDF_URL = '/sample-plan.pdf';
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

// Tools that draw a measurement and can therefore belong to an "Add" group.
const DRAWABLE_TOOLS = new Set<ToolId>([
	'linear',
	'rectangle',
	'circle',
	'polygon',
]);

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
	{ id: 'select', label: 'Select', icon: MousePointer2 },
	{ id: 'linear', label: 'Linear', icon: Ruler, needsCalibration: true },
	{ id: 'rectangle', label: 'Rectangle', icon: Square, needsCalibration: true },
	{ id: 'circle', label: 'Circle', icon: Circle, needsCalibration: true },
	{ id: 'polygon', label: 'Polygon', icon: Pentagon, needsCalibration: true },
	{ id: 'count', label: 'Count', icon: Hash },
];

function getAddTitle(isCalibrated: boolean, tool: ToolId): string {
	if (!isCalibrated) {
		return 'Calibrate this page first';
	}
	if (!DRAWABLE_TOOLS.has(tool)) {
		return 'Pick a drawing tool (Linear/Rectangle/Circle/Polygon) to start a combined Add group';
	}
	return 'Every shape/line you draw while Add is on combines into one measurement — switch to Pan or Select to finish the group';
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

export default function TakeoffsContent() {
	const {
		numPages,
		renderPage,
		renderThumbnail,
		extractText,
		getPageGeometry,
		error,
		ready,
	} = usePdfDocument(PDF_URL);

	const [page, setPage] = useState(1);
	const [tool, setTool] = useState<ToolId>('pan');
	// When on, area shapes drawn from the main toolbar are clipped to and
	// subtracted from the parent shape that contains them.
	const [subtractMode, setSubtractMode] = useState(false);
	// When on, every shape/line drawn joins one combined "Add" group: area
	// members union into a single area, linear members sum into one length.
	const [addMode, setAddMode] = useState(false);
	// Id of the group currently being drawn into (ref so commit reads it
	// imperatively without re-running on every change). Null when Add is off.
	const currentGroupId = useRef<string | null>(null);
	const [measurements, setMeasurements] = useState<Measurement[]>([]);
	// PDF text boxes per page (base-pixel space), prefetched so commit() can read
	// them synchronously to auto-name area shapes.
	const pageTextRef = useRef<Map<number, TextBox[]>>(new Map());
	// PDF-wide default measurement method (scale or calibration), plus optional
	// per-page overrides. Defaults to a 1:100 A3 drawing scale so tools work
	// immediately.
	const [documentMethod, setDocumentMethod] =
		useState<MeasurementMethod | null>({ kind: 'scale', scale: DEFAULT_SCALE });
	const [pageMethods, setPageMethods] = useState<
		Record<number, MeasurementMethod>
	>({});
	// Default wastage allowance (%) applied to every measurement; individual
	// measurements may override it via their row in the measurements panel.
	const [globalWastage, setGlobalWastage] = useState<number>(DEFAULT_WASTAGE);
	// Geometry of the current page (natural + base-pixel dims), needed to resolve
	// a drawing scale into metres-per-pixel.
	const [pageGeometry, setPageGeometry] = useState<PageGeometry | null>(null);
	const [draft, setDraft] = useState<Point[]>([]);
	const [cursor, setCursor] = useState<Point | null>(null);
	const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
	// Currently selected committed shape (Select tool) for editing/move.
	const [selectedId, setSelectedId] = useState<string | null>(null);
	// Mirrors `draft` synchronously so rapid clicks accumulate correctly even
	// before React re-renders (state reads in handlers would otherwise be stale).
	const draftRef = useRef<Point[]>([]);
	// Active pointer drag (draw / move / resize). Ref-driven like `draftRef` so
	// native SVG listeners read the latest value without stale closures.
	const dragRef = useRef<DragKind | null>(null);
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
	}, [writeDraft]);

	const selectTool = useCallback(
		(next: ToolId) => {
			setTool(next);
			// Keep Subtract mode active when switching to an area shape (so the main
			// toolbar icons draw deductions); any other tool exits Subtract mode.
			setSubtractMode((on) => on && AREA_TYPE_SET.has(next as MeasurementType));
			// Keep Add mode active across any drawable tool; leaving the drawable
			// tools closes the active group.
			const keepAdd = addMode && DRAWABLE_TOOLS.has(next);
			setAddMode(keepAdd);
			if (!keepAdd) {
				currentGroupId.current = null;
			}
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft, addMode]
	);

	// Toggle Subtract mode. Only reachable from Select mode (the switch is
	// disabled otherwise), so it just sets the flag without changing the tool.
	const setSubtract = useCallback(
		(on: boolean) => {
			setSubtractMode(on);
			// Add and Subtract are mutually exclusive.
			if (on) {
				setAddMode(false);
				currentGroupId.current = null;
			}
			// Drop focus off the toggle so a subsequent Enter commits the draft via
			// the global handler instead of re-toggling this still-focused switch.
			(document.activeElement as HTMLElement | null)?.blur();
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft]
	);

	// Toggle Add mode. Turning it on opens a fresh combined group and disables
	// Subtract; turning it off closes the active group.
	const setAdd = useCallback(
		(on: boolean) => {
			setAddMode(on);
			if (on) {
				setSubtractMode(false);
				currentGroupId.current = crypto.randomUUID();
			} else {
				currentGroupId.current = null;
			}
			// Drop focus off the toggle so a subsequent Enter commits the draft via
			// the global handler instead of re-toggling this still-focused switch.
			(document.activeElement as HTMLElement | null)?.blur();
			resetDraft();
			setSelectedId(null);
		},
		[resetDraft]
	);

	const goToPage = useCallback(
		(next: number) => {
			setPage(() => Math.min(Math.max(next, 1), numPages || 1));
			resetDraft();
			setSelectedId(null);
			// Groups are single-page: close the active group so the next shape on the
			// new page starts a fresh one (Add stays on).
			currentGroupId.current = null;
		},
		[numPages, resetDraft]
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
			// In Add mode, resolve which group this shape joins. Compute it here
			// (not inside the state updater) so the ref/UUID side effects stay out of
			// the pure updater. A shape whose family (area vs linear) differs from the
			// active group's members starts a fresh group.
			let groupId: string | undefined;
			if (addMode) {
				const newIsArea = AREA_TYPE_SET.has(type);
				let gid = currentGroupId.current;
				const familyMismatch =
					gid !== null &&
					measurements.some(
						(m) => m.groupId === gid && AREA_TYPE_SET.has(m.type) !== newIsArea
					);
				if (gid === null || familyMismatch) {
					gid = crypto.randomUUID();
					currentGroupId.current = gid;
				}
				groupId = gid;
			}
			setMeasurements((prev) => {
				// In subtract mode, clip the new area shape to the parent it overlaps
				// and store it as that parent's deduction; if none overlaps, it commits
				// as a normal area shape. Add and Subtract are mutually exclusive.
				let finalType = type;
				let finalPoints = points;
				let parentId: string | undefined;
				if (!addMode && subtractMode && AREA_TYPE_SET.has(type)) {
					const clipped = clipToParent({ type, points }, prev, page);
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
				// reuse the group's existing colour so the whole group stays uniform.
				let color: string | undefined;
				if (!parentId) {
					color = groupId
						? (prev.find((m) => m.groupId === groupId)?.color ??
							randomShapeColor())
						: randomShapeColor();
				}
				return [
					...prev,
					{
						id: crypto.randomUUID(),
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
			if (tool === 'count') {
				setMeasurements((prev) => {
					const existing = prev.find(
						(m) => m.type === 'count' && m.page === page
					);
					if (existing) {
						return prev.map((m) =>
							m.id === existing.id
								? {
										...m,
										points: [...m.points, point],
										count: m.points.length + 1,
									}
								: m
						);
					}
					return [
						...prev,
						{
							id: crypto.randomUUID(),
							page,
							type: 'count',
							points: [point],
							count: 1,
							color: randomShapeColor(),
							label: 'Count',
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
		[tool, page, calibTargetScope, writeDraft, computeSnap]
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
					// Move the parent's deductions along with it.
					for (const child of drag.children ?? []) {
						updateMeasurementPoints(
							child.id,
							translatePoints(child.orig, dx, dy)
						);
					}
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
		// Deleting a parent also removes its deductions; deleting any group member
		// removes the whole group.
		setMeasurements((prev) => {
			const gid = prev.find((m) => m.id === id)?.groupId;
			return prev.filter(
				(m) =>
					m.id !== id && m.parentId !== id && (gid ? m.groupId !== gid : true)
			);
		});
		setSelectedId((current) => (current === id ? null : current));
	}, []);

	// Pages that currently hold at least one measurement (for the thumbnail "M"
	// indicator and the per-page accordion in the measurements panel).
	const pagesWithMeasurements = useMemo(
		() => new Set(measurements.map((m) => m.page)),
		[measurements]
	);

	// Jump to a measurement: switch to Select, navigate to its page, and select
	// it. Done inline (not via goToPage/selectTool) so the selection isn't cleared.
	const focusMeasurement = useCallback(
		(id: string) => {
			const target = measurements.find((m) => m.id === id);
			if (!target) {
				return;
			}
			setTool('select');
			setSubtractMode(false);
			setAddMode(false);
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

	// Keyboard shortcuts for drawing and editing.
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (calibLine) {
				return;
			}
			const editingSelection =
				tool === 'select' &&
				selectedId !== null &&
				draftRef.current.length === 0;
			if (event.key === 'Enter') {
				finishDraft();
			} else if (event.key === 'Escape') {
				resetDraft();
				setSelectedId(null);
			} else if (
				(event.key === 'Delete' || event.key === 'Backspace') &&
				editingSelection
			) {
				event.preventDefault();
				deleteMeasurement(selectedId);
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
		deleteMeasurement,
	]);

	const canFinish =
		(tool === 'linear' && draft.length >= 2) ||
		(tool === 'polygon' && draft.length >= 3);
	// Subtract is toggled from Select mode; Add is toggled while a drawing tool is
	// active (every shape drawn joins the group until you leave to Pan/Select).
	const subtractDisabled = tool !== 'select' || !isCalibrated || addMode;
	const addDisabled = !(isCalibrated && DRAWABLE_TOOLS.has(tool));

	return (
		<div className="flex h-full min-h-0 w-full flex-col gap-3">
			<div className="flex flex-wrap items-center gap-2">
				<div className="flex items-center gap-1 rounded-lg border bg-card p-1">
					{TOOLS.map((toolDef) => {
						const Icon = toolDef.icon;
						const disabled = toolDef.needsCalibration && !isCalibrated;
						return (
							<Button
								disabled={disabled}
								key={toolDef.id}
								onClick={() => selectTool(toolDef.id)}
								size="sm"
								title={disabled ? 'Calibrate this page first' : toolDef.label}
								variant={tool === toolDef.id ? 'default' : 'ghost'}
							>
								<Icon />
								{toolDef.label}
							</Button>
						);
					})}
				</div>

				<div
					className={cn(
						'flex items-center gap-2 px-3 py-1.5',
						addDisabled && 'opacity-64'
					)}
					title={getAddTitle(isCalibrated, tool)}
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
					title={
						isCalibrated
							? 'In Select mode, toggle Subtract then draw an area shape to deduct it'
							: 'Calibrate this page first'
					}
				>
					<Switch
						checked={subtractMode}
						disabled={subtractDisabled}
						id="subtract-toggle"
						onCheckedChange={setSubtract}
					/>
					<Label htmlFor="subtract-toggle">Subtract</Label>
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

			<div className="flex min-h-0 flex-1 gap-3">
				<PdfThumbnails
					currentPage={page}
					numPages={numPages}
					onSelectPage={goToPage}
					pagesWithMeasurements={pagesWithMeasurements}
					ready={ready}
					renderThumbnail={renderThumbnail}
				/>
				<div className="min-w-0 flex-1">
					<PdfStage
						cursor={cursor}
						draft={draft}
						error={error}
						guides={snapGuides}
						measurements={measurements.filter((m) => m.page === page)}
						metersPerPixel={metersPerPixel}
						numPages={numPages}
						onCursorMove={handleCursorMove}
						onDragStart={handleDragStart}
						onExitToPan={() => selectTool('pan')}
						onPointerUp={handlePointerUp}
						onStageClick={handleStageClick}
						onStageDoubleClick={finishDraft}
						page={page}
						ready={ready}
						renderPage={renderPage}
						selectedId={selectedId}
						tool={tool}
					/>
				</div>

				<MeasurementsPanel
					documentMethod={documentMethod}
					globalWastage={globalWastage}
					measurements={measurements}
					metersPerPixel={metersPerPixel}
					onCalibrate={(scope, targetPage) =>
						startCalibration(scope, targetPage)
					}
					onClearAll={() => {
						setMeasurements([]);
						resetDraft();
						setSelectedId(null);
						currentGroupId.current = null;
					}}
					onClearPage={() => {
						setMeasurements((prev) => prev.filter((m) => m.page !== page));
						resetDraft();
						setSelectedId(null);
						currentGroupId.current = null;
					}}
					onDelete={deleteMeasurement}
					onOpenScaleDialog={(scope, targetPage) =>
						openScaleDialog(scope, targetPage)
					}
					onRecolorMeasurement={recolorMeasurement}
					onRenameMeasurement={renameMeasurement}
					onResetPage={(targetPage) => {
						resetPageMethod(targetPage).catch(() => {
							// Recompute failure leaves existing values unchanged.
						});
					}}
					onSelectMeasurement={focusMeasurement}
					onSetMeasurementWastage={setMeasurementWastage}
					page={page}
					pageMethods={pageMethods}
					selectedId={selectedId}
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
