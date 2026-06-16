import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	projectScheduleStatusValidator,
	scheduleDependencyTypeValidator,
} from '../schema';
import { getProjectStageOrThrow, parseProjectStageName } from './shared';

export const update = mutation({
	args: {
		stageId: v.id('projectStages'),
		name: v.string(),
		dependencyStageId: v.optional(v.id('projectStages')),
		dependencyType: v.optional(scheduleDependencyTypeValidator),
		offsetDays: v.optional(v.number()),
		startDate: v.number(),
		endDate: v.number(),
		status: v.optional(projectScheduleStatusValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const stage = await getProjectStageOrThrow(ctx, args.stageId);
		const name = parseProjectStageName(args.name);

		if (args.dependencyStageId) {
			if (args.dependencyStageId === args.stageId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'A stage cannot depend on itself',
				});
			}
			const dep = await ctx.db.get(args.dependencyStageId);
			if (!dep || dep.projectId !== stage.projectId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency stage must belong to the same project',
				});
			}
		}

		const newStatus = args.status ?? stage.status;

		await ctx.db.patch(args.stageId, {
			name,
			dependencyStageId: args.dependencyStageId,
			dependencyType: args.dependencyStageId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
			startDate: args.startDate,
			endDate: args.endDate,
			status: newStatus,
		});

		if (args.status !== undefined) {
			const tasks = await ctx.db
				.query('projectTasks')
				.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
				.collect();
			for (const task of tasks) {
				await ctx.db.patch(task._id, { status: args.status });
			}
		}
	},
});
