'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { cn } from '@workspace/ui/lib/utils';
import { Maximize, Minus, Plus } from 'lucide-react';
import {
	type ReactElement,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	type ReactZoomPanPinchRef,
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch';
import {
	circleArea,
	circleRadius,
	distanceSq,
	distanceToSegmentSq,
	formatMeters,
	formatSqm,
	groupColorMap,
	isInsideBody,
	pointerToBaseCoords,
	polygonArea,
	polylineLength,
	rectArea,
	rectBounds,
	rectCorners,
	type SnapGuide,
	shapeTopCenter,
	shapeValueLabel,
} from '@/lib/takeoffs/geometry';
import {
	AREA_TYPE_SET,
	type DragKind,
	type Legend,
	type Measurement,
	type Point,
	type TextAnnotation,
	type ToolId,
} from '@/lib/takeoffs/types';
import LegendOverlay from './legend-overlay';
import { buildRows } from './measurements-panel';
import TextOverlay from './text-overlay';
import type { RenderedSize } from './use-pdf-document';

const TOOL_COLORS: Record<string, string> = {
	calibrate: '#f59e0b',
	linear: '#2563eb',
	rectangle: '#059669',
	circle: '#059669',
	polygon: '#059669',
	count: '#7c3aed',
};

// Handle visual radius and grab tolerance in *screen* pixels (divided by the
// zoom scale to stay constant on screen).
const HANDLE_PX = 5;
const HANDLE_HIT_PX = 10;

// Mouse-wheel zoom tuning. The built-in react-zoom-pan-pinch wheel zoom multiplies
// the step by the raw deltaY and applies it additively, which jumps wildly between
// devices. Instead we do our own cursor-centred, multiplicative zoom: each event
// scales by exp(-clampedDeltaY * ZOOM_INTENSITY), giving a consistent geometric
// step regardless of how large a device's deltaY is.
const ZOOM_INTENSITY = 0.0015;
const MAX_WHEEL_DELTA = 50;

interface PdfStageProps {
	// Display name of the current page; shown as an overlay badge on the canvas.
	currentPageName: string;
	cursor: Point | null;
	draft: Point[];
	error: string | null;
	globalWastage: number;
	guides: SnapGuide[];
	// Shapes to halo as "related" — the selected shape's whole group/parent and
	// the active Add/Subtract target group.
	highlightIds: ReadonlySet<string>;
	legend: Legend | null;
	measurements: Measurement[];
	metersPerPixel: number | null;
	newTextId: string | null;
	numPages: number;
	onClearSelection: () => void;
	onCursorMove: (point: Point | null, snap?: boolean, scale?: number) => void;
	onDragStart: (drag: DragKind) => void;
	onLegendChange: (next: { width: number; x: number; y: number }) => void;
	onLegendRemove: () => void;
	onPointerUp: (point: Point) => void;
	onStageClick: (point: Point, snap?: boolean, scale?: number) => void;
	onStageDoubleClick: () => void;
	onTextAutoFocused: () => void;
	onTextChange: (id: string, text: string) => void;
	onTextColorChange: (id: string, color: string) => void;
	onTextGeometryChange: (
		id: string,
		next: { height: number; width: number; x: number; y: number }
	) => void;
	onTextRemove: (id: string) => void;
	page: number;
	ready: boolean;
	renderPage: (
		pageNumber: number,
		canvas: HTMLCanvasElement
	) => Promise<RenderedSize | null>;
	selectedId: string | null;
	// Index of the selected marker within the selected count (else null).
	selectedMarkerIndex: number | null;
	// Burn each shape's actual measured value into a badge at its top edge.
	showMeasurements: boolean;
	textAnnotations: TextAnnotation[];
	tool: ToolId;
}

function centroid(points: Point[]): Point {
	const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
		x: 0,
		y: 0,
	});
	return { x: sum.x / points.length, y: sum.y / points.length };
}

