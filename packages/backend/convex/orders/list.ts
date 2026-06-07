import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {
		stageId: v.optional(v.id('stages')),
		taskId: v.optional(v.id('tasks')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		if (args.taskId) {
			const orders = await ctx.db
				.query('orders')
				.withIndex('by_task', (q) => q.eq('taskId', args.taskId))
				.collect();
			return orders.sort((a, b) => a.name.localeCompare(b.name));
		}

		if (args.stageId) {
			const orders = await ctx.db
				.query('orders')
				.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
				.collect();
			return orders.sort((a, b) => a.name.localeCompare(b.name));
		}

		const orders = await ctx.db.query('orders').collect();
		return orders.sort((a, b) => a.name.localeCompare(b.name));
	},
});
