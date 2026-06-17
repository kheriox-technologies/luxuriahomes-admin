import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { projectScheduleStatusValidator } from '../schema';

export const updateStatus = mutation({
	args: {
		stageId: v.id('projectStages'),
		status: projectScheduleStatusValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await ctx.db.patch(args.stageId, { status: args.status });
		const tasks = await ctx.db
			.query('projectTasks')
			.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
			.collect();
		for (const task of tasks) {
			await ctx.db.patch(task._id, { status: args.status });
		}
	},
});
