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
		// Clear the trade's synced Xero actuals before deleting it.
		const actuals = await ctx.db
			.query('xeroTradeActuals')
			.withIndex('by_trade', (q) => q.eq('tradeId', args.tradeId))
			.collect();
		for (const row of actuals) {
			await ctx.db.delete(row._id);
		}
		await ctx.db.delete(args.tradeId);
		return args.tradeId;
	},
});
