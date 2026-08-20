import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	addedByFromIdentity,
	getClientQuotationOrThrow,
	INITIAL_QUOTATION_STATUS,
	REVIEW_QUOTATION_STATUS,
	splitGst,
} from './shared';

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

/**
 * Appends entries from the standard special-inclusions list onto a quotation
 * that is still being worked on.
 *
 * Deliberately not a revision: this is the shortcut from the Lists page, so it
 * leaves the version, the status and any collected signatures alone. That is
 * only safe while the quotation has not been approved, which is why anything
 * past review has to go back through `update` and its reapproval path.
 *
 * The already-issued PDF is not regenerated — saving the quotation in the
 * composer reissues it.
 */
export const addSpecialInclusions = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
		entries: v.array(
			v.object({
				text: v.string(),
				amount: v.optional(v.number()),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);

		if (
			quotation.status !== INITIAL_QUOTATION_STATUS &&
			quotation.status !== REVIEW_QUOTATION_STATUS
		) {
			throw new ConvexError({
				code: 'INVALID_STATUS',
				message:
					'Only a draft quotation or one under review can take special inclusions this way. Revise it in the quotation editor instead.',
			});
		}

		const existing = quotation.specialInclusions ?? [];
		const additions = args.entries
			.map((entry) => ({ ...entry, text: entry.text.trim() }))
			.filter((entry) => entry.text.length > 0)
			.map((entry, index) => ({
				text: entry.text,
				amount:
					entry.amount !== undefined && entry.amount > 0
						? round2(entry.amount)
						: undefined,
				order: existing.length + index,
			}));

		if (additions.length === 0) {
			throw new ConvexError({
				code: 'INVALID_INPUT',
				message: 'No special inclusions to add',
			});
		}

		const addedAmount = round2(
			additions.reduce((sum, entry) => sum + (entry.amount ?? 0), 0)
		);
		const totalInclGst = round2(quotation.totalInclGst + addedAmount);
		const { contractSumExclGst, gstAmount } = splitGst(totalInclGst);

		await ctx.db.patch(args.quotationId, {
			specialInclusions: [...existing, ...additions],
			totalInclGst,
			contractSumExclGst,
			gstAmount,
			updatedAt: Date.now(),
			updatedBy: addedByFromIdentity(identity),
		});

		return { added: additions.length, totalInclGst };
	},
});
