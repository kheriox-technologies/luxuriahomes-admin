import { internalMutation } from '../_generated/server';

/**
 * One-off repair: clear `orderRefId` / `orderStatus` on inclusions whose linked
 * order no longer exists. Orphaned links predate the order-delete cleanup and
 * otherwise leave an inclusion showing a stale order status (e.g. "Delivered")
 * with no order behind it. Returns the number of inclusions fixed; safe to
 * re-run (a clean database returns 0).
 *
 * Run once from the Convex dashboard as
 * `internal.projectInclusions.clearOrphanedOrderRefs.clearOrphanedOrderRefs`,
 * then delete this file.
 */
export const clearOrphanedOrderRefs = internalMutation({
	args: {},
	handler: async (ctx) => {
		const inclusions = await ctx.db.query('projectInclusions').collect();
		let cleared = 0;
		for (const inclusion of inclusions) {
			if (!inclusion.orderRefId) {
				continue;
			}
			const order = await ctx.db
				.query('projectOrders')
				.withIndex('by_order_id', (q) =>
					q.eq('orderId', inclusion.orderRefId as string)
				)
				.first();
			if (!order) {
				await ctx.db.patch(inclusion._id, {
					orderRefId: undefined,
					orderStatus: undefined,
				});
				cleared++;
			}
		}
		return { cleared, total: inclusions.length };
	},
});
