import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectTaskOrThrow, recalcStageDates } from './shared';

export const updateDates = mutation({
	args: {
		taskId: v.id('projectTasks'),
		startDate: v.number(),
		endDate: v.number(),
		durationDays: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getProjectTaskOrThrow(ctx, args.taskId);
		await ctx.db.patch(args.taskId, {
			startDate: args.startDate,
			endDate: args.endDate,
			durationDays: args.durationDays,
		});
		await recalcStageDates(ctx, task.stageId);
	},
});