function midpoint(a: Point, b: Point): Point {
	return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/**
 * Resolve a Select-tool pointer-down into a drag intent: a resize handle of the
 * selected shape (tested first, with a screen-constant tolerance), then the body
 * of any area-like shape (topmost first), else null (deselect).
 */
function hitTest(
	point: Point,
	measurements: Measurement[],
	selectedId: string | null,
	scale: number
): DragKind | null {
	const tolSq = (HANDLE_HIT_PX / scale) ** 2;
	const selected = selectedId
		? measurements.find((m) => m.id === selectedId)
		: undefined;
	// A selected count: re-grab one of its markers first, so an already-selected
	// marker stays grabbable even when other shapes overlap it.
	if (selected && selected.type === 'count') {
		for (let k = 0; k < selected.points.length; k++) {
			if (distanceSq(point, selected.points[k]) <= tolSq) {
				return {
					mode: 'marker',
					id: selected.id,
					index: k,
					orig: selected.points,
				};
			}
		}
	}
	if (selected && AREA_TYPE_SET.has(selected.type)) {
		if (selected.type === 'rectangle') {
			const corners = rectCorners(selected.points);
			for (let k = 0; k < corners.length; k++) {
				if (distanceSq(point, corners[k]) <= tolSq) {
					// Keep the opposite corner fixed; resize stays axis-aligned.
					const opposite = corners[(k + 2) % corners.length];
					return {
						mode: 'handle',
						id: selected.id,
						index: 1,
						orig: [opposite, corners[k]],
					};
				}
			}
		} else if (selected.type === 'circle') {
			if (distanceSq(point, selected.points[1]) <= tolSq) {
				return {
					mode: 'handle',
					id: selected.id,
					index: 1,
					orig: selected.points,
				};
			}
		} else {
			for (let k = 0; k < selected.points.length; k++) {
				if (distanceSq(point, selected.points[k]) <= tolSq) {
					return {
						mode: 'handle',
						id: selected.id,
						index: k,
						orig: selected.points,
					};
				}
			}
		}
	}
	// Dragging a whole edge of the selected polygon/rectangle (after corner
	// handles, so corners win at their intersections).
	if (
		selected &&
		(selected.type === 'polygon' || selected.type === 'rectangle')
	) {
		const edge = edgeHitTest(point, selected, tolSq);
		if (edge) {
			return {
				mode: 'edge',
				id: selected.id,
				orig: selected.points,
				axis: edge.axis,
				indices: edge.indices,
				start: point,
			};
		}
	}
	for (let i = measurements.length - 1; i >= 0; i--) {
		const m = measurements[i];
		// Count markers are grabbed individually (select/move/delete one marker).
		if (m.type === 'count') {
			for (let k = 0; k < m.points.length; k++) {
				if (distanceSq(point, m.points[k]) <= tolSq) {
					return { mode: 'marker', id: m.id, index: k, orig: m.points };
				}
			}
			continue;
		}
		const grabbable = AREA_TYPE_SET.has(m.type)
			? isInsideBody(m, point)
			: m.type === 'linear' && isOnPolyline(point, m.points, tolSq);
		if (grabbable) {
			return {
				mode: 'move',
				id: m.id,
				start: point,
				orig: m.points,
			};
		}
	}
	return null;
}

/** Whether `point` is within `tolSq` of any segment of a polyline. */
function isOnPolyline(point: Point, pts: Point[], tolSq: number): boolean {
	for (let i = 1; i < pts.length; i++) {
		if (distanceToSegmentSq(point, pts[i - 1], pts[i]) <= tolSq) {
			return true;
		}
	}
	return false;
}

/**
 * Detect whether `point` is near an edge of `shape` (polygon or rectangle). The
 * returned `axis` is the coordinate that dragging adjusts ('x' for vertical
 * edges, 'y' for horizontal ones) and `indices` are the points to move along it.
 */
function edgeHitTest(
	point: Point,
	shape: Measurement,
	tolSq: number
): { axis: 'x' | 'y'; indices: number[] } | null {
	if (shape.type === 'polygon') {
		const pts = shape.points;
		for (let i = 0; i < pts.length; i++) {
			const a = pts[i];
			const b = pts[(i + 1) % pts.length];
			if (distanceToSegmentSq(point, a, b) <= tolSq) {
				const axis: 'x' | 'y' =
					Math.abs(b.y - a.y) >= Math.abs(b.x - a.x) ? 'x' : 'y';
				return { axis, indices: [i, (i + 1) % pts.length] };
			}
		}
		return null;
	}
	if (shape.type === 'rectangle') {
		const pts = shape.points;
		const c = rectCorners(pts); // TL, TR, BR, BL
		const sides = [
			{ a: c[0], b: c[1], axis: 'y' as const, far: false }, // top → min y
			{ a: c[1], b: c[2], axis: 'x' as const, far: true }, // right → max x
			{ a: c[2], b: c[3], axis: 'y' as const, far: true }, // bottom → max y
			{ a: c[3], b: c[0], axis: 'x' as const, far: false }, // left → min x
		];
		for (const s of sides) {
			if (distanceToSegmentSq(point, s.a, s.b) > tolSq) {
				continue;
			}
			// Pick the stored corner that owns this side, so moving it drags the
			// whole edge (the other corner is derived from the bounds).
			const lowFirst = pts[0][s.axis] <= pts[1][s.axis];
			const wantsHigh = s.far ? lowFirst : !lowFirst;
			return { axis: s.axis, indices: [wantsHigh ? 1 : 0] };
		}
		return null;
	}
	return null;
}

/** Cursor for the Select tool based on what's under the pointer. */
function selectCursor(
	point: Point,
	measurements: Measurement[],
	selectedId: string | null,
	scale: number
): string {
	const drag = hitTest(point, measurements, selectedId, scale);
	if (!drag) {
		return 'default';
	}
	if (drag.mode === 'edge') {
		return drag.axis === 'x' ? 'ew-resize' : 'ns-resize';
	}
	if (drag.mode === 'handle') {
		return 'grab';
	}
	if (drag.mode === 'move' || drag.mode === 'marker') {
		return 'move';
	}
	return 'default';
}

export default function PdfStage({
	page,
	numPages,
	currentPageName,
	ready,
	error,
	renderPage,
	tool,
	globalWastage,
	metersPerPixel,
	measurements,
	draft,
	cursor,
	guides,
	highlightIds,
	legend,
	selectedId,
	selectedMarkerIndex,
	showMeasurements,
	onStageClick,
	onStageDoubleClick,
	onCursorMove,
	onDragStart,
	onLegendChange,
	onLegendRemove,
	onPointerUp,
	onClearSelection,
	textAnnotations,
	newTextId,
	onTextChange,
	onTextColorChange,
	onTextGeometryChange,
	onTextRemove,
	onTextAutoFocused,
}: PdfStageProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const transformRef = useRef<ReactZoomPanPinchRef>(null);
	const [size, setSize] = useState<{ width: number; height: number } | null>(
		null
	);
	const [scale, setScale] = useState(1);
	const [fitScale, setFitScale] = useState(1);
	const [rendering, setRendering] = useState(true);
	// In Pan mode the overlay is click-through, so we hover-detect over committed
	// shapes from a container listener and flip the overlay to capture events (and
	// disable panning) only while the pointer is over something selectable.
	const [hoverSelectable, setHoverSelectable] = useState(false);

	// Scale the page so it fully fits the viewport, and centre it.
	const fitToWindow = useCallback(
		(renderedSize?: { width: number; height: number }) => {
			const target = renderedSize ?? size;
			const wrapper = transformRef.current?.instance.wrapperComponent;
			if (!(target && wrapper)) {
				return;
			}
			const fit = Math.min(
				wrapper.clientWidth / target.width,
				wrapper.clientHeight / target.height
			);
			setFitScale(fit);
			transformRef.current?.setTransform(
				(wrapper.clientWidth - target.width * fit) / 2,
				(wrapper.clientHeight - target.height * fit) / 2,
				fit,
				0
			);
		},
		[size]
	);

	// Smooth, cursor-centred mouse-wheel zoom. We use a native non-passive listener
	// because React's synthetic onWheel is passive and can't reliably preventDefault.
	// The library's own wheel zoom is disabled (see TransformWrapper below); everything
	// is read fresh from the ref per event so there is no stale state to track.
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const handleWheel = (e: WheelEvent) => {
			const instance = transformRef.current?.instance;
			const wrapper = instance?.wrapperComponent;
			if (!(instance && wrapper)) {
				return;
			}
			e.preventDefault();

			const { scale, positionX, positionY } = instance.state;
			const { minScale, maxScale } = instance.setup;

			const clampedDelta = Math.max(
				-MAX_WHEEL_DELTA,
				Math.min(MAX_WHEEL_DELTA, e.deltaY)
			);
			const factor = Math.exp(-clampedDelta * ZOOM_INTENSITY);
			const newScale = Math.min(maxScale, Math.max(minScale, scale * factor));
			if (newScale === scale) {
				return;
			}

			// Keep the point under the cursor fixed while zooming.
			const rect = wrapper.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			const newX = mouseX - ((mouseX - positionX) / scale) * newScale;
			const newY = mouseY - ((mouseY - positionY) / scale) * newScale;
			transformRef.current?.setTransform(newX, newY, newScale, 0);
		};
		container.addEventListener('wheel', handleWheel, { passive: false });
		return () => container.removeEventListener('wheel', handleWheel);
	}, []);

	useEffect(() => {
		if (!(ready && canvasRef.current)) {
			return;
		}
		let active = true;
		setRendering(true);
		(async () => {
			const rendered = await renderPage(
				page,
				canvasRef.current as HTMLCanvasElement
			);
			if (active && rendered) {
				setSize(rendered);
				setRendering(false);
			}
		})();
		return () => {
			active = false;
		};
	}, [ready, page, renderPage]);

	// Fit the page to the viewport whenever it (re)renders or the window resizes.
	useEffect(() => {
		fitToWindow();
		const handler = () => fitToWindow();
		window.addEventListener('resize', handler);
		return () => window.removeEventListener('resize', handler);
	}, [fitToWindow]);

	// Any non-pan tool captures pointer events on the overlay (and disables
	// panning). `select` edits committed shapes; the rest draw.
	// Every non-pan tool draws and captures overlay events (and disables panning).
	// Pan is the default "pan + select" tool: it pans empty space but grabs/edits
	// committed shapes directly (see hover detection below).
	const isInteractive = tool !== 'pan';
	const isDrawingTool = isInteractive;
	const stroke = TOOL_COLORS[tool] ?? '#2563eb';
	// Stable colour per Add group so all its members read as one combined shape.
	const groupColors = groupColorMap(measurements);
	// Keep stroke/markers a constant screen size regardless of zoom.
	const strokeWidth = 2 / scale;
	const vertexRadius = 4 / scale;
	const handleRadius = HANDLE_PX / scale;
	const fontSize = 13 / scale;

	const toBase = (event: {
		clientX: number;
		clientY: number;
	}): Point | null => {
		if (!(svgRef.current && size)) {
			return null;
		}
		return pointerToBaseCoords(event, svgRef.current, size.width, size.height);
	};

	// react-zoom-pan-pinch stops click propagation before it reaches React's
	// delegated root listener, so React's onClick/onMouseMove on the overlay
	// never fire. Bind native listeners directly on the SVG element instead.
	const handlersRef = useRef({
		isInteractive,
		tool,
		scale,
		measurements,
		selectedId,
		toBase,
		onStageClick,
		onStageDoubleClick,
		onCursorMove,
		onDragStart,
		onPointerUp,
		onClearSelection,
	});
	useEffect(() => {
		handlersRef.current = {
			isInteractive,
			tool,
			scale,
			measurements,
			selectedId,
			toBase,
			onStageClick,
			onStageDoubleClick,
			onCursorMove,
			onDragStart,
			onPointerUp,
			onClearSelection,
		};
	});
	// True between a mousedown that began a drag and the trailing synthetic
	// click, so that click is swallowed (it would otherwise add a stray point
	// or re-trigger selection).
	const draggingRef = useRef(false);
	// Stable callback ref: attaches native listeners when the SVG mounts and
	// returns its cleanup (React 19 ref-cleanup), so it never re-binds per render.
	const setOverlayRef = useCallback((svg: SVGSVGElement | null) => {
		svgRef.current = svg;
		if (!svg) {
			return;
		}
		const handleDown = (event: MouseEvent) => {
			const h = handlersRef.current;
			const point = h.toBase(event);
			if (!point) {
				return;
			}
			let drag: DragKind | null = null;
			if (h.tool === 'rectangle') {
				drag = { mode: 'draw-rect', start: point };
			} else if (h.tool === 'circle') {
				drag = { mode: 'draw-circle', start: point };
			} else if (h.tool === 'pan') {
				drag = hitTest(point, h.measurements, h.selectedId, h.scale);
			}
			if (drag) {
				draggingRef.current = true;
				h.onDragStart(drag);
			} else if (h.tool === 'pan') {
				// The overlay only captures the mousedown when hovering a shape, so a
				// null hit here is a rare sub-frame race; treat it as an empty-space
				// click and clear the current selection.
				h.onClearSelection();
			}
		};
		const handleUp = (event: MouseEvent) => {
			const h = handlersRef.current;
			// The drag ends here. Clear the latch on mouseup rather than relying on
			// the trailing synthetic click (which the browser suppresses after a
			// far-travelling drag, otherwise leaving the ref stuck `true` and killing
			// Pan-mode hover-selection until a refresh).
			draggingRef.current = false;
			const point = h.toBase(event);
			if (point) {
				h.onPointerUp(point);
			}
		};
		const handleClick = (event: MouseEvent) => {
			const h = handlersRef.current;
			if (draggingRef.current) {
				draggingRef.current = false;
				return;
			}
			if (!h.isInteractive) {
				return;
			}
			const point = h.toBase(event);
			if (point) {
				h.onStageClick(point, event.shiftKey, h.scale);
			}
		};
		const handleDoubleClick = () => handlersRef.current.onStageDoubleClick();
		const handleMove = (event: MouseEvent) => {
			const h = handlersRef.current;
			// The overlay only receives moves when it's capturing events: while a
			// drawing tool is active, or (in Pan mode) while over a shape or dragging.
			if (!(h.isInteractive || h.tool === 'pan')) {
				return;
			}
			const point = h.toBase(event);
			h.onCursorMove(point, event.shiftKey, h.scale);
			// Under the Pan tool, reflect what's under the pointer (resize edges, grab
			// handles, move bodies) by driving the cursor imperatively.
			if (h.tool === 'pan' && svgRef.current) {
				svgRef.current.style.cursor = point
					? selectCursor(point, h.measurements, h.selectedId, h.scale)
					: 'default';
			}
		};
		const handleLeave = () => {
			const h = handlersRef.current;
			h.onCursorMove(null);
			// Only Pan drives the cursor imperatively, so only it needs resetting on
			// leave. Clobbering it for drawing tools would override the React inline
			// `crosshair` and never restore it (the style value is unchanged across
			// drawing-tool switches, so React skips the DOM update).
			if (svgRef.current && h.tool === 'pan') {
				svgRef.current.style.cursor = 'default';
			}
		};
		svg.addEventListener('mousedown', handleDown);
		svg.addEventListener('mouseup', handleUp);
		svg.addEventListener('click', handleClick);
		svg.addEventListener('dblclick', handleDoubleClick);
		svg.addEventListener('mousemove', handleMove);
		svg.addEventListener('mouseleave', handleLeave);
		return () => {
			svg.removeEventListener('mousedown', handleDown);
			svg.removeEventListener('mouseup', handleUp);
			svg.removeEventListener('click', handleClick);
			svg.removeEventListener('dblclick', handleDoubleClick);
			svg.removeEventListener('mousemove', handleMove);
			svg.removeEventListener('mouseleave', handleLeave);
		};
	}, []);

	// Pan-mode hover detection. The overlay is click-through over empty space, so
	// the SVG can't see those moves — detect hover over committed shapes here and
	// flip `hoverSelectable`, which makes the overlay capture events and disables
	// panning so the next click selects (instead of pans) the shape. Listeners are
	// capture-phase so they fire before react-zoom-pan-pinch's propagation handling.
	useEffect(() => {
		const container = containerRef.current;
		if (!container) {
			return;
		}
		const handleHover = (event: MouseEvent) => {
			const h = handlersRef.current;
			if (h.tool !== 'pan') {
				return;
			}
			// Latch the hover state during an active drag so the overlay stays
			// capturing and panning stays disabled even if the pointer briefly
			// leaves the shape mid-move.
			if (draggingRef.current) {
				return;
			}
			const point = h.toBase(event);
			const hit = point
				? hitTest(point, h.measurements, h.selectedId, h.scale)
				: null;
			setHoverSelectable(Boolean(hit));
		};
		const handleDownCapture = (event: MouseEvent) => {
			const h = handlersRef.current;
			if (h.tool !== 'pan') {
				return;
			}
			const point = h.toBase(event);
			const hit = point
				? hitTest(point, h.measurements, h.selectedId, h.scale)
				: null;
			// Empty space: clear the selection (and let panning proceed). A hit is
			// handled by the overlay's own mousedown, which performs the select.
			if (!hit) {
				h.onClearSelection();
			}
		};
		container.addEventListener('mousemove', handleHover, { capture: true });
		container.addEventListener('mousedown', handleDownCapture, {
			capture: true,
		});
		return () => {
			container.removeEventListener('mousemove', handleHover, {
				capture: true,
			});
			container.removeEventListener('mousedown', handleDownCapture, {
				capture: true,
			});
		};
	}, []);

	// Name of the current selection, shown as a badge on the canvas so the active
	// measurement reads at a glance without scanning the side panel. A grouped
	// shape shows its group's name (matching the panel) rather than its own label.
	const selectedMeasurement = selectedId
		? measurements.find((m) => m.id === selectedId)
		: undefined;
	let selectedName = selectedMeasurement?.label;
	if (selectedMeasurement?.groupId) {
		const groupRow = buildRows(measurements).find(
			(row) =>
				row.kind === 'group' && row.groupId === selectedMeasurement.groupId
		);
		if (groupRow?.kind === 'group') {
			selectedName = groupRow.label;
		}
	}

	if (error) {
		return (
			<div className="flex h-full items-center justify-center text-destructive-foreground text-sm">
				Failed to load PDF: {error}
			</div>
		);
	}

	return (
		<div
			className={cn(
				'relative h-full w-full overflow-hidden rounded-lg border bg-muted/40',
				// Pan tool: show a grab/grabbing hand (the overlay is pointer-transparent
				// in pan mode, so the cursor is inherited from this container).
				tool === 'pan' && 'cursor-grab active:cursor-grabbing'
			)}
			ref={containerRef}
		>
			{(rendering || !size) && (
				<div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60">
					<Spinner />
				</div>
			)}
			<TransformWrapper
				doubleClick={{ disabled: true }}
				limitToBounds={false}
				maxScale={fitScale * 16}
				minScale={fitScale * 0.5}
				onTransform={(_ref, state) => setScale(state.scale)}
				panning={{ disabled: isInteractive || hoverSelectable }}
				ref={transformRef}
				wheel={{ disabled: true }}
			>
				<TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
					<div
						className="relative"
						style={{ width: size?.width ?? 0, height: size?.height ?? 0 }}
					>
						<canvas className="block" ref={canvasRef} />
						{size && (
							<svg
								aria-label="Measurement overlay"
								className="absolute inset-0"
								height={size.height}
								ref={setOverlayRef}
								role="img"
								style={{
									pointerEvents:
										isInteractive || hoverSelectable ? 'auto' : 'none',
									// Pan mode drives the cursor imperatively (see handleMove);
									// leaving it unset here keeps React from resetting it per render
									// and lets the imperative select cursor win when over a shape.
									...(tool === 'pan'
										? {}
										: { cursor: isDrawingTool ? 'crosshair' : 'default' }),
								}}
								viewBox={`0 0 ${size.width} ${size.height}`}
								width={size.width}
							>
								<title>Measurement overlay</title>
								{measurements.map((m) => (
									<CommittedShape
										fontSize={fontSize}
										groupColor={
											m.groupId ? groupColors.get(m.groupId) : undefined
										}
										handleRadius={handleRadius}
										highlighted={highlightIds.has(m.id)}
										key={m.id}
										measurement={m}
										selected={m.id === selectedId}
										selectedMarkerIndex={
											m.id === selectedId ? selectedMarkerIndex : null
										}
										strokeWidth={strokeWidth}
										valueLabel={showMeasurements ? shapeValueLabel(m) : null}
										vertexRadius={vertexRadius}
									/>
								))}
								{guides.map((g) => (
									<line
										key={`${g.axis}-${g.value}`}
										stroke="#ec4899"
										strokeDasharray={`${4 / scale} ${4 / scale}`}
										strokeWidth={strokeWidth}
										x1={g.axis === 'x' ? g.value : 0}
										x2={g.axis === 'x' ? g.value : size.width}
										y1={g.axis === 'y' ? g.value : 0}
										y2={g.axis === 'y' ? g.value : size.height}
									/>
								))}
								<DraftShape
									cursor={cursor}
									fontSize={fontSize}
									metersPerPixel={metersPerPixel}
									points={draft}
									stroke={stroke}
									strokeWidth={strokeWidth}
									tool={tool}
									vertexRadius={vertexRadius}
								/>
							</svg>
						)}
						{size && legend && (
							<LegendOverlay
								globalWastage={globalWastage}
								legend={legend}
								measurements={measurements}
								metersPerPixel={metersPerPixel}
								onChange={onLegendChange}
								onRemove={onLegendRemove}
								scale={scale}
							/>
						)}
						{size &&
							textAnnotations.map((annotation) => (
								<TextOverlay
									annotation={annotation}
									autoFocus={annotation.id === newTextId}
									key={annotation.id}
									onAutoFocused={onTextAutoFocused}
									onChange={(next) => onTextGeometryChange(annotation.id, next)}
									onColorChange={(color) =>
										onTextColorChange(annotation.id, color)
									}
									onRemove={() => onTextRemove(annotation.id)}
									onTextChange={(text) => onTextChange(annotation.id, text)}
									scale={scale}
								/>
							))}
					</div>
				</TransformComponent>
			</TransformWrapper>

			<div className="pointer-events-none absolute top-2 left-2 max-w-[16rem]">
				<Badge
					className="max-w-full bg-background/90 shadow-sm"
					size="lg"
					title={currentPageName}
					variant="outline"
				>
					<span className="min-w-0 truncate">{currentPageName}</span>
				</Badge>
			</div>

			{selectedName ? (
				<div className="pointer-events-none absolute top-2 right-2 max-w-[16rem]">
					<Badge
						className="max-w-full bg-background/90 shadow-sm"
						size="lg"
						title={selectedName}
						variant="outline"
					>
						<span className="min-w-0 truncate">{selectedName}</span>
					</Badge>
				</div>
			) : null}

			<div className="pointer-events-none absolute bottom-2 left-2 rounded-md bg-background/90 px-2 py-1 text-muted-foreground text-xs shadow-sm">
				Page {page} / {numPages || '–'} · Zoom{' '}
				{Math.round((scale / fitScale) * 100)}%
			</div>

			<div className="absolute right-2 bottom-2 flex items-center gap-1 rounded-md border bg-background/90 p-1 shadow-sm">
				<Button
					aria-label="Zoom out"
					onClick={() => transformRef.current?.zoomOut(0.2)}
					size="icon-sm"
					variant="ghost"
				>
					<Minus />
				</Button>
				<Button
					aria-label="Fit to window"
					onClick={() => fitToWindow()}
					size="icon-sm"
					variant="ghost"
				>
					<Maximize />
				</Button>
				<Button
					aria-label="Zoom in"
					onClick={() => transformRef.current?.zoomIn(0.2)}
					size="icon-sm"
					variant="ghost"
				>
					<Plus />
				</Button>
			</div>
		</div>
	);
}

