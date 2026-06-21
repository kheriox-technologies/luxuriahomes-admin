import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildBudgetSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow } from '../trades/shared';
import { parseBudgetPrice, parseBudgetTitle } from './shared';

export const add = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		price: v.number(),
		tradeId: v.id('trades'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const trade = await getTradeOrThrow(ctx, args.tradeId);
		const title = parseBudgetTitle(args.title);
		const description = args.description?.trim() || undefined;
		const price = parseBudgetPrice(args.price);
		const searchText = buildBudgetSearchText(title, description, trade.name);
		return await ctx.db.insert('budgets', {
			title,
			description,
			price,
			tradeId: args.tradeId,
			searchText,
		});
	},
});
