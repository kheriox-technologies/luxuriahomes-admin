import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from '../scheduleStages/shared';
import { getTaskOrThrow } from '../scheduleTasks/shared';
import { parseOrderTaskDurationDays, parseOrderTaskName } from './shared';

export const add = mutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
		stageId: v.id('scheduleStages'),
		parentTaskId: v.id('scheduleTasks'),
		name: v.string(),
		durationDays: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const stage = await getStageOrThrow(ctx, args.stageId);
		if (stage.scheduleTemplateId !== args.scheduleTemplateId) {
			throw new ConvexError({
				code: 'INVALID_STAGE',
				message: 'Stage does not belong to this schedule template',
			});
		}

		const parentTask = await getTaskOrThrow(ctx, args.parentTaskId);
		if (parentTask.stageId !== args.stageId) {
			throw new ConvexError({
				code: 'INVALID_TASK',
				message: 'Parent task does not belong to this stage',
			});
		}

		const existing = await ctx.db
			.query('scheduleOrderTasks')
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

		return await ctx.db.insert('scheduleOrderTasks', {
			scheduleTemplateId: args.scheduleTemplateId,
			stageId: args.stageId,
			parentTaskId: args.parentTaskId,
			name,
			durationDays,
		});
	},
});
