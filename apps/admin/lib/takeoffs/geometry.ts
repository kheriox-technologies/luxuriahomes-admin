import type { LengthUnit, Point } from './types';

export function distance(a: Point, b: Point): number {
	return Math.hypot(b.x - a.x, b.y - a.y);
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
