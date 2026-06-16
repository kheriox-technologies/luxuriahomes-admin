import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	projectScheduleStatusValidator,
	scheduleDependencyTypeValidator,
} from '../schema';
import {
	nextProjectTaskOrder,
	parseProjectTaskDurationDays,
	parseProjectTaskName,
	recalcStageDates,
} from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		stageId: v.id('projectStages'),
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
		const stage = await ctx.db.get(args.stageId);
		if (!stage || stage.projectId !== args.projectId) {
			throw new ConvexError({
				code: 'INVALID_STAGE',
				message: 'Stage not found or does not belong to this project',
			});
		}
		const name = parseProjectTaskName(args.name);
		const durationDays = parseProjectTaskDurationDays(args.durationDays);

		if (args.dependencyTaskId) {
			const dep = await ctx.db.get(args.dependencyTaskId);
			if (!dep || dep.stageId !== args.stageId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency task must belong to the same stage',
				});
			}
		}

		const order = await nextProjectTaskOrder(ctx, args.stageId);

		const taskId = await ctx.db.insert('projectTasks', {
			projectId: args.projectId,
			stageId: args.stageId,
			name,
			durationDays,
			order,
			dependencyTaskId: args.dependencyTaskId,
			dependencyType: args.dependencyTaskId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
			startDate: args.startDate,
			endDate: args.endDate,
			status: args.status ?? 'Pending',
		});

		await recalcStageDates(ctx, args.stageId);

		return taskId;
	},
});
