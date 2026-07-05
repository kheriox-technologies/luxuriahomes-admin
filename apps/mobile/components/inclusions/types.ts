import type { Doc } from '@workspace/backend/dataModel';
import type { BadgeVariant } from '@/components/ui/badge';

export type ProjectInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	unitAbbr?: string;
};

export const CLASS_FILTERS = ['All', 'Standard', 'Gold', 'Platinum'] as const;
export type ClassFilter = (typeof CLASS_FILTERS)[number];

/** Shared class → badge colour mapping used across inclusion surfaces. */
export const classVariants: Record<string, BadgeVariant> = {
	Standard: 'info',
	Gold: 'yellow',
	Platinum: 'purple',
};

export const GROUP_BY_OPTIONS = ['category', 'location', 'vendor'] as const;
export type GroupBy = (typeof GROUP_BY_OPTIONS)[number];

export interface InclusionSection {
	data: ProjectInclusion[];
	key: string;
	title: string;
	variationTotal: number;
}
