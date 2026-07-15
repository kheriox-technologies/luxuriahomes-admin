import type { Doc, Id } from '@workspace/backend/dataModel';
import type { BadgeVariant } from '@/components/ui/badge';

export type ProjectInclusion = Doc<'projectInclusions'> & {
	hasNotes: boolean;
	unitAbbr?: string;
};

/**
 * A line item staged in the mobile order builder. Carries everything needed to
 * build the projectOrders.add item payload so the builder doesn't have to
 * re-read the inclusion. Mirrors the portal's PendingOrderItem.
 */
export interface PendingOrderItem {
	color?: string;
	costPrice: number;
	details?: string;
	inclusionId: Id<'projectInclusions'>;
	models: string[];
	title: string;
	totalQty: number;
	unit: string;
	vendor: string;
}

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
