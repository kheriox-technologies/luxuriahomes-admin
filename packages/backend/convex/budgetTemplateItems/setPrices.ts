import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	getTemplateOrThrow,
	parseItemPrice,
	recomputeTemplateTotal,
} from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const setPrices = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
		items: v.array(
			v.object({
				tradeId: v.id('trades'),
				price: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);

		// Upsert each trade price, then recompute the template total once.
		for (const item of args.items) {
			const price = parseItemPrice(item.price);
			const existing = await ctx.db
				.query('budgetTemplateItems')
				.withIndex('by_template_and_trade', (q) =>
					q
						.eq('budgetTemplateId', args.budgetTemplateId)
						.eq('tradeId', item.tradeId)
				)
				.first();
			if (existing) {
				await ctx.db.patch(existing._id, { price });
			} else {
				await ctx.db.insert('budgetTemplateItems', {
					budgetTemplateId: args.budgetTemplateId,
					tradeId: item.tradeId,
					price,
				});
			}
		}

		await recomputeTemplateTotal(ctx, args.budgetTemplateId);
		return args.budgetTemplateId;
	},
});
