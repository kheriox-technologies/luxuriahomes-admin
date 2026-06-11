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
				return { ...row, noteCount: notes.length };
			})
		);
	},
});
