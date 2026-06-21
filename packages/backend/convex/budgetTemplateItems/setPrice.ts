import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	getTemplateOrThrow,
	parseItemPrice,
	recomputeTemplateTotal,
} from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow } from '../trades/shared';

/**
 * Upserts a trade's price within a budget template. Used both when adding a
 * new trade row and when editing an existing row's price. Recomputes the
 * template total afterwards.
 */
export const setPrice = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
		tradeId: v.id('trades'),
		price: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);
		await getTradeOrThrow(ctx, args.tradeId);
		const price = parseItemPrice(args.price);

		const existing = await ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template_and_trade', (q) =>
				q
					.eq('budgetTemplateId', args.budgetTemplateId)
					.eq('tradeId', args.tradeId)
			)
			.first();

		let itemId = existing?._id;
		if (existing) {
			await ctx.db.patch(existing._id, { price });
		} else {
			itemId = await ctx.db.insert('budgetTemplateItems', {
				budgetTemplateId: args.budgetTemplateId,
				tradeId: args.tradeId,
				price,
			});
		}

		await recomputeTemplateTotal(ctx, args.budgetTemplateId);
		return itemId;
	},
});
