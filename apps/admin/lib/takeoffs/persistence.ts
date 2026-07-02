import type { Doc } from '@workspace/backend/dataModel';
import type { MeasurementMethod, TakeoffPersistState } from './types';

type TakeoffDoc = Doc<'takeoffs'>;

// Convex stores per-page maps as arrays (object keys must be strings); the
// in-memory working set keys them by page number. These two helpers convert
// between the two representations at the data boundary.

export function takeoffDocToState(doc: TakeoffDoc): TakeoffPersistState {
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
		legends: doc.legends,
		texts: doc.texts,
		pageTitles,
		// Legacy rows predate the hierarchy: default to empty.
		categories: doc.categories ?? [],
		groups: doc.groups ?? [],
		documentMethod: doc.documentMethod ?? null,
		pageMethods,
		globalWastage: doc.globalWastage,
	};
}

export interface TakeoffSaveArgs {
	categories: NonNullable<TakeoffDoc['categories']>;
	documentMethod?: MeasurementMethod;
	globalWastage: number;
	groups: NonNullable<TakeoffDoc['groups']>;
	legends: TakeoffDoc['legends'];
	measurements: TakeoffDoc['measurements'];
	pageMethods: TakeoffDoc['pageMethods'];
	pageTitles: TakeoffDoc['pageTitles'];
	texts: TakeoffDoc['texts'];
}

export function stateToSaveArgs(state: TakeoffPersistState): TakeoffSaveArgs {
	return {
		measurements: state.measurements,
		legends: state.legends,
		texts: state.texts,
		pageTitles: Object.entries(state.pageTitles).map(([page, title]) => ({
			page: Number(page),
			title,
		})),
		categories: state.categories,
		groups: state.groups,
		documentMethod: state.documentMethod ?? undefined,
		pageMethods: Object.entries(state.pageMethods).map(([page, method]) => ({
			page: Number(page),
			method,
		})),
		globalWastage: state.globalWastage,
	};
}
