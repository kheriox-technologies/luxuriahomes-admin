import type { Doc } from '@workspace/backend/dataModel';
import type { Legend, MeasurementMethod, TakeoffPersistState } from './types';

type TakeoffDoc = Doc<'takeoffs'>;

// Convex stores per-page maps as arrays (object keys must be strings); the
// in-memory working set keys them by page number. These two helpers convert
// between the two representations at the data boundary.

export function takeoffDocToState(doc: TakeoffDoc): TakeoffPersistState {
	const legends: Record<number, Legend> = {};
	for (const legend of doc.legends) {
		legends[legend.page] = legend;
	}
	const pageTitles: Record<number, string> = {};
	for (const entry of doc.pageTitles) {
		pageTitles[entry.page] = entry.title;
	}
	const pageMethods: Record<number, MeasurementMethod> = {};
	for (const entry of doc.pageMethods) {
		pageMethods[entry.page] = entry.method;
	}
	return {
		measurements: doc.measurements,
		// Legacy rows predate this field: fall back to the pages that hold a
		// measurement so existing take-offs render unchanged.
		measurementPages:
			doc.measurementPages ??
			[...new Set(doc.measurements.map((m) => m.page))].sort((a, b) => a - b),
		legends,
		texts: doc.texts,
		pageTitles,
		// Legacy rows predate the hierarchy: default to no categories (all pages
		// render loose at root, exactly as before).
		categories: doc.categories ?? [],
		documentMethod: doc.documentMethod ?? null,
		pageMethods,
		globalWastage: doc.globalWastage,
	};
}

export interface TakeoffSaveArgs {
	categories: NonNullable<TakeoffDoc['categories']>;
	documentMethod?: MeasurementMethod;
	globalWastage: number;
	legends: TakeoffDoc['legends'];
	measurementPages: number[];
	measurements: TakeoffDoc['measurements'];
	pageMethods: TakeoffDoc['pageMethods'];
	pageTitles: TakeoffDoc['pageTitles'];
	texts: TakeoffDoc['texts'];
}

export function stateToSaveArgs(state: TakeoffPersistState): TakeoffSaveArgs {
	return {
		measurements: state.measurements,
		measurementPages: state.measurementPages,
		legends: Object.values(state.legends),
		texts: state.texts,
		pageTitles: Object.entries(state.pageTitles).map(([page, title]) => ({
			page: Number(page),
			title,
		})),
		categories: state.categories,
		documentMethod: state.documentMethod ?? undefined,
		pageMethods: Object.entries(state.pageMethods).map(([page, method]) => ({
			page: Number(page),
			method,
		})),
		globalWastage: state.globalWastage,
	};
}
