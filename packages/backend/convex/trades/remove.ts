import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow } from './shared';

export const remove = mutation({
	args: {
		tradeId: v.id('trades'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTradeOrThrow(ctx, args.tradeId);
		// Remove the trade's budget rows across every project so deleting a trade
		// doesn't leave orphaned project budgets. (Xero actuals are stored per
		// account, not per trade, so there's nothing trade-keyed to clear.)
		const budgets = await ctx.db
			.query('projectBudgets')
			.withIndex('by_trade', (q) => q.eq('tradeId', args.tradeId))
			.collect();
		for (const row of budgets) {
			await ctx.db.delete(row._id);
		}
		await ctx.db.delete(args.tradeId);
		return args.tradeId;
	},
});