function EditHandle({
	pos,
	radius,
	strokeWidth,
	color,
}: {
	pos: Point;
	radius: number;
	strokeWidth: number;
	color: string;
}) {
	return (
		<circle
			cx={pos.x}
			cy={pos.y}
			fill="#fff"
			r={radius}
			stroke={color}
			strokeWidth={strokeWidth}
		/>
	);
}

const DEDUCTION_COLOR = '#dc2626';
// Amber halo drawn behind a shape that belongs to the selected group/parent or
// the active Add/Subtract target, so the relationship reads at a glance.
const HIGHLIGHT_COLOR = '#f59e0b';
const HIGHLIGHT_WIDTH_MULT = 3.5;
const HIGHLIGHT_OPACITY = 0.55;

// Small badge showing a shape's actual measured value, centred above its top
// edge. Sized in base pixels from the screen-constant fontSize so it stays a
// constant size on screen; never intercepts pointer events.
function MeasurementBadge({
	anchor,
	label,
	color,
	fontSize,
}: {
	anchor: Point;
	label: string;
	color: string;
	fontSize: number;
}) {
	const padX = fontSize * 0.4;
	const padY = fontSize * 0.22;
	const width = label.length * fontSize * 0.6 + 2 * padX;
	const height = fontSize + 2 * padY;
	const gap = fontSize * 0.4;
	const x = anchor.x - width / 2;
	const y = anchor.y - gap - height;
	return (
		<g style={{ pointerEvents: 'none' }}>
			<rect
				fill="#ffffff"
				fillOpacity={0.92}
				height={height}
				rx={padY}
				stroke={color}
				strokeWidth={fontSize * 0.08}
				width={width}
				x={x}
				y={y}
			/>
			<text
				dominantBaseline="central"
				fill={color}
				fontSize={fontSize}
				fontWeight={600}
				textAnchor="middle"
				x={anchor.x}
				y={y + height / 2}
			>
				{label}
			</text>
		</g>
	);
}

