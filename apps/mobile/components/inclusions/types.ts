import type { Doc } from '@workspace/backend/dataModel';

export type ProjectInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	unitAbbr?: string;
};

export const CLASS_FILTERS = ['All', 'Standard', 'Gold', 'Platinum'] as const;
export type ClassFilter = (typeof CLASS_FILTERS)[number];

export const GROUP_BY_OPTIONS = ['category', 'location', 'vendor'] as const;
export type GroupBy = (typeof GROUP_BY_OPTIONS)[number];

export interface InclusionSection {
	data: ProjectInclusion[];
	key: string;
	title: string;
	variationTotal: number;
}
