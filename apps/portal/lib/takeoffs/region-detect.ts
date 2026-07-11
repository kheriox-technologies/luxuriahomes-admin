// Raster segmentation for the auto-detect (magic wand) takeoff tool. All
// functions are pure (no DOM/worker APIs) so they run in the region worker,
// fall back to the main thread, and stay unit-testable. Coordinates are BASE
// canvas pixels — the same space as Measurement.points.
//
// Pipeline (segmentImage): binarize → maskRects (text) → two label maps from
// the one mask: a COARSE map (removeThinLines erases door arcs / dashed /
// dimension linework so only thick walls bound regions, then closeGaps seals
// doorways below the user's gap threshold) and a FINE map (same closing but
// thin strokes kept, so shapes whose outlines the opening would erase remain
// closed). Lookup (findRegionAt) is coarse-first — the fine map only rescues
// points the coarse map rejects. Hovering then reduces to O(1) label lookups;
// the hovered region's outer contour is traced and simplified on demand
// (traceRegionOutline + simplifyRing).

import { distanceToSegmentSq } from './geometry';
import type { Point } from './types';

/** Luminance below this ⇒ ink (wall/line). Permissive so mid-grey walls hold. */
export const INK_LUMINANCE_THRESHOLD = 200;

/** Opening radius (px) for thin-line removal: strokes thinner than ~2r+1 px
 * (door swing arcs, dashed reference lines, dimension lines) are erased so
 * only thick walls act as region boundaries. Walls render 3px+ at the base
 * canvas scale, so radius 1 removes ≤2px linework and keeps walls. */
export const THIN_LINE_RADIUS_PX = 1;

/** Default sealable doorway width for the gap-closing slider (real mm) —
 * covers standard 820–920mm door openings. */
export const DEFAULT_GAP_CLOSE_MM = 1000;

/** Maximum user-selectable sealable doorway width (real mm). */
export const MAX_GAP_CLOSE_MM = 2000;

/** Regions smaller than this (px) are noise/hatch cells — never offered. */
export const MIN_REGION_AREA_PX = 300;

/** Regions covering more than this fraction of the page are background-sized
 * leaks — never offered. */
export const MAX_REGION_AREA_FRACTION = 0.5;

/** RDP tolerance (base px) for simplifying traced contours. */
export const RDP_EPSILON_PX = 1.75;

/** Rings above this vertex count are re-simplified with a doubled epsilon
 * (bounds payload size and keeps edit handles usable). */
export const MAX_RING_VERTICES = 200;

/** Padding (px) applied around text boxes when masking them out. */
export const TEXT_MASK_PAD_PX = 1;

export interface MaskRect {
	height: number;
	width: number;
	x: number;
	y: number;
}

export interface RegionInfo {
	/** Interior pixel count (excludes ink islands such as fixtures/symbols). */
	areaPx: number;
	bbox: { x0: number; x1: number; y0: number; y1: number };
	/** 1-based; labels[i] === 0 means ink or unlabeled. */
	id: number;
	/** Region reaches the canvas edge (page background / leaked margin). */
	touchesBorder: boolean;
}

export interface RegionMap {
	height: number;
	/** length = width * height; 0 = ink, >0 = region id. */
	labels: Int32Array;
	/** regions[id - 1]. */
	regions: RegionInfo[];
	width: number;
}

export interface SegmentOptions {
	/** Morphological closing radius, px — seals wall gaps (doorways) narrower
	 * than ~2×radius (0 disables). */
	gapClosePx: number;
	/** Text boxes to erase before labeling so glyphs never form boundaries. */
	textRects: MaskRect[];
}

const LUMA_R = 0.299;
const LUMA_G = 0.587;
const LUMA_B = 0.114;

/** RGBA image data → binary ink mask (1 = ink) via luminance threshold. */
export function binarize(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	threshold: number = INK_LUMINANCE_THRESHOLD
): Uint8Array {
	const mask = new Uint8Array(width * height);
	for (let i = 0; i < mask.length; i++) {
		const o = i * 4;
		const luma = LUMA_R * data[o] + LUMA_G * data[o + 1] + LUMA_B * data[o + 2];
		if (luma < threshold) {
			mask[i] = 1;
		}
	}
	return mask;
}

