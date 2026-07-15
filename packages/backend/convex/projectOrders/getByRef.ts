import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Resolve an inclusion's human-readable `orderRefId` (e.g. "LHA-ABC123") to its
 * projectOrders document. Returns `null` when the referenced order no longer
 * exists (e.g. it was deleted, leaving the inclusion's order link stale).
 */
export const getByRef = query({
	args: {
		orderRefId: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('projectOrders')
			.withIndex('by_order_id', (q) => q.eq('orderId', args.orderRefId))
			.first();
	},
});
