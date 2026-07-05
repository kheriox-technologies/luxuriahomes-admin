import type { Doc } from '@workspace/backend/dataModel';

// Rows from clientPortal/inclusions/list embed the resolved category name and a
// notes flag. Unlike the admin type there is no `unitAbbr`.
export type ClientInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	categoryName: string;
};

export interface ClientInclusionSection {
	data: ClientInclusion[];
	key: string;
	title: string;
	variationTotal: number;
}
