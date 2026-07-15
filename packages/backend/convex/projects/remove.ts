import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = mutation({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.projectId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}
		// Remove the project's budget rows so deleting a project doesn't leave
		// orphaned project budgets behind.
		const budgets = await ctx.db
			.query('projectBudgets')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		for (const row of budgets) {
			await ctx.db.delete(row._id);
		}
		await ctx.db.delete(args.projectId);
		return args.projectId;
	},
});
