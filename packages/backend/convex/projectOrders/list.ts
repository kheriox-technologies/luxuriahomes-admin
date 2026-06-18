import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const rows = await ctx.db
			.query('projectOrders')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.order('desc')
			.collect();
		return Promise.all(
			rows.map(async (row) => {
				const notes = await ctx.db
					.query('projectOrderNotes')
					.withIndex('by_order', (q) => q.eq('orderId', row._id))
					.collect();

				let linkedOrderTaskName: string | null = null;
				let linkedParentTaskName: string | null = null;
				if (row.orderTaskId) {
					const orderTask = await ctx.db.get(row.orderTaskId);
					if (orderTask) {
						linkedOrderTaskName = orderTask.name;
						const parentTask = await ctx.db.get(orderTask.parentTaskId);
						if (parentTask) {
							linkedParentTaskName = parentTask.name;
						}
					}
				}

				return {
					...row,
					noteCount: notes.length,
					linkedOrderTaskName,
					linkedParentTaskName,
				};
			})
		);
	},
});
