// Extracts the PDF text layer and maps each text run into BASE canvas pixel
// space (the same space measurement `points` use), so a drawn shape can be
// auto-named from the text that falls inside it.

import { isInsideBody } from './geometry';
import type { Measurement, Point } from './types';
import { AREA_TYPE_SET } from './types';

// A single PDF text run, positioned in base canvas pixel space (top-left origin).
export interface TextBox {
	cx: number;
	cy: number;
	height: number;
	str: string;
	width: number;
	x: number;
	y: number;
}

// Minimal shape of a pdfjs TextItem we rely on. Marked-content items lack `str`.
interface RawTextItem {
	height?: number;
	str?: string;
	transform?: number[];
	width?: number;
}

// Compose two affine matrices `[a,b,c,d,e,f]` (equivalent to pdfjs `Util.transform`,
// inlined so this module never imports pdfjs and stays SSR-safe). `m1` is applied
// last, mapping `m2`'s output into m1's space.
function multiplyMatrix(m1: number[], m2: number[]): number[] {
	return [
		m1[0] * m2[0] + m1[2] * m2[1],
		m1[1] * m2[0] + m1[3] * m2[1],
		m1[0] * m2[2] + m1[2] * m2[3],
		m1[1] * m2[2] + m1[3] * m2[3],
		m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
		m1[1] * m2[4] + m1[3] * m2[5] + m1[5],
	];
}

/**
 * Convert raw `getTextContent().items` into positioned boxes in base canvas
 * pixel space, using the page viewport's `transform` matrix. The viewport
 * transform already flips PDF bottom-left origin to canvas top-left origin, so
 * the only manual adjustment is moving from the glyph baseline up to its top.
 */
export function buildTextBoxes(
	items: RawTextItem[],
	viewportTransform: number[]
): TextBox[] {
	// Viewport scale (PDF points → canvas pixels). `item.width` is already an
	// advance width in PDF points, so it only needs this scale — multiplying by
	// the composed matrix's basis (which also bakes in the font size) would
	// massively inflate the width and push the box centre off the text.
	const viewportScale = Math.hypot(viewportTransform[0], viewportTransform[1]);
	const boxes: TextBox[] = [];
	for (const item of items) {
		const str = item.str;
		// Skip marked-content items (no `str`) and whitespace-only runs.
		if (str === undefined || str.trim().length === 0 || !item.transform) {
			continue;
		}
		const m = multiplyMatrix(viewportTransform, item.transform);
		const baselineX = m[4];
		const baselineY = m[5];
		// Glyph height from the composed matrix's vertical basis (rotation-safe);
		// width from the point-space advance scaled into pixels.
		const height = Math.hypot(m[2], m[3]);
		const width = (item.width ?? 0) * viewportScale;
		const top = baselineY - height;
		boxes.push({
			str,
			x: baselineX,
			y: top,
			width,
			height,
			cx: baselineX + width / 2,
			cy: top + height / 2,
		});
	}
	return boxes;
}

// Boxes within this fraction of the largest matching glyph height are treated as
// the same prominence tier (so a title split across runs joins, while smaller
// annotations are dropped).
const TOP_TIER_RATIO = 0.85;

/**
 * Auto-name an AREA shape (rectangle/circle/polygon) from the PDF text inside
 * it. Returns the most prominent (largest) text — runs sharing that top size are
 * joined in reading order. Returns null for non-area shapes or when no text
 * falls within the shape body.
 */
export function detectLabelForShape(
	shape: Pick<Measurement, 'points' | 'type'>,
	boxes: TextBox[]
): string | null {
	if (!AREA_TYPE_SET.has(shape.type)) {
		return null;
	}
	const inside = boxes.filter((box) => {
		const center: Point = { x: box.cx, y: box.cy };
		return isInsideBody(shape as Measurement, center);
	});
	if (inside.length === 0) {
		return null;
	}
	const maxHeight = Math.max(...inside.map((box) => box.height));
	const topTier = inside.filter(
		(box) => box.height >= maxHeight * TOP_TIER_RATIO
	);
	// Reading order: top→bottom, then left→right within roughly the same row.
	const rowEps = maxHeight * 0.6;
	topTier.sort((a, b) => {
		if (Math.abs(a.cy - b.cy) > rowEps) {
			return a.cy - b.cy;
		}
		return a.cx - b.cx;
	});
	const label = topTier
		.map((box) => box.str)
		.join(' ')
		.replace(/\s+/g, ' ')
		.trim();
	return label.length > 0 ? label : null;
}