function CommittedShape({
	measurement,
	strokeWidth,
	vertexRadius,
	handleRadius,
	fontSize,
	selected,
	selectedMarkerIndex,
	highlighted,
	groupColor,
	valueLabel,
}: {
	measurement: Measurement;
	strokeWidth: number;
	vertexRadius: number;
	handleRadius: number;
	fontSize: number;
	selected: boolean;
	selectedMarkerIndex: number | null;
	highlighted: boolean;
	groupColor?: string;
	valueLabel: string | null;
}) {
	const haloWidth = strokeWidth * HIGHLIGHT_WIDTH_MULT;
	const isDeduction = Boolean(measurement.parentId);
	// Deductions always render red. Otherwise prefer the shape's stored colour,
	// falling back to the group colour then the per-type default for any legacy
	// measurement drawn before colours were persisted.
	const color = isDeduction
		? DEDUCTION_COLOR
		: (measurement.color ??
			groupColor ??
			TOOL_COLORS[measurement.type] ??
			'#2563eb');
	const { points, type } = measurement;

	// Null for counts (no on-shape value) and whenever the toggle is off.
	const badge =
		valueLabel === null ? null : (
			<MeasurementBadge
				anchor={shapeTopCenter(measurement)}
				color={color}
				fontSize={fontSize}
				label={valueLabel}
			/>
		);

	if (type === 'count') {
		// First letter of the measurement name prefixes each marker label, so a
		// "Count" reads C1, C2… and renaming to "Electrical" makes it E1, E2…
		const prefix = (measurement.label.trim().charAt(0) || 'C').toUpperCase();
		return (
			<g>
				{points.map((p, index) => {
					const label = `${prefix}${index + 1}`;
					// Grow the dot so multi-character labels (C12) stay legible; the
					// radius is driven by the screen-constant fontSize, so it stays a
					// constant size on screen across zoom.
					const r = Math.max(
						vertexRadius * 1.8,
						fontSize * 0.55 + label.length * fontSize * 0.32
					);
					const markerSelected = selected && index === selectedMarkerIndex;
					return (
						<g key={`${p.x}-${p.y}`}>
							{highlighted && (
								<circle
									cx={p.x}
									cy={p.y}
									fill="none"
									r={r + vertexRadius}
									stroke={HIGHLIGHT_COLOR}
									strokeOpacity={HIGHLIGHT_OPACITY}
									strokeWidth={haloWidth}
								/>
							)}
							<circle cx={p.x} cy={p.y} fill={color} r={r} />
							{markerSelected && (
								<circle
									cx={p.x}
									cy={p.y}
									fill="none"
									r={r + strokeWidth * 1.5}
									stroke={color}
									strokeWidth={strokeWidth * 1.5}
								/>
							)}
							<text
								dominantBaseline="central"
								fill="#fff"
								fontSize={fontSize}
								textAnchor="middle"
								x={p.x}
								y={p.y}
							>
								{label}
							</text>
						</g>
					);
				})}
			</g>
		);
	}

	if (type === 'linear') {
		return (
			<g>
				{highlighted && (
					<polyline
						fill="none"
						points={points.map((p) => `${p.x},${p.y}`).join(' ')}
						stroke={HIGHLIGHT_COLOR}
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeOpacity={HIGHLIGHT_OPACITY}
						strokeWidth={haloWidth}
					/>
				)}
				<polyline
					fill="none"
					points={points.map((p) => `${p.x},${p.y}`).join(' ')}
					stroke={color}
					strokeWidth={strokeWidth}
				/>
				{points.map((p) => (
					<circle
						cx={p.x}
						cy={p.y}
						fill={color}
						key={`${p.x}-${p.y}`}
						r={vertexRadius}
					/>
				))}
				{badge}
			</g>
		);
	}

	// Area-like shapes: rectangle, circle, polygon. Deductions read as "holes":
	// dashed red outline over a light red fill.
	const fill = isDeduction ? `${color}1f` : `${color}22`;
	const dash = isDeduction
		? `${strokeWidth * 3} ${strokeWidth * 2}`
		: undefined;
	let body: ReactElement;
	let halo: ReactElement | null = null;
	let handlePoints: Point[];
	if (type === 'rectangle') {
		const b = rectBounds(points);
		body = (
			<rect
				fill={fill}
				height={b.height}
				stroke={color}
				strokeDasharray={dash}
				strokeWidth={strokeWidth}
				width={b.width}
				x={b.x}
				y={b.y}
			/>
		);
		halo = (
			<rect
				fill="none"
				height={b.height}
				stroke={HIGHLIGHT_COLOR}
				strokeOpacity={HIGHLIGHT_OPACITY}
				strokeWidth={haloWidth}
				width={b.width}
				x={b.x}
				y={b.y}
			/>
		);
		handlePoints = rectCorners(points);
	} else if (type === 'circle') {
		const r = circleRadius(points);
		body = (
			<circle
				cx={points[0].x}
				cy={points[0].y}
				fill={fill}
				r={r}
				stroke={color}
				strokeDasharray={dash}
				strokeWidth={strokeWidth}
			/>
		);
		halo = (
			<circle
				cx={points[0].x}
				cy={points[0].y}
				fill="none"
				r={r}
				stroke={HIGHLIGHT_COLOR}
				strokeOpacity={HIGHLIGHT_OPACITY}
				strokeWidth={haloWidth}
			/>
		);
		handlePoints = [points[1]];
	} else {
		body = (
			<polygon
				fill={fill}
				points={points.map((p) => `${p.x},${p.y}`).join(' ')}
				stroke={color}
				strokeDasharray={dash}
				strokeWidth={strokeWidth}
			/>
		);
		halo = (
			<polygon
				fill="none"
				points={points.map((p) => `${p.x},${p.y}`).join(' ')}
				stroke={HIGHLIGHT_COLOR}
				strokeOpacity={HIGHLIGHT_OPACITY}
				strokeWidth={haloWidth}
			/>
		);
		handlePoints = points;
	}

	return (
		<g>
			{highlighted && halo}
			{body}
			{selected &&
				handlePoints.map((p) => (
					<EditHandle
						color={color}
						key={`${p.x}-${p.y}`}
						pos={p}
						radius={handleRadius}
						strokeWidth={strokeWidth}
					/>
				))}
			{badge}
		</g>
	);
}

