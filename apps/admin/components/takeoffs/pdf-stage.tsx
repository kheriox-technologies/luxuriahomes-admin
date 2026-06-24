'use client';

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
} from '@/lib/takeoffs/geometry';
import {
	AREA_TYPE_SET,
	type DragKind,
	type Measurement,
	type Point,
	type ToolId,
} from '@/lib/takeoffs/types';
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

interface PdfStageProps {
	cursor: Point | null;
	draft: Point[];
	error: string | null;
	guides: SnapGuide[];
	measurements: Measurement[];
	metersPerPixel: number | null;
	numPages: number;
	onCursorMove: (point: Point | null, snap?: boolean, scale?: number) => void;
	onDragStart: (drag: DragKind) => void;
	onExitToPan: () => void;
	onPointerUp: (point: Point) => void;
	onStageClick: (point: Point, snap?: boolean, scale?: number) => void;
	onStageDoubleClick: () => void;
	page: number;
	ready: boolean;
	renderPage: (
		pageNumber: number,
		canvas: HTMLCanvasElement
	) => Promise<RenderedSize | null>;
	selectedId: string | null;
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
		const grabbable = AREA_TYPE_SET.has(m.type)
			? isInsideBody(m, point)
			: m.type === 'linear' && isOnPolyline(point, m.points, tolSq);
		if (grabbable) {
			return {
				mode: 'move',
				id: m.id,
				start: point,
				orig: m.points,
				children: moveChildren(m, measurements),
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
 * Shapes that must translate alongside `m` during a move: every other member of
 * its Add group, or (for an ungrouped parent) its deductions.
 */
function moveChildren(
	m: Measurement,
	measurements: Measurement[]
): { id: string; orig: Point[] }[] | undefined {
	if (m.groupId) {
		return measurements
			.filter((c) => c.id !== m.id && c.groupId === m.groupId)
			.map((c) => ({ id: c.id, orig: c.points }));
	}
	if (m.parentId) {
		return;
	}
	return measurements
		.filter((c) => c.parentId === m.id)
		.map((c) => ({ id: c.id, orig: c.points }));
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
	if (drag.mode === 'move') {
		return 'move';
	}
	return 'default';
}

export default function PdfStage({
	page,
	numPages,
	ready,
	error,
	renderPage,
	tool,
	metersPerPixel,
	measurements,
	draft,
	cursor,
	guides,
	selectedId,
	onStageClick,
	onStageDoubleClick,
	onCursorMove,
	onDragStart,
	onPointerUp,
	onExitToPan,
}: PdfStageProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const svgRef = useRef<SVGSVGElement>(null);
	const transformRef = useRef<ReactZoomPanPinchRef>(null);
	const [size, setSize] = useState<{ width: number; height: number } | null>(
		null
	);
	const [scale, setScale] = useState(1);
	const [fitScale, setFitScale] = useState(1);
	const [rendering, setRendering] = useState(true);

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
	const isInteractive = tool !== 'pan';
	const isDrawingTool = isInteractive && tool !== 'select';
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
		onExitToPan,
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
			onExitToPan,
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
			} else if (h.tool === 'select') {
				drag = hitTest(point, h.measurements, h.selectedId, h.scale);
			}
			if (drag) {
				draggingRef.current = true;
				h.onDragStart(drag);
			} else if (h.tool === 'select') {
				// Clicking empty space in Select mode drops back to Pan so further
				// clicks/drags can't accidentally move or edit shapes.
				h.onExitToPan();
			}
		};
		const handleUp = (event: MouseEvent) => {
			const h = handlersRef.current;
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
			if (!h.isInteractive) {
				return;
			}
			const point = h.toBase(event);
			h.onCursorMove(point, event.shiftKey, h.scale);
			// In Select mode, reflect what's under the pointer (resize edges, grab
			// handles, move bodies) by driving the cursor imperatively.
			if (h.tool === 'select' && svgRef.current) {
				svgRef.current.style.cursor = point
					? selectCursor(point, h.measurements, h.selectedId, h.scale)
					: 'default';
			}
		};
		const handleLeave = () => {
			const h = handlersRef.current;
			h.onCursorMove(null);
			// Only Select drives the cursor imperatively, so only it needs resetting
			// on leave. Clobbering it for drawing tools would override the React
			// inline `crosshair` and never restore it (the style value is unchanged
			// across drawing-tool switches, so React skips the DOM update).
			if (svgRef.current && h.tool === 'select') {
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
				panning={{ disabled: isInteractive }}
				ref={transformRef}
				wheel={{ step: 0.04 }}
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
									pointerEvents: isInteractive ? 'auto' : 'none',
									// Select mode drives the cursor imperatively (see handleMove);
									// leaving it unset here keeps React from resetting it per render.
									...(tool === 'select'
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
										key={m.id}
										measurement={m}
										selected={m.id === selectedId}
										strokeWidth={strokeWidth}
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
					</div>
				</TransformComponent>
			</TransformWrapper>

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

function CommittedShape({
	measurement,
	strokeWidth,
	vertexRadius,
	handleRadius,
	fontSize,
	selected,
	groupColor,
}: {
	measurement: Measurement;
	strokeWidth: number;
	vertexRadius: number;
	handleRadius: number;
	fontSize: number;
	selected: boolean;
	groupColor?: string;
}) {
	const isDeduction = Boolean(measurement.parentId);
	// Group members share one colour (groups never contain deductions).
	const color =
		groupColor ??
		(isDeduction
			? DEDUCTION_COLOR
			: (TOOL_COLORS[measurement.type] ?? '#2563eb'));
	const { points, type } = measurement;

	if (type === 'count') {
		return (
			<g>
				{points.map((p, index) => (
					<g key={`${p.x}-${p.y}`}>
						<circle cx={p.x} cy={p.y} fill={color} r={vertexRadius * 1.6} />
						<text
							fill="#fff"
							fontSize={fontSize}
							textAnchor="middle"
							x={p.x}
							y={p.y - vertexRadius * 2.2}
						>
							{index + 1}
						</text>
					</g>
				))}
			</g>
		);
	}

	if (type === 'linear') {
		return (
			<g>
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
		handlePoints = points;
	}

	return (
		<g>
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
	if (
		tool === 'pan' ||
		tool === 'select' ||
		tool === 'count' ||
		points.length === 0
	) {
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
