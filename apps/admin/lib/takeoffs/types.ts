// Types for the (temporary) takeoffs test page. Kept clean so they can later
// be lifted into a Convex-backed feature with minimal change.

export interface Point {
	x: number;
	y: number;
}

export type ToolId =
	| 'pan'
	| 'select'
	| 'calibrate'
	| 'linear'
	| 'rectangle'
	| 'circle'
	| 'polygon'
	| 'count';

export type MeasurementType =
	| 'linear'
	| 'rectangle'
	| 'circle'
	| 'polygon'
	| 'count';

// Area-like measurement types — all populate valueSqm + perimeterMeters.
export const AREA_TYPES = ['rectangle', 'circle', 'polygon'] as const;

// Shared set for "is this an area-like type?" checks across the feature.
export const AREA_TYPE_SET = new Set<MeasurementType>(AREA_TYPES);

export type LengthUnit = 'mm' | 'cm' | 'm';

// All point coordinates are stored in BASE canvas pixel space (the unscaled
// rendered page), so values are independent of the current zoom/pan.
//
// Per-type `points` convention:
// - linear:    polyline vertices
// - rectangle: [anchorCorner, oppositeCorner] (axis-aligned; 4 corners derived)
// - circle:    [center, edgePoint] (radius = distance(center, edge))
// - polygon:   vertices (shoelace area)
// - count:     marker positions
export interface Measurement {
	/** Manual area (m²) ADDED to the rounded value; for linear, added to the height-based area. */
	areaAddSqm?: number;
	/** Manual area (m²) SUBTRACTED from the rounded value; for linear, from the height-based area. */
	areaSubtractSqm?: number;
	/** Stroke/fill colour for this shape (hex). Group members share one colour. */
	color?: string;
	/** Number of markers (count). */
	count?: number;
	/** Free-text note for this measurement, edited via the row actions menu. */
	description?: string;
	/** Text auto-detected from the PDF inside this shape (drives the group label). */
	detectedText?: string;
	/** If set, this shape is part of a combined "Add" group keyed by this id. */
	groupId?: string;
	/** Custom name for the "Add" group this shape belongs to; overrides detectedText/fallback. */
	groupLabel?: string;
	/** Wall height in metres for linear measurements; drives a computed wall area. */
	heightMeters?: number;
	/** When true, the shape is not drawn on the canvas (still listed in the panel). */
	hidden?: boolean;
	id: string;
	label: string;
	page: number;
	/** If set, this area shape is a deduction subtracted from the parent's area. */
	parentId?: string;
	/** Perimeter in metres (area-like: rectangle/circle/polygon). */
	perimeterMeters?: number;
	points: Point[];
	type: MeasurementType;
	/** Total length in metres (linear). */
	valueMeters?: number;
	/** Area in square metres (area-like: rectangle/circle/polygon). */
	valueSqm?: number;
	/** Per-measurement wastage % override; falls back to the global default when unset. */
	wastagePercent?: number;
}

// Per-page scale derived from a calibration line.
export interface Calibration {
	metersPerPixel: number;
	page: number;
}

// A print-style legend box anchored to one page, in BASE canvas-pixel space (the
// same coordinate system as Measurement.points) so it scales, pans and prints
// with the page. Height is not stored — the table auto-fits its rows so printing
// never clips content; resize adjusts width, move adjusts x/y. One legend per page.
export interface Legend {
	page: number;
	/** Box width, base px. Font size scales with width; height follows content. */
	width: number;
	/** Top-left x, base px. */
	x: number;
	/** Top-left y, base px. */
	y: number;
}

// Standard paper sizes, plus 'auto' which reads the PDF's intrinsic media box.
export type PaperSize = 'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'auto';

// A known drawing scale (e.g. 1:100 on A3) — resolved to metres-per-pixel using
// each page's geometry, since render scale and orientation vary per page.
export interface ScaleSetting {
	paper: PaperSize;
	/** Denominator of the scale ratio, e.g. 100 for 1:100. */
	ratio: number;
}

// Natural (PDF point) + rendered (base-pixel) geometry of one page.
export interface PageGeometry {
	baseHeight: number;
	baseWidth: number;
	naturalHeight: number;
	naturalWidth: number;
}

// How a page's measurement scale is determined. Calibration resolves to a fixed
// metres-per-pixel; a drawing scale resolves per page via PageGeometry.
export type MeasurementMethod =
	| { kind: 'calibration'; mpp: number }
	| { kind: 'scale'; scale: ScaleSetting };

// Whether a scale/calibration sets the PDF-wide default or one page's override.
export type MethodScope = 'all' | 'page';

// An in-progress pointer drag. `draw-*` create a new shape; `move` repositions a
// committed shape; `handle` resizes one of its points. For every mode the live
// update is uniform: replace `orig[index]` with the pointer (handle), translate
// `orig` by the pointer delta from `start` (move), or rebuild the draft (draw).
export type DragKind =
	| { mode: 'draw-rect'; start: Point }
	| { mode: 'draw-circle'; start: Point }
	| {
			children?: { id: string; orig: Point[] }[];
			id: string;
			mode: 'move';
			orig: Point[];
			start: Point;
	  }
	| { id: string; index: number; mode: 'handle'; orig: Point[] }
	| {
			axis: 'x' | 'y';
			id: string;
			indices: number[];
			mode: 'edge';
			orig: Point[];
			start: Point;
	  };
