import type { Doc, Id } from '@workspace/backend/dataModel';

// The enriched row returned by api.projectQuotations.listByProject.listByProject
// — a projectQuotations doc plus the extra fields the query resolves per row.
export type ProjectQuotation = Doc<'projectQuotations'> & {
	companyName: string;
	noteCount: number;
	tradeName: string;
};

export interface QuotationGroup {
	budgetPrice: number | null;
	key: string;
	quotations: ProjectQuotation[];
	remaining: number | null;
	tradeId: Id<'trades'>;
	tradeName: string;
}

export const QUOTATION_STATUSES = [
	'Under Review',
	'Approved',
	'Rejected',
] as const;

export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];
