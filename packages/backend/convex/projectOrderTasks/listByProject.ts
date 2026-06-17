import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByProject = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('projectOrderTasks')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
	},
});
