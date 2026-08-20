import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuotationSpecialInclusionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	nextSpecialInclusionOrder,
	parseSpecialInclusionAmount,
	parseSpecialInclusionText,
} from './shared';

export const add = mutation({
	args: {
		text: v.string(),
		amount: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const text = parseSpecialInclusionText(args.text);
		return await ctx.db.insert('quotationSpecialInclusions', {
			text,
			amount: parseSpecialInclusionAmount(args.amount),
			order: await nextSpecialInclusionOrder(ctx),
			createdAt: Date.now(),
			searchText: buildQuotationSpecialInclusionSearchText(text),
		});
	},
});
