import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getOrderOrThrow } from './shared';

export const remove = mutation({
	args: { orderId: v.id('projectOrders') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const order = await getOrderOrThrow(ctx, args.orderId);

		const notes = await ctx.db
			.query('projectOrderNotes')
			.withIndex('by_order', (q) => q.eq('orderId', args.orderId))
			.collect();
		for (const note of notes) {
			await ctx.db.delete(note._id);
		}

		const history = await ctx.db
			.query('projectOrderStatusHistory')
			.withIndex('by_order', (q) => q.eq('orderId', args.orderId))
			.collect();
		for (const entry of history) {
			await ctx.db.delete(entry._id);
		}

		const inclusions = await ctx.db
			.query('projectInclusions')
			.withIndex('by_order_ref', (q) => q.eq('orderRefId', order.orderId))
			.collect();
		for (const inclusion of inclusions) {
			await ctx.db.patch(inclusion._id, {
				orderRefId: undefined,
				orderStatus: undefined,
			});
		}

		await ctx.db.delete(args.orderId);
		return args.orderId;
	},
});
