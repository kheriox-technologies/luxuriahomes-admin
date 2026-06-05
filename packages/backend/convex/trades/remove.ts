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
		await ctx.db.delete(args.tradeId);
		return args.tradeId;
	},
});
