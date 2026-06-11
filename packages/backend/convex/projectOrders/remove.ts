import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getOrderOrThrow } from './shared';

export const remove = mutation({
	args: { orderId: v.id('projectOrders') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getOrderOrThrow(ctx, args.orderId);

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

		await ctx.db.delete(args.orderId);
		return args.orderId;
	},
});
