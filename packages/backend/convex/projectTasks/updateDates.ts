import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	cascadeDependentStages,
	cascadeDependentTasks,
	cascadeLinkedOrderDates,
	getProjectTaskOrThrow,
	recalcStageDates,
} from './shared';

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
		await cascadeLinkedOrderDates(ctx, args.taskId, args.startDate);
		// Cascade to dependent tasks within the same stage
		await cascadeDependentTasks(ctx, args.taskId, task.stageId);
		// Recalculate parent stage bounds from all tasks
		await recalcStageDates(ctx, task.stageId);
		// Cascade to any stages that depend on the parent stage
		await cascadeDependentStages(ctx, task.stageId, task.projectId);
	},
});
