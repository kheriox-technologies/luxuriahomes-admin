import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildQuotationSpecialInclusionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getSpecialInclusionOrThrow,
	parseSpecialInclusionAmount,
	parseSpecialInclusionText,
} from './shared';

export const update = mutation({
	args: {
		inclusionId: v.id('quotationSpecialInclusions'),
		text: v.optional(v.string()),
		// `null` clears the price; omitting the field leaves it untouched.
		amount: v.optional(v.union(v.number(), v.null())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getSpecialInclusionOrThrow(ctx, args.inclusionId);
		const patch: Partial<Doc<'quotationSpecialInclusions'>> = {};
		if (args.text !== undefined) {
			const text = parseSpecialInclusionText(args.text);
			patch.text = text;
			patch.searchText = buildQuotationSpecialInclusionSearchText(text);
		}
		if (args.amount !== undefined) {
			patch.amount = parseSpecialInclusionAmount(args.amount);
		}
		await ctx.db.patch(args.inclusionId, patch);
		return args.inclusionId;
	},
});