/** Clear (set to background) padded rectangles in the mask, in place. Used to
 * erase PDF text so labels/dimensions never split or distort a region. Text
 * printed directly over a wall can nick the wall line — the small pad plus
 * gap closing normally heals it. */
export function maskRects(
	mask: Uint8Array,
	width: number,
	height: number,
	rects: MaskRect[],
	padPx: number = TEXT_MASK_PAD_PX
): void {
	for (const rect of rects) {
		const x0 = Math.max(0, Math.floor(rect.x - padPx));
		const y0 = Math.max(0, Math.floor(rect.y - padPx));
		const x1 = Math.min(width - 1, Math.ceil(rect.x + rect.width + padPx));
		const y1 = Math.min(height - 1, Math.ceil(rect.y + rect.height + padPx));
		for (let y = y0; y <= y1; y++) {
			mask.fill(0, y * width + x0, y * width + x1 + 1);
		}
	}
}

/** Mark every pixel within `radius` of a set (=1) pixel along its ROW. Two
 * O(n) distance scans per row, so cost is independent of the radius. When
 * `outsideSet` is true, the virtual border beyond the canvas counts as set. */
function spreadRows(
	src: Uint8Array,
	width: number,
	height: number,
	radius: number,
	outsideSet: boolean
): Uint8Array {
	const out = new Uint8Array(src.length);
	const far = width + height;
	const initial = outsideSet ? 0 : far;
	for (let y = 0; y < height; y++) {
		const row = y * width;
		// Left→right: distance to the nearest set pixel on the left.
		let dist = initial;
		for (let x = 0; x < width; x++) {
			dist = src[row + x] === 1 ? 0 : dist + 1;
			if (dist <= radius) {
				out[row + x] = 1;
			}
		}
		// Right→left: distance to the nearest set pixel on the right.
		dist = initial;
		for (let x = width - 1; x >= 0; x--) {
			dist = src[row + x] === 1 ? 0 : dist + 1;
			if (dist <= radius) {
				out[row + x] = 1;
			}
		}
	}
	return out;
}

/** Column-axis counterpart of spreadRows. Composing the two gives a square
 * (Chebyshev-distance) structuring element of the given radius. */
function spreadCols(
	src: Uint8Array,
	width: number,
	height: number,
	radius: number,
	outsideSet: boolean
): Uint8Array {
	const out = new Uint8Array(src.length);
	const far = width + height;
	const initial = outsideSet ? 0 : far;
	for (let x = 0; x < width; x++) {
		let dist = initial;
		for (let y = 0; y < height; y++) {
			const i = y * width + x;
			dist = src[i] === 1 ? 0 : dist + 1;
			if (dist <= radius) {
				out[i] = 1;
			}
		}
		dist = initial;
		for (let y = height - 1; y >= 0; y--) {
			const i = y * width + x;
			dist = src[i] === 1 ? 0 : dist + 1;
			if (dist <= radius) {
				out[i] = 1;
			}
		}
	}
	return out;
}

/** Dilate ink by `radius` (square structuring element). Outside the canvas is
 * background, so dilation never bleeds in from the border. O(n) in radius. */
export function dilateInk(
	mask: Uint8Array,
	width: number,
	height: number,
	radiusPx: number
): Uint8Array {
	const radius = Math.max(0, Math.round(radiusPx));
	if (radius === 0) {
		return mask;
	}
	const rows = spreadRows(mask, width, height, radius, false);
	return spreadCols(rows, width, height, radius, false);
}

/** Erode ink by `radius`: a pixel survives only when no background lies within
 * the radius. Outside the canvas counts as background, so border ink erodes
 * rather than sticking. O(n) in radius. */
export function erodeInk(
	mask: Uint8Array,
	width: number,
	height: number,
	radiusPx: number
): Uint8Array {
	const radius = Math.max(0, Math.round(radiusPx));
	if (radius === 0) {
		return mask;
	}
	// Erosion of ink = complement of dilating the background.
	const background = new Uint8Array(mask.length);
	for (let i = 0; i < mask.length; i++) {
		background[i] = mask[i] === 1 ? 0 : 1;
	}
	const rows = spreadRows(background, width, height, radius, true);
	const nearBackground = spreadCols(rows, width, height, radius, true);
	const out = new Uint8Array(mask.length);
	for (let i = 0; i < mask.length; i++) {
		if (mask[i] === 1 && nearBackground[i] === 0) {
			out[i] = 1;
		}
	}
	return out;
}

