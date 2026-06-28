import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import {
	getTemplateOrThrow,
	parseItemPrice,
	recomputeTemplateTotal,
} from '../budgetTemplates/shared';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow, parseTradeName } from '../trades/shared';

export const addItem = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
		tradeId: v.optional(v.id('trades')),
		newTradeName: v.optional(v.string()),
		price: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);
		const price = parseItemPrice(args.price);

		// Resolve the trade: create a new one when a name is supplied, otherwise
		// use the selected existing trade.
		let tradeId: Id<'trades'>;
		if (args.newTradeName !== undefined) {
			const name = parseTradeName(args.newTradeName);
			const searchText = buildTradeSearchText(name);
			tradeId = await ctx.db.insert('trades', { name, searchText });
		} else {
			if (!args.tradeId) {
				throw new ConvexError({
					code: 'INVALID_TRADE',
					message: 'Select a trade or add a new one',
				});
			}
			await getTradeOrThrow(ctx, args.tradeId);
			tradeId = args.tradeId;
		}

		const existing = await ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template_and_trade', (q) =>
				q.eq('budgetTemplateId', args.budgetTemplateId).eq('tradeId', tradeId)
			)
			.first();
		if (existing) {
			throw new ConvexError({
				code: 'DUPLICATE_ITEM',
				message: 'This trade is already in the template',
			});
		}

		const itemId = await ctx.db.insert('budgetTemplateItems', {
			budgetTemplateId: args.budgetTemplateId,
			tradeId,
			price,
		});
		await recomputeTemplateTotal(ctx, args.budgetTemplateId);
		return itemId;
	},
});
