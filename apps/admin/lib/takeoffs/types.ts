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
	/** Stroke/fill colour for this shape (hex). Group members share one colour. */
	color?: string;
	/** Number of markers (count). */
	count?: number;
	/** Text auto-detected from the PDF inside this shape (drives the group label). */
	detectedText?: string;
	/** If set, this shape is part of a combined "Add" group keyed by this id. */
	groupId?: string;
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
}

// Per-page scale derived from a calibration line.
export interface Calibration {
	metersPerPixel: number;
	page: number;
}

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
