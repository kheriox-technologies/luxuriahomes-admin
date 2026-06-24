import {
	AREA_TYPE_SET,
	type LengthUnit,
	type Measurement,
	type MeasurementType,
	type Point,
} from './types';

export function distance(a: Point, b: Point): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Squared distance — cheap hit-testing without a sqrt. */
export function distanceSq(a: Point, b: Point): number {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	return dx * dx + dy * dy;
}

/** Squared distance from a point to the line segment a→b (cheap hit-testing). */
export function distanceToSegmentSq(p: Point, a: Point, b: Point): number {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	const lenSq = dx * dx + dy * dy;
	if (lenSq === 0) {
		return distanceSq(p, a);
	}
	let t = ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq;
	t = Math.max(0, Math.min(1, t));
	return distanceSq(p, { x: a.x + t * dx, y: a.y + t * dy });
}

/** Total length of a polyline through the given points (pixels). */
export function polylineLength(points: Point[]): number {
	let total = 0;
	for (let i = 1; i < points.length; i++) {
		total += distance(points[i - 1], points[i]);
	}
	return total;
}

/** Area of a closed polygon via the shoelace formula (pixels²). */
export function polygonArea(points: Point[]): number {
	if (points.length < 3) {
		return 0;
	}
	let sum = 0;
	for (let i = 0; i < points.length; i++) {
		const current = points[i];
		const next = points[(i + 1) % points.length];
		sum += current.x * next.y - next.x * current.y;
	}
	return Math.abs(sum) / 2;
}

/** Perimeter of a closed polygon (pixels). */
export function polygonPerimeter(points: Point[]): number {
	if (points.length < 2) {
		return 0;
	}
	return polylineLength(points) + distance(points.at(-1) as Point, points[0]);
}

/** Bounds of an axis-aligned rectangle defined by two opposite corners. */
export function rectBounds(points: Point[]): {
	height: number;
	width: number;
	x: number;
	y: number;
} {
	const [a, b] = points;
	const x = Math.min(a.x, b.x);
	const y = Math.min(a.y, b.y);
	return { x, y, width: Math.abs(b.x - a.x), height: Math.abs(b.y - a.y) };
}

/** The 4 visual corners (TL, TR, BR, BL) of an axis-aligned rectangle. */
export function rectCorners(points: Point[]): Point[] {
	const { x, y, width, height } = rectBounds(points);
	return [
		{ x, y },
		{ x: x + width, y },
		{ x: x + width, y: y + height },
		{ x, y: y + height },
	];
}

/** Area of an axis-aligned rectangle (pixels²). */
export function rectArea(points: Point[]): number {
	const { width, height } = rectBounds(points);
	return width * height;
}

/** Perimeter of an axis-aligned rectangle (pixels). */
export function rectPerimeter(points: Point[]): number {
	const { width, height } = rectBounds(points);
	return 2 * (width + height);
}

/** Radius of a circle stored as [center, edgePoint] (pixels). */
export function circleRadius(points: Point[]): number {
	if (points.length < 2) {
		return 0;
	}
	return distance(points[0], points[1]);
}

/** Area of a circle (pixels²). */
export function circleArea(points: Point[]): number {
	const r = circleRadius(points);
	return Math.PI * r * r;
}

/** Circumference of a circle (pixels). */
export function circleCircumference(points: Point[]): number {
	return 2 * Math.PI * circleRadius(points);
}

/** Translate every point by (dx, dy). Used for moving any shape. */
export function translatePoints(
	points: Point[],
	dx: number,
	dy: number
): Point[] {
	return points.map((p) => ({ x: p.x + dx, y: p.y + dy }));
}

/** Whether a point lies inside a polygon (ray casting). */
export function pointInPolygon(pt: Point, polygon: Point[]): boolean {
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const a = polygon[i];
		const b = polygon[j];
		const intersects =
			a.y > pt.y !== b.y > pt.y &&
			pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x;
		if (intersects) {
			inside = !inside;
		}
	}
	return inside;
}

/** Whether a base-pixel point lies inside an area-like shape's body. */
export function isInsideBody(measurement: Measurement, point: Point): boolean {
	const { type, points } = measurement;
	if (type === 'rectangle') {
		const b = rectBounds(points);
		return (
			point.x >= b.x &&
			point.x <= b.x + b.width &&
			point.y >= b.y &&
			point.y <= b.y + b.height
		);
	}
	if (type === 'circle') {
		const r = circleRadius(points);
		return distanceSq(points[0], point) <= r * r;
	}
	return pointInPolygon(point, points);
}

/** Geometric centre of an area shape — used to find its containing parent. */
export function shapeCentroid(measurement: Measurement): Point {
	const { type, points } = measurement;
	if (type === 'rectangle') {
		const b = rectBounds(points);
		return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
	}
	if (type === 'circle') {
		return points[0];
	}
	const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), {
		x: 0,
		y: 0,
	});
	return { x: sum.x / points.length, y: sum.y / points.length };
}

/**
 * The topmost non-deduction area shape on `page` whose body contains the centroid
 * of `candidate` — i.e. the shape a freshly drawn deduction should attach to.
 */
