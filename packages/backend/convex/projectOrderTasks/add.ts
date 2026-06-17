import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectStageOrThrow } from '../projectStages/shared';
import { getProjectTaskOrThrow } from '../projectTasks/shared';
import { parseOrderTaskDurationDays, parseOrderTaskName } from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		stageId: v.id('projectStages'),
		parentTaskId: v.id('projectTasks'),
		name: v.string(),
		durationDays: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const stage = await getProjectStageOrThrow(ctx, args.stageId);
		if (stage.projectId !== args.projectId) {
			throw new ConvexError({
				code: 'INVALID_STAGE',
				message: 'Stage does not belong to this project',
			});
		}

		const parentTask = await getProjectTaskOrThrow(ctx, args.parentTaskId);
		if (parentTask.stageId !== args.stageId) {
			throw new ConvexError({
				code: 'INVALID_TASK',
				message: 'Parent task does not belong to this stage',
			});
		}

		const existing = await ctx.db
			.query('projectOrderTasks')
			.withIndex('by_parent_task', (q) =>
				q.eq('parentTaskId', args.parentTaskId)
			)
			.first();
		if (existing) {
			throw new ConvexError({
				code: 'ALREADY_EXISTS',
				message: 'An order task already exists for this task',
			});
		}

		const name = parseOrderTaskName(args.name);
		const durationDays = parseOrderTaskDurationDays(args.durationDays);

		return await ctx.db.insert('projectOrderTasks', {
			projectId: args.projectId,
			stageId: args.stageId,
			parentTaskId: args.parentTaskId,
			name,
			durationDays,
		});
	},
});
