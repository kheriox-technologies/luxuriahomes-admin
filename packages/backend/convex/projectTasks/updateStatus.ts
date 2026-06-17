import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { projectScheduleStatusValidator } from '../schema';
import { getProjectTaskOrThrow, recalcStageStatus } from './shared';

export const updateStatus = mutation({
	args: {
		taskId: v.id('projectTasks'),
		status: projectScheduleStatusValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getProjectTaskOrThrow(ctx, args.taskId);
		await ctx.db.patch(args.taskId, { status: args.status });
		await recalcStageStatus(ctx, task.stageId);
	},
});
