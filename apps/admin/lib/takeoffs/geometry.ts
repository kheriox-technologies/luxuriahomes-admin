import type { LengthUnit, MeasurementType, Point } from './types';

export function distance(a: Point, b: Point): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
}

/** Squared distance — cheap hit-testing without a sqrt. */
export function distanceSq(a: Point, b: Point): number {
	const dx = b.x - a.x;
	const dy = b.y - a.y;
	return dx * dx + dy * dy;
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

export function formatMeters(value: number): string {
	return `${value.toFixed(2)} m`;
}

export function formatSqm(value: number): string {
	return `${value.toFixed(2)} m²`;
}
