import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	getTemplateOrThrow,
	parseContingencyPercent,
	parseItemPrice,
	recomputeTemplateTotal,
} from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const setPrices = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
		// Both fields are optional so a row can have only its price or only its
		// contingency changed; an item with neither is a no-op.
		items: v.array(
			v.object({
				tradeId: v.id('trades'),
				price: v.optional(v.number()),
				contingencyPercent: v.optional(v.number()),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);

		// Upsert each trade's price/contingency, then recompute the totals once.
		for (const item of args.items) {
			if (item.price === undefined && item.contingencyPercent === undefined) {
				continue;
			}
			const fields: { price?: number; contingencyPercent?: number } = {};
			if (item.price !== undefined) {
				fields.price = parseItemPrice(item.price);
			}
			if (item.contingencyPercent !== undefined) {
				fields.contingencyPercent = parseContingencyPercent(
					item.contingencyPercent
				);
			}
			const existing = await ctx.db
				.query('budgetTemplateItems')
				.withIndex('by_template_and_trade', (q) =>
					q
						.eq('budgetTemplateId', args.budgetTemplateId)
						.eq('tradeId', item.tradeId)
				)
				.first();
			if (existing) {
				await ctx.db.patch(existing._id, fields);
			} else {
				await ctx.db.insert('budgetTemplateItems', {
					budgetTemplateId: args.budgetTemplateId,
					tradeId: item.tradeId,
					// A template item always carries a price; default a percent-only
					// insert to $0 so the row is valid.
					price: fields.price ?? 0,
					contingencyPercent: fields.contingencyPercent,
				});
			}
		}

		await recomputeTemplateTotal(ctx, args.budgetTemplateId);
		return args.budgetTemplateId;
	},
});