export function findParentId(
	candidate: Pick<Measurement, 'points' | 'type'>,
	measurements: Measurement[],
	page: number
): string | undefined {
	const c = shapeCentroid(candidate as Measurement);
	for (let i = measurements.length - 1; i >= 0; i--) {
		const m = measurements[i];
		if (
			m.page === page &&
			!m.parentId &&
			AREA_TYPE_SET.has(m.type) &&
			isInsideBody(m, c)
		) {
			return m.id;
		}
	}
	return;
}

/** Sum of the gross areas (m²) of every deduction belonging to a parent. */
export function deductionSumSqm(
	parentId: string,
	measurements: Measurement[]
): number {
	return measurements
		.filter((m) => m.parentId === parentId)
		.reduce((sum, m) => sum + (m.valueSqm ?? 0), 0);
}

/** Net area (m²) of a parent shape after subtracting its deductions (≥ 0). */
export function netAreaSqm(
	parent: Measurement,
	measurements: Measurement[]
): number {
	return Math.max(
		0,
		(parent.valueSqm ?? 0) - deductionSumSqm(parent.id, measurements)
	);
}

/**
 * Recompute the value/perimeter fields for a measurement from its points and the
 * page scale (metres per pixel). Shared by drawing-commit and edit-commit paths.
 */
export function measure(
	type: MeasurementType,
	points: Point[],
	mpp: number
): { perimeterMeters?: number; valueMeters?: number; valueSqm?: number } {
	switch (type) {
		case 'linear':
			return { valueMeters: polylineLength(points) * mpp };
		case 'rectangle':
			return {
				valueSqm: rectArea(points) * mpp ** 2,
				perimeterMeters: rectPerimeter(points) * mpp,
			};
		case 'circle':
			return {
				valueSqm: circleArea(points) * mpp ** 2,
				perimeterMeters: circleCircumference(points) * mpp,
			};
		case 'polygon':
			return {
				valueSqm: polygonArea(points) * mpp ** 2,
				perimeterMeters: polygonPerimeter(points) * mpp,
			};
		default:
			return {};
	}
}

const METRES_PER_UNIT: Record<LengthUnit, number> = {
	mm: 0.001,
	cm: 0.01,
	m: 1,
};

export function toMetres(value: number, unit: LengthUnit): number {
	return value * METRES_PER_UNIT[unit];
}

/**
 * Map a pointer event to BASE canvas pixel coordinates using the overlay's live
 * bounding rect. Because the rect already reflects the current zoom/pan
 * transform, the returned coordinates (and any measurement computed from them)
 * are identical at every zoom level.
 */
export function pointerToBaseCoords(
	event: { clientX: number; clientY: number },
	overlay: SVGSVGElement,
	baseWidth: number,
	baseHeight: number
): Point {
	const rect = overlay.getBoundingClientRect();
	return {
		x: ((event.clientX - rect.left) / rect.width) * baseWidth,
		y: ((event.clientY - rect.top) / rect.height) * baseHeight,
	};
}

const SNAP_ANGLE_STEP = Math.PI / 4; // 45°

/**
 * Snap a point so the segment from `anchor` to it locks to the nearest
 * 0°/45°/90°/… direction, preserving the cursor distance. Used while drawing
 * with Shift held to produce perfectly straight lines.
 */
export function snapToAngle(anchor: Point, point: Point): Point {
	const dx = point.x - anchor.x;
	const dy = point.y - anchor.y;
	const dist = Math.hypot(dx, dy);
	if (dist === 0) {
		return point;
	}
	const snapped =
		Math.round(Math.atan2(dy, dx) / SNAP_ANGLE_STEP) * SNAP_ANGLE_STEP;
	return {
		x: anchor.x + Math.cos(snapped) * dist,
		y: anchor.y + Math.sin(snapped) * dist,
	};
}

export interface SnapGuide {
	axis: 'x' | 'y';
	value: number;
}

function nearestCoord(
	vertices: Point[],
	target: number,
	axis: 'x' | 'y',
	tolerance: number
): number | null {
	let best: number | null = null;
	let bestDist = tolerance;
	for (const v of vertices) {
		const dist = Math.abs(v[axis] - target);
		if (dist <= bestDist) {
			bestDist = dist;
			best = v[axis];
		}
	}
	return best;
}

/**
 * Snap a draft point while Shift is held. Combines two behaviours:
 *  - angle snap relative to `anchor` (the previous vertex), then
 *  - alignment to any of `vertices` whose x or y the cursor is near (within
 *    `tolerance`), which both snaps that coordinate and yields a guide line to
 *    render. This makes it easy to draw right-angled polygons whose vertices
 *    line up with earlier ones.
 */
export function snapPolylinePoint(
	anchor: Point,
	point: Point,
	vertices: Point[],
	tolerance: number
): { guides: SnapGuide[]; point: Point } {
	const base = snapToAngle(anchor, point);
	let { x, y } = base;
	const guides: SnapGuide[] = [];

	const alignX = nearestCoord(vertices, point.x, 'x', tolerance);
	if (alignX !== null) {
		x = alignX;
		guides.push({ axis: 'x', value: alignX });
	}
	const alignY = nearestCoord(vertices, point.y, 'y', tolerance);
	if (alignY !== null) {
		y = alignY;
		guides.push({ axis: 'y', value: alignY });
	}
	return { guides, point: { x, y } };
}

export function formatMeters(value: number): string {
	return `${value.toFixed(2)} m`;
}

export function formatSqm(value: number): string {
	return `${value.toFixed(2)} m²`;
}
