import type { MultiPolygon, Pair, Polygon, Ring } from 'polygon-clipping';
import polygonClipping from 'polygon-clipping';
import {
	AREA_TYPE_SET,
	type LengthUnit,
	type Measurement,
	type MeasurementMethod,
	type MeasurementType,
	type PageGeometry,
	type PaperSize,
	type Point,
	type ScaleSetting,
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

// Number of segments used to approximate a circle as a convex polygon when
// clipping a deduction against (or as) a circular parent.
const CIRCLE_CLIP_SEGMENTS = 64;

/** A circle stored as [center, edgePoint] approximated as a convex N-gon. */
function circleToPolygon(points: Point[]): Point[] {
	const [center] = points;
	const r = circleRadius(points);
	const result: Point[] = [];
	for (let i = 0; i < CIRCLE_CLIP_SEGMENTS; i++) {
		const angle = (i / CIRCLE_CLIP_SEGMENTS) * 2 * Math.PI;
		result.push({
			x: center.x + Math.cos(angle) * r,
			y: center.y + Math.sin(angle) * r,
		});
	}
	return result;
}

/** Any area shape → a polygon vertex list (rect→4 corners, circle→N-gon). */
export function toPolygonPoints(
	shape: Pick<Measurement, 'points' | 'type'>
): Point[] {
	if (shape.type === 'rectangle') {
		return rectCorners(shape.points);
	}
	if (shape.type === 'circle') {
		return circleToPolygon(shape.points);
	}
	return shape.points;
}

/** Signed area of a polygon; its sign encodes the winding direction. */
function signedArea(poly: Point[]): number {
	let sum = 0;
	for (let i = 0; i < poly.length; i++) {
		const a = poly[i];
		const b = poly[(i + 1) % poly.length];
		sum += a.x * b.y - b.x * a.y;
	}
	return sum / 2;
}

/** Intersection of segment p1→p2 with the infinite line through a→b. */
function lineIntersection(p1: Point, p2: Point, a: Point, b: Point): Point {
	const a1 = b.y - a.y;
	const b1 = a.x - b.x;
	const c1 = a1 * a.x + b1 * a.y;
	const a2 = p2.y - p1.y;
	const b2 = p1.x - p2.x;
	const c2 = a2 * p1.x + b2 * p1.y;
	const det = a1 * b2 - a2 * b1;
	if (det === 0) {
		return p2;
	}
	return { x: (b2 * c1 - b1 * c2) / det, y: (a1 * c2 - a2 * c1) / det };
}

/**
 * Clip `subject` against a CONVEX `clip` polygon (Sutherland–Hodgman),
 * returning the intersection polygon (possibly empty). The inside test is
 * compared against the clip polygon's own winding, so either vertex order
 * works. Exact for convex clips (rectangles, circles); a concave parent
 * polygon is only approximated.
 */
export function clipPolygon(subject: Point[], clip: Point[]): Point[] {
	if (subject.length < 3 || clip.length < 3) {
		return [];
	}
	// Positive winding ⇒ a point is "inside" when it lies to the left of each
	// directed clip edge (cross product ≥ 0); flip the test for the other winding.
	const sign = signedArea(clip) >= 0 ? 1 : -1;
	const inside = (p: Point, a: Point, b: Point): boolean =>
		sign * ((b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x)) >= 0;

	let output = subject;
	for (let i = 0; i < clip.length; i++) {
		if (output.length === 0) {
			break;
		}
		const a = clip[i];
		const b = clip[(i + 1) % clip.length];
		const input = output;
		output = [];
		for (let j = 0; j < input.length; j++) {
			const current = input[j];
			const prevPoint = input[(j + input.length - 1) % input.length];
			const currentInside = inside(current, a, b);
			const prevInside = inside(prevPoint, a, b);
			if (currentInside) {
				if (!prevInside) {
					output.push(lineIntersection(prevPoint, current, a, b));
				}
				output.push(current);
			} else if (prevInside) {
				output.push(lineIntersection(prevPoint, current, a, b));
			}
		}
	}
	return output;
}

/**
 * For a candidate deduction in subtract mode, pick the eligible parent
 * (topmost, non-deduction, area-like, same page) with the largest overlap and
 * return the candidate clipped to it. A candidate fully inside its parent keeps
 * its native type/points (so a circle stays a circle); otherwise the clipped
 * intersection is returned as a polygon. Returns null when no parent overlaps.
 */
export function clipToParent(
	candidate: Pick<Measurement, 'points' | 'type'>,
	measurements: Measurement[],
	page: number,
	// When set, only these area shapes are eligible parents (e.g. the members of
	// the group being subtracted from); otherwise every area shape on the page is
	// eligible. Either way the best-overlapping eligible shape is chosen.
	allowedParentIds?: readonly string[]
): { parentId: string; points: Point[]; type: MeasurementType } | null {
	const subj = toPolygonPoints(candidate);
	const allowed = allowedParentIds ? new Set(allowedParentIds) : null;
	let best: { overlap: number; parent: Measurement } | null = null;
	// Iterate topmost-first so equal overlaps favour the shape drawn last.
	for (let i = measurements.length - 1; i >= 0; i--) {
		const m = measurements[i];
		if (m.page !== page || m.parentId || !AREA_TYPE_SET.has(m.type)) {
			continue;
		}
		if (allowed && !allowed.has(m.id)) {
			continue;
		}
		const overlap = polygonArea(clipPolygon(subj, toPolygonPoints(m)));
		if (overlap > 0 && (!best || overlap > best.overlap)) {
			best = { overlap, parent: m };
		}
	}
	const parent = best?.parent;
	if (!parent) {
		return null;
	}
	if (subj.every((p) => isInsideBody(parent, p))) {
		return {
			parentId: parent.id,
			type: candidate.type,
			points: candidate.points,
		};
	}
	const clipped = clipPolygon(subj, toPolygonPoints(parent));
	if (clipped.length < 3) {
		return {
			parentId: parent.id,
			type: candidate.type,
			points: candidate.points,
		};
	}
	return { parentId: parent.id, type: 'polygon', points: clipped };
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

/** Shoelace area of a polygon-clipping ring ([x, y] pairs), in pixels². */
function ringArea(ring: Ring): number {
	let sum = 0;
	for (let i = 0; i < ring.length; i++) {
		const [ax, ay] = ring[i];
		const [bx, by] = ring[(i + 1) % ring.length];
		sum += ax * by - bx * ay;
	}
	return Math.abs(sum) / 2;
}

/** Closed-loop perimeter of a polygon-clipping ring ([x, y] pairs), in pixels. */
function ringPerimeter(ring: Ring): number {
	let total = 0;
	for (let i = 0; i < ring.length; i++) {
		const [ax, ay] = ring[i];
		const [bx, by] = ring[(i + 1) % ring.length];
		total += Math.hypot(bx - ax, by - ay);
	}
	return total;
}

/**
 * Combined area + perimeter (metres) of a group of area shapes treated as one
 * via a boolean union, so overlapping regions are counted only once. The result
 * is a MultiPolygon whose outer rings add area and whose hole rings (enclosed
 * gaps) subtract it; every ring contributes to the perimeter.
 */
export function unionMeasure(
	members: Measurement[],
	mpp: number
): { perimeterMeters: number; valueSqm: number } {
	const polys = members
		.filter((m) => AREA_TYPE_SET.has(m.type))
		.map((m): Polygon => [toPolygonPoints(m).map((p) => [p.x, p.y] as Pair)]);
	if (polys.length === 0) {
		return { valueSqm: 0, perimeterMeters: 0 };
	}
	const merged: MultiPolygon = polygonClipping.union(
		polys[0],
		...polys.slice(1)
	);
	let areaPx = 0;
	let perimeterPx = 0;
	for (const polygon of merged) {
		polygon.forEach((ring, index) => {
			// Ring 0 is the outer boundary (adds area); the rest are holes.
			areaPx += index === 0 ? ringArea(ring) : -ringArea(ring);
			perimeterPx += ringPerimeter(ring);
		});
	}
	return { valueSqm: areaPx * mpp ** 2, perimeterMeters: perimeterPx * mpp };
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

// 1 PDF point = 1/72 inch; 1 inch = 0.0254 m.
const POINT_TO_METER = 0.0254 / 72;

// [short edge, long edge] in mm for each ISO A-series sheet.
const PAPER_SIZES_MM: Record<Exclude<PaperSize, 'auto'>, [number, number]> = {
	A0: [841, 1189],
	A1: [594, 841],
	A2: [420, 594],
	A3: [297, 420],
	A4: [210, 297],
};

// A-series sizes offered in the scale picker (excludes the 'auto' option).
export const PAPER_SIZE_OPTIONS = ['A4', 'A3', 'A2', 'A1', 'A0'] as const;

/**
 * Convert a drawing scale (e.g. 1:100 on A3) to metres-per-pixel for one page.
 * The physical paper width is taken from the chosen ISO size (matched to the
 * page's orientation) or, for 'auto', from the PDF's intrinsic point size; the
 * scale ratio then maps paper distance to real-world distance.
 */
export function scaleToMpp(scale: ScaleSetting, geom: PageGeometry): number {
	const isLandscape = geom.naturalWidth >= geom.naturalHeight;
	let paperWidthMeters: number;
	if (scale.paper === 'auto') {
		paperWidthMeters = geom.naturalWidth * POINT_TO_METER;
	} else {
		const [shortMm, longMm] = PAPER_SIZES_MM[scale.paper];
		paperWidthMeters = (isLandscape ? longMm : shortMm) / 1000;
	}
	return (scale.ratio * paperWidthMeters) / geom.baseWidth;
}

/** Resolve any method to metres-per-pixel (geometry only needed for scale). */
export function resolveMpp(
	method: MeasurementMethod,
	geom: PageGeometry | null
): number | null {
	if (method.kind === 'calibration') {
		return method.mpp;
	}
	return geom ? scaleToMpp(method.scale, geom) : null;
}

/** Compact label for a drawing scale, e.g. "1:100 · A3" or "1:50 · Auto". */
export function formatScaleLabel(scale: ScaleSetting): string {
	const paper = scale.paper === 'auto' ? 'Auto' : scale.paper;
	return `1:${scale.ratio} · ${paper}`;
}

/** One-line label for any method (scale label, or calibrated px→mm). */
export function formatMethodLabel(method: MeasurementMethod): string {
	if (method.kind === 'scale') {
		return formatScaleLabel(method.scale);
	}
	return `1 px = ${(method.mpp * 1000).toFixed(2)} mm`;
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

/**
 * Lines shown in a shape's on-canvas value badge (empty array = no badge):
 * - Linear: `L - x m`, plus `H - x m` and the actual area `A - x m²`
 *   (length × height) when a wall height is set.
 * - Area-like (rectangle/circle/polygon, incl. groups & deductions): the area.
 * - Count: the total number of markers in the measurement.
 * Values are the actual measured values, matching the on-canvas drawing.
 */
export function shapeBadgeLines(m: Measurement): string[] {
	if (m.type === 'linear') {
		const length = m.valueMeters ?? 0;
		const lines = [`L - ${formatMeters(length)}`];
		if (m.heightMeters && m.heightMeters > 0) {
			lines.push(`H - ${formatMeters(m.heightMeters)}`);
			lines.push(`A - ${formatSqm(length * m.heightMeters)}`);
		}
		return lines;
	}
	if (AREA_TYPE_SET.has(m.type)) {
		return [formatSqm(m.valueSqm ?? 0)];
	}
	if (m.type === 'count') {
		return m.points.length > 0 ? [`${m.points.length}`] : [];
	}
	return [];
}

/** Top-centre of a shape's bounding box in base pixels (for value badges). */
export function shapeTopCenter(m: Measurement): Point {
	if (m.type === 'circle') {
		return { x: m.points[0].x, y: m.points[0].y - circleRadius(m.points) };
	}
	const pts = AREA_TYPE_SET.has(m.type) ? toPolygonPoints(m) : m.points;
	let minX = pts[0].x;
	let maxX = pts[0].x;
	let minY = pts[0].y;
	for (const p of pts) {
		minX = Math.min(minX, p.x);
		maxX = Math.max(maxX, p.x);
		minY = Math.min(minY, p.y);
	}
	return { x: (minX + maxX) / 2, y: minY };
}

// Default global wastage allowance (%) applied to every measurement until the
// user overrides it globally or per measurement.
export const DEFAULT_WASTAGE = 10;

// Selectable wastage allowances: 0% to 50% in 5% steps.
export const WASTAGE_OPTIONS = [
	0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50,
] as const;

/** Apply a wastage allowance to a measured value and round UP to a whole unit. */
export function roundUpWithWastage(
	value: number,
	wastagePercent: number
): number {
	return Math.ceil(value * (1 + wastagePercent / 100));
}

/** Apply manual +/− area adjustments to a rounded area, clamped at zero. */
export function adjustArea(
	rounded: number,
	addSqm?: number,
	subtractSqm?: number
): number {
	return Math.max(0, rounded + (addSqm ?? 0) - (subtractSqm ?? 0));
}

// Vibrant palette for shape colours, randomly assigned on commit. Excludes the
// red deduction colour (#dc2626) so deductions stay visually distinct.
export const SHAPE_PALETTE = [
	'#2563eb', // blue
	'#059669', // emerald
	'#7c3aed', // violet
	'#0891b2', // cyan
	'#ea580c', // orange
	'#9333ea', // purple
	'#16a34a', // green
	'#db2777', // pink
	'#ca8a04', // amber
	'#4f46e5', // indigo
	'#0d9488', // teal
	'#0284c7', // sky
] as const;

/** Pick a random colour from the shape palette. */
export function randomShapeColor(): string {
	return SHAPE_PALETTE[Math.floor(Math.random() * SHAPE_PALETTE.length)];
}

// Distinct hues for combined "Add" groups, chosen to stand apart from the
// per-type stroke colours (blue/green/purple) and the red deduction colour.
const GROUP_PALETTE = [
	'#0891b2', // cyan
	'#ea580c', // orange
	'#9333ea', // violet
	'#16a34a', // green
	'#db2777', // pink
	'#ca8a04', // amber
	'#4f46e5', // indigo
	'#0d9488', // teal
] as const;

/**
 * Map every group id on a page to a stable palette colour by its order of
 * appearance, so all members of a group share one colour and adjacent groups
 * stay visually distinct.
 */
export function groupColorMap(
	measurements: Measurement[]
): Map<string, string> {
	const map = new Map<string, string>();
	for (const m of measurements) {
		if (m.groupId && !map.has(m.groupId)) {
			map.set(m.groupId, GROUP_PALETTE[map.size % GROUP_PALETTE.length]);
		}
	}
	return map;
}