/** Morphological opening (erode then dilate): erases ink strokes thinner than
 * ~2×radius+1 px — door swing arcs, dashed/dotted reference lines, dimension
 * lines — while thick walls survive intact. Radius 0 returns the mask as is. */
export function removeThinLines(
	mask: Uint8Array,
	width: number,
	height: number,
	radiusPx: number = THIN_LINE_RADIUS_PX
): Uint8Array {
	const eroded = erodeInk(mask, width, height, radiusPx);
	return dilateInk(eroded, width, height, radiusPx);
}

/** Morphological closing (dilate ink by radius, then erode by radius) — seals
 * wall gaps (door openings) narrower than ~2×radius without permanently
 * thickening walls. Radius 0 returns the mask untouched. */
export function closeGaps(
	mask: Uint8Array,
	width: number,
	height: number,
	radiusPx: number
): Uint8Array {
	const dilated = dilateInk(mask, width, height, radiusPx);
	return erodeInk(dilated, width, height, radiusPx);
}

/** Push one seed per unlabeled non-ink run of the row segment [from, to]. */
function pushRowSeeds(
	stack: number[],
	mask: Uint8Array,
	labels: Int32Array,
	from: number,
	to: number
): void {
	let inRun = false;
	for (let i = from; i <= to; i++) {
		const open = mask[i] === 0 && labels[i] === 0;
		if (open && !inRun) {
			stack.push(i);
			inRun = true;
		} else if (!open) {
			inRun = false;
		}
	}
}

/** 4-connected labeling of non-ink pixels via iterative scanline flood fill.
 * 4-connectivity is deliberate: it stops leakage through single-pixel diagonal
 * gaps in walls. Returns the label map plus per-region metadata. */
export function labelRegions(
	mask: Uint8Array,
	width: number,
	height: number
): RegionMap {
	const labels = new Int32Array(width * height);
	const regions: RegionInfo[] = [];
	const stack: number[] = [];
	for (let seed = 0; seed < labels.length; seed++) {
		if (mask[seed] !== 0 || labels[seed] !== 0) {
			continue;
		}
		const id = regions.length + 1;
		const info: RegionInfo = {
			areaPx: 0,
			bbox: { x0: width, x1: 0, y0: height, y1: 0 },
			id,
			touchesBorder: false,
		};
		stack.push(seed);
		while (stack.length > 0) {
			const idx = stack.pop() as number;
			if (mask[idx] !== 0 || labels[idx] !== 0) {
				continue;
			}
			const y = Math.floor(idx / width);
			const rowStart = y * width;
			const rowEnd = rowStart + width - 1;
			let left = idx;
			while (
				left > rowStart &&
				mask[left - 1] === 0 &&
				labels[left - 1] === 0
			) {
				left--;
			}
			let right = idx;
			while (
				right < rowEnd &&
				mask[right + 1] === 0 &&
				labels[right + 1] === 0
			) {
				right++;
			}
			labels.fill(id, left, right + 1);
			info.areaPx += right - left + 1;
			const xLeft = left - rowStart;
			const xRight = right - rowStart;
			info.bbox.x0 = Math.min(info.bbox.x0, xLeft);
			info.bbox.x1 = Math.max(info.bbox.x1, xRight);
			info.bbox.y0 = Math.min(info.bbox.y0, y);
			info.bbox.y1 = Math.max(info.bbox.y1, y);
			if (y === 0 || y === height - 1 || xLeft === 0 || xRight === width - 1) {
				info.touchesBorder = true;
			}
			if (y > 0) {
				pushRowSeeds(stack, mask, labels, left - width, right - width);
			}
			if (y < height - 1) {
				pushRowSeeds(stack, mask, labels, left + width, right + width);
			}
		}
		regions.push(info);
	}
	return { height, labels, regions, width };
}

export interface SegmentResult {
	/** Thin lines removed before labeling — rooms bounded by walls only. */
	coarse: RegionMap;
	/** Thin strokes kept as boundaries — rescues thin-outlined closed shapes. */
	fine: RegionMap;
}

