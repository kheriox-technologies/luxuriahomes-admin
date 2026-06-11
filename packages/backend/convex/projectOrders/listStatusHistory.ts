import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getOrderOrThrow } from './shared';

export const listStatusHistory = query({
	args: {
		orderId: v.id('projectOrders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getOrderOrThrow(ctx, args.orderId);
		const rows = await ctx.db
			.query('projectOrderStatusHistory')
			.withIndex('by_order', (q) => q.eq('orderId', args.orderId))
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