function DraftShape({
	points,
	cursor,
	tool,
	stroke,
	strokeWidth,
	vertexRadius,
	fontSize,
	metersPerPixel,
}: {
	points: Point[];
	cursor: Point | null;
	tool: ToolId;
	stroke: string;
	strokeWidth: number;
	vertexRadius: number;
	fontSize: number;
	metersPerPixel: number | null;
}) {
	if (tool === 'pan' || tool === 'count' || points.length === 0) {
		return null;
	}

	const dash = `${strokeWidth * 3} ${strokeWidth * 2}`;

	// Rectangle / circle: drag-drawn from a two-point draft [start, current].
	if (tool === 'rectangle') {
		if (points.length < 2) {
			return null;
		}
		const b = rectBounds(points);
		const label = metersPerPixel
			? formatSqm(rectArea(points) * metersPerPixel ** 2)
			: null;
		return (
			<g>
				<rect
					fill={`${stroke}1a`}
					height={b.height}
					stroke={stroke}
					strokeDasharray={dash}
					strokeWidth={strokeWidth}
					width={b.width}
					x={b.x}
					y={b.y}
				/>
				{label && (
					<ShapeLabel
						color={stroke}
						fontSize={fontSize}
						pos={{ x: b.x + b.width / 2, y: b.y + b.height / 2 }}
						text={label}
					/>
				)}
			</g>
		);
	}

	if (tool === 'circle') {
		if (points.length < 2) {
			return null;
		}
		const r = circleRadius(points);
		const label = metersPerPixel
			? formatSqm(circleArea(points) * metersPerPixel ** 2)
			: null;
		return (
			<g>
				<circle
					cx={points[0].x}
					cy={points[0].y}
					fill={`${stroke}1a`}
					r={r}
					stroke={stroke}
					strokeDasharray={dash}
					strokeWidth={strokeWidth}
				/>
				<circle
					cx={points[0].x}
					cy={points[0].y}
					fill={stroke}
					r={vertexRadius}
				/>
				{label && (
					<ShapeLabel
						color={stroke}
						fontSize={fontSize}
						pos={points[0]}
						text={label}
					/>
				)}
			</g>
		);
	}

	// Polygon / linear / calibrate: click-to-add with a live cursor segment.
	const livePoints = cursor ? [...points, cursor] : points;
	const pointsAttr = livePoints.map((p) => `${p.x},${p.y}`).join(' ');
	const isPolygon = tool === 'polygon';

	let label: string | null = null;
	let labelPos: Point = points[0];
	if (metersPerPixel) {
		if (isPolygon && livePoints.length >= 3) {
			label = formatSqm(polygonArea(livePoints) * metersPerPixel ** 2);
			labelPos = centroid(livePoints);
		} else if (tool === 'linear' && livePoints.length >= 2) {
			label = formatMeters(polylineLength(livePoints) * metersPerPixel);
			labelPos = midpoint(
				livePoints.at(-2) as Point,
				livePoints.at(-1) as Point
			);
		} else if (tool === 'calibrate' && livePoints.length >= 2) {
			label = `${polylineLength(livePoints).toFixed(0)} px`;
			labelPos = midpoint(
				livePoints.at(-2) as Point,
				livePoints.at(-1) as Point
			);
		}
	} else if (tool === 'calibrate' && livePoints.length >= 2) {
		label = `${polylineLength(livePoints).toFixed(0)} px`;
		labelPos = midpoint(livePoints.at(-2) as Point, livePoints.at(-1) as Point);
	}

	return (
		<g>
			{isPolygon && livePoints.length >= 3 ? (
				<polygon
					fill={`${stroke}1a`}
					points={pointsAttr}
					stroke={stroke}
					strokeDasharray={dash}
					strokeWidth={strokeWidth}
				/>
			) : (
				<polyline
					fill="none"
					points={pointsAttr}
					stroke={stroke}
					strokeDasharray={dash}
					strokeWidth={strokeWidth}
				/>
			)}
			{points.map((p) => (
				<circle
					cx={p.x}
					cy={p.y}
					fill={stroke}
					key={`${p.x}-${p.y}`}
					r={vertexRadius}
				/>
			))}
			{label && (
				<ShapeLabel
					color={stroke}
					fontSize={fontSize}
					pos={labelPos}
					text={label}
				/>
			)}
		</g>
	);
}

function ShapeLabel({
	pos,
	text,
	color,
	fontSize,
}: {
	pos: Point;
	text: string;
	color: string;
	fontSize: number;
}) {
	const paddingX = fontSize * 0.4;
	const width = text.length * fontSize * 0.62 + paddingX * 2;
	const height = fontSize * 1.5;
	return (
		<g>
			<rect
				fill={color}
				height={height}
				rx={fontSize * 0.3}
				width={width}
				x={pos.x - width / 2}
				y={pos.y - height / 2}
			/>
			<text
				fill="#fff"
				fontSize={fontSize}
				fontWeight={600}
				textAnchor="middle"
				x={pos.x}
				y={pos.y + fontSize * 0.35}
			>
				{text}
			</text>
		</g>
	);
}
