// Value math ported from apps/portal/lib/takeoffs/geometry.ts and
// computeGroupTotals in apps/portal/components/takeoffs/measurements-panel.tsx.
// Keep in sync with the portal — these must produce identical numbers.

export type MeasurementType =
	| 'linear'
	| 'rectangle'
	| 'circle'
	| 'polygon'
	| 'count';

export type ShapeFamily = 'area' | 'linear' | 'count';

export interface Measurement {
	areaAddSqm?: number;
	areaSubtractSqm?: number;
	color?: string;
	count?: number;
	description?: string;
	groupId?: string;
	heightMeters?: number;
	hidden?: boolean;
	id: string;
	label: string;
	page: number;
	parentId?: string;
	perimeterMeters?: number;
	type: MeasurementType;
	valueMeters?: number;
	valueSqm?: number;
	wastagePercent?: number;
}

export interface TakeoffGroup {
	categoryId?: string;
	color?: string;
	id: string;
	name: string;
}

export interface TakeoffCategory {
	id: string;
	name: string;
}

export const MM_PER_METER = 1000;
export const DEFAULT_WASTAGE = 10;
export const FALLBACK_COLOR = '#2563eb';
export const SUMMARY_COLOR = '#475569';

const AREA_TYPES: ReadonlySet<MeasurementType> = new Set([
	'rectangle',
	'circle',
	'polygon',
]);

export function measurementFamily(type: MeasurementType): ShapeFamily {
	if (AREA_TYPES.has(type)) {
		return 'area';
	}
	if (type === 'linear') {
		return 'linear';
	}
	return 'count';
}

/** Apply a wastage allowance to a measured value and round UP to a whole unit. */
export function roundUpWithWastage(
	value: number,
	wastagePercent: number
): number {
	return Math.ceil(value * (1 + wastagePercent / 100));
}

/** Apply wastage to a linear value (metres) and round UP to a whole millimetre. */
export function roundUpLinearMm(
	valueMeters: number,
	wastagePercent: number
): number {
	return Math.ceil(valueMeters * MM_PER_METER * (1 + wastagePercent / 100));
}

/** Apply manual +/− area adjustments to a rounded area, clamped at zero. */
export function adjustArea(
	rounded: number,
	addSqm?: number,
	subtractSqm?: number
): number {
	return Math.max(0, rounded + (addSqm ?? 0) - (subtractSqm ?? 0));
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

export interface GroupTotals {
	actualMeters: number;
	actualSqm: number;
	hasArea: boolean;
	hasCount: boolean;
	hasHeight: boolean;
	hasLinear: boolean;
	roundedLinearMm: number;
	roundedSqm: number;
	totalCount: number;
	wallAreaSqm: number;
}

/**
 * Aggregate a group's measurements. Rounds each top-level measurement then
 * sums, mirroring how each row displays.
 */
export function computeGroupTotals(
	groupId: string,
	measurements: Measurement[],
	globalWastage: number
): GroupTotals {
	const totals: GroupTotals = {
		hasArea: false,
		hasLinear: false,
		hasCount: false,
		actualSqm: 0,
		roundedSqm: 0,
		actualMeters: 0,
		roundedLinearMm: 0,
		wallAreaSqm: 0,
		hasHeight: false,
		totalCount: 0,
	};
	for (const m of measurements) {
		if (m.groupId !== groupId || m.parentId) {
			continue;
		}
		const wastage = m.wastagePercent ?? globalWastage;
		const family = measurementFamily(m.type);
		if (family === 'area') {
			totals.hasArea = true;
			const net = netAreaSqm(m, measurements);
			totals.actualSqm += net;
			totals.roundedSqm += adjustArea(
				roundUpWithWastage(net, wastage),
				m.areaAddSqm,
				m.areaSubtractSqm
			);
		} else if (family === 'linear') {
			totals.hasLinear = true;
			const length = m.valueMeters ?? 0;
			totals.actualMeters += length;
			const roundedMm = roundUpLinearMm(length, wastage);
			totals.roundedLinearMm += roundedMm;
			if (m.heightMeters && m.heightMeters > 0) {
				totals.hasHeight = true;
				totals.wallAreaSqm += adjustArea(
					Math.ceil((roundedMm / MM_PER_METER) * m.heightMeters),
					m.areaAddSqm,
					m.areaSubtractSqm
				);
			}
		} else {
			totals.hasCount = true;
			totals.totalCount += m.count ?? 0;
		}
	}
	return totals;
}

/** Display text for one measurement row: actual + rounded (with wastage). */
export function measurementValueText(
	measurement: Measurement,
	measurements: Measurement[],
	globalWastage: number
): { actual: string; rounded: string } {
	const wastage = measurement.wastagePercent ?? globalWastage;
	const family = measurementFamily(measurement.type);
	if (family === 'area') {
		const net = netAreaSqm(measurement, measurements);
		const rounded = adjustArea(
			roundUpWithWastage(net, wastage),
			measurement.areaAddSqm,
			measurement.areaSubtractSqm
		);
		return { actual: `${net.toFixed(2)} m²`, rounded: `${rounded} m²` };
	}
	if (family === 'linear') {
		const length = measurement.valueMeters ?? 0;
		const roundedMm = roundUpLinearMm(length, wastage);
		return {
			actual: `${length.toFixed(2)} m`,
			rounded: `${(roundedMm / MM_PER_METER).toFixed(2)} m`,
		};
	}
	const count = measurement.count ?? 0;
	return { actual: `${count}`, rounded: `${count}` };
}