/** Full segmentation pipeline for one rendered page raster. In the coarse map
 * thin linework is erased BEFORE gap closing — that ordering is what lets the
 * closing radius be doorway-sized without turning dashed reference lines into
 * false walls. The fine map skips the erasure (same closing) so regions
 * bounded only by thin strokes stay closed; it shares the binarize/maskRects
 * pass (closeGaps/labelRegions never mutate their input mask). */
export function segmentImage(
	data: Uint8ClampedArray,
	width: number,
	height: number,
	options: SegmentOptions
): SegmentResult {
	const mask = binarize(data, width, height);
	maskRects(mask, width, height, options.textRects);
	const walls = removeThinLines(mask, width, height);
	const coarse = labelRegions(
		closeGaps(walls, width, height, options.gapClosePx),
		width,
		height
	);
	const fine = labelRegions(
		closeGaps(mask, width, height, options.gapClosePx),
		width,
		height
	);
	return { coarse, fine };
}

/** Guardrails shared by hover and click: reject the page background (border-
 * touching), leaked mega-regions, and specks. */
export function isUsableRegion(map: RegionMap, id: number): boolean {
	if (id <= 0 || id > map.regions.length) {
		return false;
	}
	const region = map.regions[id - 1];
	if (region.touchesBorder) {
		return false;
	}
	if (region.areaPx < MIN_REGION_AREA_PX) {
		return false;
	}
	return region.areaPx <= map.width * map.height * MAX_REGION_AREA_FRACTION;
}

export interface RegionHit {
	id: number;
	map: RegionMap;
	source: 'coarse' | 'fine';
}

/** Coarse-first region lookup: the coarse map preserves wall-bounded room
 * detection; the fine map only rescues points the coarse map rejects (e.g.
 * shapes whose thin outlines the opening step erased, leaking their interior
 * into the border-touching page background). */
export function findRegionAt(
	result: SegmentResult,
	x: number,
	y: number
): RegionHit | null {
	const { coarse, fine } = result;
	if (x < 0 || y < 0 || x >= coarse.width || y >= coarse.height) {
		return null;
	}
	const coarseId = coarse.labels[y * coarse.width + x];
	if (isUsableRegion(coarse, coarseId)) {
		return { id: coarseId, map: coarse, source: 'coarse' };
	}
	const fineId = fine.labels[y * fine.width + x];
	if (isUsableRegion(fine, fineId)) {
		return { id: fineId, map: fine, source: 'fine' };
	}
	return null;
}

// Moore neighborhood in clockwise order (screen coords, y down), starting W.
const MOORE_DIRS = [
	{ x: -1, y: 0 },
	{ x: -1, y: -1 },
	{ x: 0, y: -1 },
	{ x: 1, y: -1 },
	{ x: 1, y: 0 },
	{ x: 1, y: 1 },
	{ x: 0, y: 1 },
	{ x: -1, y: 1 },
] as const;

const MOORE_COUNT = MOORE_DIRS.length;

/** Trace the outer contour of a region with Moore border-following (interior
 * holes — fixtures, symbols — are naturally ignored). Returns a closed ring of
 * boundary pixel coordinates ordered clockwise. */
