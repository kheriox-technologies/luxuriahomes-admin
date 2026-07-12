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
	tradeId: Id<'trades'>;
	tradeName: string;
	// Xero-driven "Actual" for the trade; null when nothing has synced.
	xeroActual: number | null;
}

export const QUOTATION_STATUSES = [
	'Under Review',
	'Approved',
	'Rejected',
] as const;

export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];
