import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from '../scheduleStages/shared';
import { nextTaskOrder, parseTaskDurationDays, parseTaskName } from './shared';

export const add = mutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
		stageId: v.id('scheduleStages'),
		name: v.string(),
		durationDays: v.number(),
		dependencyTaskId: v.optional(v.id('scheduleTasks')),
		dependencyType: v.optional(
			v.union(v.literal('startAfter'), v.literal('startWith'))
		),
		offsetDays: v.optional(v.number()),
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

		const name = parseTaskName(args.name);
		const durationDays = parseTaskDurationDays(args.durationDays);

		if (args.dependencyTaskId) {
			const dep = await ctx.db.get(args.dependencyTaskId);
			if (!dep || dep.stageId !== args.stageId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency task must belong to the same stage',
				});
			}
		}

		const order = await nextTaskOrder(ctx, args.stageId);

		return await ctx.db.insert('scheduleTasks', {
			scheduleTemplateId: args.scheduleTemplateId,
			stageId: args.stageId,
			name,
			durationDays,
			order,
			dependencyTaskId: args.dependencyTaskId,
			dependencyType: args.dependencyTaskId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
		});
	},
});
