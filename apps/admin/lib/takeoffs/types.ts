// Types for the (temporary) takeoffs test page. Kept clean so they can later
// be lifted into a Convex-backed feature with minimal change.

export interface Point {
	x: number;
	y: number;
}

export type ToolId = 'pan' | 'calibrate' | 'linear' | 'area' | 'count';

export type MeasurementType = 'linear' | 'area' | 'count';

export type LengthUnit = 'mm' | 'cm' | 'm';

// All point coordinates are stored in BASE canvas pixel space (the unscaled
// rendered page), so values are independent of the current zoom/pan.
export interface Measurement {
	/** Number of markers (count). */
	count?: number;
	id: string;
	label: string;
	page: number;
	/** Perimeter in metres (area). */
	perimeterMeters?: number;
	points: Point[];
	type: MeasurementType;
	/** Total length in metres (linear). */
	valueMeters?: number;
	/** Area in square metres (area). */
	valueSqm?: number;
}

// Per-page scale derived from a calibration line.
export interface Calibration {
	metersPerPixel: number;
	page: number;
}
