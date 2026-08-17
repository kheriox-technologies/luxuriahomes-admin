import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { QueryCtx } from '../_generated/server';

const AUSTRALIAN_POSTCODE_REGEX = /^\d{4}$/;
const REFERENCE_PREFIX = 'LUX';
const REFERENCE_SEQ_DIGITS = 4;
const MAX_CLIENTS = 2;
const PERCENT_TOTAL = 100;
// Percentages are entered to two decimals, so anything inside half a cent of
// 100 is a rounding artefact rather than a real imbalance.
const PERCENT_EPSILON = 0.005;
const GST_DIVISOR = 1.1;
const MIN_VALIDITY_DAYS = 1;
const MAX_VALIDITY_DAYS = 365;

export const quotationClientValidator = v.object({
	name: v.string(),
	email: v.string(),
	phone: v.string(),
});

export const quotationItemSnapshotValidator = v.object({
	// Provenance only — the catalogue row may later be renamed or deleted, which
	// must never change an issued quotation.
	itemId: v.optional(v.id('quoteItems')),
	name: v.string(),
	order: v.number(),
});

export const quotationSectionSnapshotValidator = v.object({
	sectionId: v.optional(v.id('quoteSections')),
	name: v.string(),
	order: v.number(),
	items: v.array(quotationItemSnapshotValidator),
});

export const quotationStageSnapshotValidator = v.object({
	stageId: v.optional(v.id('quoteStages')),
	name: v.string(),
	order: v.number(),
	// Share of the contract sum; the set totals exactly 100.
	percent: v.number(),
	// Inclusive-of-GST dollars; the set sums exactly to `totalInclGst`.
	amount: v.number(),
	scopeSummary: v.optional(v.string()),
	// Empty when every item under the stage was deselected — the stage still
	// prints in the payment schedule, just without an inclusions block.
	sections: v.array(quotationSectionSnapshotValidator),
});

export const quotationTermsSnapshotValidator = v.object({
	disclaimerHtml: v.string(),
	acknowledgementHtml: v.string(),
	sections: v.array(
		v.object({
			name: v.string(),
			order: v.number(),
			items: v.array(v.string()),
		})
	),
});

export interface QuotationClient {
	email: string;
	name: string;
	phone: string;
}

export interface QuotationStageSnapshot {
	amount: number;
	name: string;
	percent: number;
}

/** `LUX-2026-0148` — the reference printed on the quotation. */
export function formatQuotationReference(year: number, seq: number): string {
	return `${REFERENCE_PREFIX}-${year}-${String(seq).padStart(REFERENCE_SEQ_DIGITS, '0')}`;
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

/**
 * All prices are quoted inclusive of GST, so the contract sum and GST line are
 * derived from the total rather than stored independently.
 */
export function splitGst(totalInclGst: number): {
	contractSumExclGst: number;
	gstAmount: number;
} {
	const contractSumExclGst = round2(totalInclGst / GST_DIVISOR);
	return {
		contractSumExclGst,
		gstAmount: round2(totalInclGst - contractSumExclGst),
	};
}

export function parseQuotationClients(
	clients: QuotationClient[]
): QuotationClient[] {
	const parsed = clients.map((client) => ({
		name: client.name.trim(),
		email: client.email.trim(),
		phone: client.phone.trim(),
	}));
	if (parsed.length === 0 || parsed.length > MAX_CLIENTS) {
		throw new ConvexError({
			code: 'INVALID_CLIENTS',
			message: `A quotation needs between 1 and ${MAX_CLIENTS} clients`,
		});
	}
	if (parsed.some((client) => client.name.length === 0)) {
		throw new ConvexError({
			code: 'INVALID_CLIENTS',
			message: 'Every client needs a name',
		});
	}
	return parsed;
}

export function assertStagePercentsTotal(
	stages: QuotationStageSnapshot[]
): void {
	const total = stages.reduce((sum, stage) => sum + stage.percent, 0);
	if (Math.abs(total - PERCENT_TOTAL) > PERCENT_EPSILON) {
		throw new ConvexError({
			code: 'INVALID_PERCENTAGES',
			message: `Stage percentages total ${total}% — they must total exactly 100%`,
		});
	}
}

export function assertAustralianPostcode(postcode: string): void {
	if (!AUSTRALIAN_POSTCODE_REGEX.test(postcode)) {
		throw new ConvexError({
			code: 'INVALID_POSTCODE',
			message: 'Postcode must be 4 digits',
		});
	}
}

export function parseValidityDays(days: number): number {
	if (
		!Number.isInteger(days) ||
		days < MIN_VALIDITY_DAYS ||
		days > MAX_VALIDITY_DAYS
	) {
		throw new ConvexError({
			code: 'INVALID_VALIDITY',
			message: `Validity must be between ${MIN_VALIDITY_DAYS} and ${MAX_VALIDITY_DAYS} days`,
		});
	}
	return days;
}

export function assertPositiveTotal(totalInclGst: number): void {
	if (!Number.isFinite(totalInclGst) || totalInclGst <= 0) {
		throw new ConvexError({
			code: 'INVALID_TOTAL',
			message: 'Total price must be greater than zero',
		});
	}
}

export async function getClientQuotationOrThrow(
	ctx: QueryCtx,
	quotationId: Id<'clientQuotations'>
) {
	const quotation = await ctx.db.get(quotationId);
	if (!quotation) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quotation not found',
		});
	}
	return quotation;
}
