import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getOrderOrThrow } from './shared';

export const get = query({
	args: {
		orderId: v.id('projectOrders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await getOrderOrThrow(ctx, args.orderId);
	},
});
