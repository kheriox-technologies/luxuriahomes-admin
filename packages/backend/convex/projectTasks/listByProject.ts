import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByProject = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const tasks = await ctx.db
			.query('projectTasks')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		return tasks.sort((a, b) => a.order - b.order);
	},
});
