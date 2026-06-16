import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	projectScheduleStatusValidator,
	scheduleDependencyTypeValidator,
} from '../schema';
import {
	getProjectTaskOrThrow,
	parseProjectTaskDurationDays,
	parseProjectTaskName,
	recalcStageDates,
	recalcStageStatus,
} from './shared';

export const update = mutation({
	args: {
		taskId: v.id('projectTasks'),
		name: v.string(),
		durationDays: v.number(),
		dependencyTaskId: v.optional(v.id('projectTasks')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
		startDate: v.number(),
		endDate: v.number(),
		status: v.optional(projectScheduleStatusValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getProjectTaskOrThrow(ctx, args.taskId);
		const name = parseProjectTaskName(args.name);
		const durationDays = parseProjectTaskDurationDays(args.durationDays);

		if (args.dependencyTaskId) {
			if (args.dependencyTaskId === args.taskId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'A task cannot depend on itself',
				});
			}
			const dep = await ctx.db.get(args.dependencyTaskId);
			if (!dep || dep.stageId !== task.stageId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency task must belong to the same stage',
				});
			}
		}

		const newStatus = args.status ?? task.status;

		await ctx.db.patch(args.taskId, {
			name,
			durationDays,
			dependencyTaskId: args.dependencyTaskId,
			dependencyType: args.dependencyTaskId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
			startDate: args.startDate,
			endDate: args.endDate,
			status: newStatus,
		});

		await recalcStageDates(ctx, task.stageId);
		await recalcStageStatus(ctx, task.stageId);
	},
});
