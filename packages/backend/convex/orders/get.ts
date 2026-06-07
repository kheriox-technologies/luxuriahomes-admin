import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		orderId: v.id('orders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const order = await ctx.db.get(args.orderId);
		if (!order) {
			return null;
		}

		const stage = order.stageId ? await ctx.db.get(order.stageId) : null;
		const task = order.taskId ? await ctx.db.get(order.taskId) : null;

		return {
			order,
			stageName: stage?.name ?? null,
			taskName: task?.name ?? null,
		};
	},
});
