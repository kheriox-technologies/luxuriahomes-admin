import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { parseItemPrice } from '../budgetTemplates/shared';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow, parseTradeName } from '../trades/shared';

export const addItem = mutation({
	args: {
		projectId: v.id('projects'),
		tradeId: v.optional(v.id('trades')),
		newTradeName: v.optional(v.string()),
		price: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}
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
			.query('projectBudgets')
			.withIndex('by_project_and_trade', (q) =>
				q.eq('projectId', args.projectId).eq('tradeId', tradeId)
			)
			.first();
		if (existing) {
			throw new ConvexError({
				code: 'DUPLICATE_ITEM',
				message: 'This trade already has a budget on this project',
			});
		}

		const budgetId = await ctx.db.insert('projectBudgets', {
			projectId: args.projectId,
			tradeId,
			price,
		});
		return budgetId;
	},
});
