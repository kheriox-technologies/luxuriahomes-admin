import { ConvexError, v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { contingencyAmount } from '../budgetTemplates/shared';

const AUSTRALIAN_POSTCODE_REGEX = /^\d{4}$/;

/**
 * Budget total per project id: each trade's price plus its contingency amount,
 * mirroring the Budgets tab "T" badge. Only counts budget rows whose trade still
 * exists, so orphaned rows left by a deleted trade don't inflate the total.
 */
export function budgetTotalsByProject(
	budgets: Doc<'projectBudgets'>[],
	trades: Doc<'trades'>[]
): Map<string, number> {
	const existingTradeIds = new Set(trades.map((trade) => trade._id));
	const totals = new Map<string, number>();
	for (const budget of budgets) {
		if (!existingTradeIds.has(budget.tradeId)) {
			continue;
		}
		const current = totals.get(budget.projectId) ?? 0;
		totals.set(
			budget.projectId,
			current +
				(budget.price ?? 0) +
				contingencyAmount(budget.price, budget.contingencyPercent)
		);
	}
	return totals;
}

export const australianStateValidator = v.union(
	v.literal('ACT'),
	v.literal('NSW'),
	v.literal('NT'),
	v.literal('QLD'),
	v.literal('SA'),
	v.literal('TAS'),
	v.literal('VIC'),
	v.literal('WA')
);

export const australianAddressValidator = v.object({
	street: v.string(),
	suburb: v.string(),
	state: australianStateValidator,
	postcode: v.string(),
});

export function assertAustralianPostcode(postcode: string): void {
	if (!AUSTRALIAN_POSTCODE_REGEX.test(postcode)) {
		throw new ConvexError({
			code: 'INVALID_POSTCODE',
			message: 'Postcode must be exactly 4 digits',
		});
	}
}

export function assertAustralianAddress(address: {
	street: string;
	suburb: string;
	postcode: string;
}): void {
	assertAustralianPostcode(address.postcode);
}

export const projectStatusValidator = v.union(
	v.literal('not_started'),
	v.literal('in_progress'),
	v.literal('completed')
);

export const projectClientValidator = v.object({
	firstName: v.string(),
	lastName: v.string(),
	email: v.string(),
	phone: v.string(),
	company: v.optional(v.string()),
	address: v.optional(australianAddressValidator),
	// Client portal access. Presence of portalUserId means the client has a
	// Clerk account (member + client roles) and can sign in to the portal.
	portalUserId: v.optional(v.string()),
	portalAccessGrantedAt: v.optional(v.number()),
});

/**
 * Normalizes an email for matching project clients (trim + lowercase).
 * Project clients have no stable id, so they are identified by project + email.
 */
export function normalizeClientEmail(email: string): string {
	return email.trim().toLowerCase();
}