export function traceRegionOutline(map: RegionMap, id: number): Point[] {
	const { labels, width, height, regions } = map;
	const region = regions[id - 1];
	if (!region) {
		return [];
	}
	// Start pixel: first region pixel in reading order within the bbox — its
	// west neighbor and the whole rows above it are outside the region.
	let startX = -1;
	let startY = -1;
	for (let y = region.bbox.y0; y <= region.bbox.y1 && startX < 0; y++) {
		const row = y * width;
		for (let x = region.bbox.x0; x <= region.bbox.x1; x++) {
			if (labels[row + x] === id) {
				startX = x;
				startY = y;
				break;
			}
		}
	}
	if (startX < 0) {
		return [];
	}
	const inRegion = (x: number, y: number): boolean =>
		x >= 0 && y >= 0 && x < width && y < height && labels[y * width + x] === id;
	const ring: Point[] = [{ x: startX, y: startY }];
	let px = startX;
	let py = startY;
	// Direction index pointing from the current pixel toward its backtrack
	// neighbor; the start's backtrack is its west neighbor (index 0).
	let backtrack = 0;
	// Jacob's stopping criterion: terminate when the walk is back at the start
	// pixel and about to repeat its first move — a plain position match would
	// truncate regions pinched at the start pixel.
	let firstMoveDir = -1;
	const maxSteps = 4 * (width + height) + 4 * region.areaPx;
	for (let step = 0; step < maxSteps; step++) {
		let found = -1;
		for (let probe = 1; probe <= MOORE_COUNT; probe++) {
			const dirIndex = (backtrack + probe) % MOORE_COUNT;
			const dir = MOORE_DIRS[dirIndex];
			if (inRegion(px + dir.x, py + dir.y)) {
				found = dirIndex;
				break;
			}
		}
		if (found < 0) {
			// Isolated pixel — degenerate region (below min area anyway).
			return ring;
		}
		const atStart = px === startX && py === startY;
		if (atStart && firstMoveDir === -1) {
			firstMoveDir = found;
		} else if (atStart && found === firstMoveDir) {
			// The last pushed vertex is the start revisit — drop the duplicate.
			ring.pop();
			return ring;
		}
		px += MOORE_DIRS[found].x;
		py += MOORE_DIRS[found].y;
		// New backtrack points from the new pixel to the previous one.
		backtrack = (found + MOORE_COUNT / 2) % MOORE_COUNT;
		ring.push({ x: px, y: py });
	}
	return ring;
}

/** Iterative Ramer–Douglas–Peucker over an open chain, marking kept indices. */
function rdpMarkKeep(
	points: Point[],
	first: number,
	last: number,
	epsilonSq: number,
	keep: Uint8Array
): void {
	const spans: [number, number][] = [[first, last]];
	while (spans.length > 0) {
		const [from, to] = spans.pop() as [number, number];
		let maxDistSq = 0;
		let maxIndex = -1;
		for (let i = from + 1; i < to; i++) {
			const d = distanceToSegmentSq(points[i], points[from], points[to]);
			if (d > maxDistSq) {
				maxDistSq = d;
				maxIndex = i;
			}
		}
		if (maxIndex >= 0 && maxDistSq > epsilonSq) {
			keep[maxIndex] = 1;
			spans.push([from, maxIndex], [maxIndex, to]);
		}
	}
}

/** Simplify a closed ring with RDP: anchor at index 0 and the vertex farthest
 * from it, simplify both halves, rejoin. Doubles epsilon until the result is
 * within MAX_RING_VERTICES. */
export function simplifyRing(
	ring: Point[],
	epsilon: number = RDP_EPSILON_PX
): Point[] {
	if (ring.length <= 4) {
		return ring;
	}
	const anchor = ring[0];
	let farIndex = 1;
	let farDistSq = 0;
	for (let i = 1; i < ring.length; i++) {
		const dx = ring[i].x - anchor.x;
		const dy = ring[i].y - anchor.y;
		const d = dx * dx + dy * dy;
		if (d > farDistSq) {
			farDistSq = d;
			farIndex = i;
		}
	}
	let currentEpsilon = epsilon;
	for (;;) {
		const keep = new Uint8Array(ring.length);
		keep[0] = 1;
		keep[farIndex] = 1;
		const epsilonSq = currentEpsilon * currentEpsilon;
		rdpMarkKeep(ring, 0, farIndex, epsilonSq, keep);
		// Second half wraps around: simplify [farIndex..end] against the anchor
		// by treating index 0 as a virtual endpoint appended at ring.length.
		const wrapped = [...ring.slice(farIndex), anchor];
		const wrappedKeep = new Uint8Array(wrapped.length);
		rdpMarkKeep(wrapped, 0, wrapped.length - 1, epsilonSq, wrappedKeep);
		for (let i = 1; i < wrapped.length - 1; i++) {
			if (wrappedKeep[i] === 1) {
				keep[farIndex + i] = 1;
			}
		}
		const result: Point[] = [];
		for (let i = 0; i < ring.length; i++) {
			if (keep[i] === 1) {
				result.push(ring[i]);
			}
		}
		if (result.length <= MAX_RING_VERTICES || result.length <= 4) {
			return result;
		}
		currentEpsilon *= 2;
	}
}
