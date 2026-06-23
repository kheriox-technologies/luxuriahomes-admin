'use client';

import { Button } from '@workspace/ui/components/button';
import { Spinner } from '@workspace/ui/components/spinner';
import { Maximize, Minus, Plus } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
	type ReactZoomPanPinchRef,
	TransformComponent,
	TransformWrapper,
} from 'react-zoom-pan-pinch';
import {
	formatMeters,
	formatSqm,
	pointerToBaseCoords,
	polygonArea,
	polylineLength,
} from '@/lib/takeoffs/geometry';
import type { Measurement, Point, ToolId } from '@/lib/takeoffs/types';
import type { RenderedSize } from './use-pdf-document';

const TOOL_COLORS: Record<string, string> = {
	calibrate: '#f59e0b',
	linear: '#2563eb',
	area: '#059669',
	count: '#7c3aed',
};

interface PdfStageProps {
	cursor: Point | null;
	draft: Point[];
	error: string | null;
	measurements: Measurement[];
	metersPerPixel: number | null;
	numPages: number;
	onCursorMove: (point: Point | null) => void;
	onStageClick: (point: Point) => void;
	onStageDoubleClick: () => void;
	page: number;
	ready: boolean;
	renderPage: (
		pageNumber: number,
		canvas: HTMLCanvasElement
	) => Promise<RenderedSize | null>;
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
	onStageClick,
	onStageDoubleClick,
	onCursorMove,
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

	const isDrawingTool = tool !== 'pan';
	const stroke = TOOL_COLORS[tool] ?? '#2563eb';
	// Keep stroke/markers a constant screen size regardless of zoom.
	const strokeWidth = 2 / scale;
	const vertexRadius = 4 / scale;
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
		isDrawingTool,
		toBase,
		onStageClick,
		onStageDoubleClick,
		onCursorMove,
	});
	useEffect(() => {
		handlersRef.current = {
			isDrawingTool,
			toBase,
			onStageClick,
			onStageDoubleClick,
			onCursorMove,
		};
	});
	// Stable callback ref: attaches native listeners when the SVG mounts and
	// returns its cleanup (React 19 ref-cleanup), so it never re-binds per render.
	const setOverlayRef = useCallback((svg: SVGSVGElement | null) => {
		svgRef.current = svg;
		if (!svg) {
			return;
		}
		const handleClick = (event: MouseEvent) => {
			const h = handlersRef.current;
			if (!h.isDrawingTool) {
				return;
			}
			const point = h.toBase(event);
			if (point) {
				h.onStageClick(point);
			}
		};
		const handleDoubleClick = () => handlersRef.current.onStageDoubleClick();
		const handleMove = (event: MouseEvent) => {
			const h = handlersRef.current;
			if (h.isDrawingTool) {
				h.onCursorMove(h.toBase(event));
			}
		};
		const handleLeave = () => handlersRef.current.onCursorMove(null);
		svg.addEventListener('click', handleClick);
		svg.addEventListener('dblclick', handleDoubleClick);
		svg.addEventListener('mousemove', handleMove);
		svg.addEventListener('mouseleave', handleLeave);
		return () => {
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
		<div className="relative h-full w-full overflow-hidden rounded-lg border bg-muted/40">
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
				panning={{ disabled: isDrawingTool }}
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
									pointerEvents: isDrawingTool ? 'auto' : 'none',
									cursor: isDrawingTool ? 'crosshair' : 'default',
								}}
								viewBox={`0 0 ${size.width} ${size.height}`}
								width={size.width}
							>
								<title>Measurement overlay</title>
								{measurements.map((m) => (
									<CommittedShape
										fontSize={fontSize}
										key={m.id}
										measurement={m}
										strokeWidth={strokeWidth}
										vertexRadius={vertexRadius}
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

function CommittedShape({
	measurement,
	strokeWidth,
	vertexRadius,
	fontSize,
}: {
	measurement: Measurement;
	strokeWidth: number;
	vertexRadius: number;
	fontSize: number;
}) {
	const color = TOOL_COLORS[measurement.type] ?? '#2563eb';
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

	const isArea = type === 'area';
	const pointsAttr = points.map((p) => `${p.x},${p.y}`).join(' ');
	const labelPos = isArea
		? centroid(points)
		: midpoint(points[0], points.at(-1) as Point);
	const labelText = isArea
		? formatSqm(measurement.valueSqm ?? 0)
		: formatMeters(measurement.valueMeters ?? 0);

	return (
		<g>
			{isArea ? (
				<polygon
					fill={`${color}22`}
					points={pointsAttr}
					stroke={color}
					strokeWidth={strokeWidth}
				/>
			) : (
				<polyline
					fill="none"
					points={pointsAttr}
					stroke={color}
					strokeWidth={strokeWidth}
				/>
			)}
			{points.map((p) => (
				<circle
					cx={p.x}
					cy={p.y}
					fill={color}
					key={`${p.x}-${p.y}`}
					r={vertexRadius}
				/>
			))}
			<ShapeLabel
				color={color}
				fontSize={fontSize}
				pos={labelPos}
				text={labelText}
			/>
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

	const livePoints = cursor ? [...points, cursor] : points;
	const pointsAttr = livePoints.map((p) => `${p.x},${p.y}`).join(' ');
	const isArea = tool === 'area';

	let label: string | null = null;
	let labelPos: Point = points[0];
	if (metersPerPixel) {
		if (isArea && livePoints.length >= 3) {
			label = formatSqm(polygonArea(livePoints) * metersPerPixel ** 2);
			labelPos = centroid(livePoints);
		} else if (!isArea && livePoints.length >= 2) {
			label = formatMeters(polylineLength(livePoints) * metersPerPixel);
			labelPos = midpoint(
				livePoints.at(-2) as Point,
				livePoints.at(-1) as Point
			);
		} else if (tool === 'calibrate' && livePoints.length === 2) {
			label = `${polylineLength(livePoints).toFixed(0)} px`;
			labelPos = midpoint(livePoints[0], livePoints[1]);
		}
	} else if (tool === 'calibrate' && livePoints.length >= 2) {
		label = `${polylineLength(livePoints).toFixed(0)} px`;
		labelPos = midpoint(livePoints.at(-2) as Point, livePoints.at(-1) as Point);
	}

	return (
		<g>
			{isArea && livePoints.length >= 3 ? (
				<polygon
					fill={`${stroke}1a`}
					points={pointsAttr}
					stroke={stroke}
					strokeDasharray={`${strokeWidth * 3} ${strokeWidth * 2}`}
					strokeWidth={strokeWidth}
				/>
			) : (
				<polyline
					fill="none"
					points={pointsAttr}
					stroke={stroke}
					strokeDasharray={`${strokeWidth * 3} ${strokeWidth * 2}`}
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
