import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getOrderOrThrow } from './shared';

export const remove = mutation({
	args: {
		orderId: v.id('orders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getOrderOrThrow(ctx, args.orderId);
		await ctx.db.delete(args.orderId);
	},
});
