import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow, parseTaskDurationDays, parseTaskName } from './shared';

export const update = mutation({
	args: {
		taskId: v.id('scheduleTasks'),
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
		const task = await getTaskOrThrow(ctx, args.taskId);
		const name = parseTaskName(args.name);
		const durationDays = parseTaskDurationDays(args.durationDays);

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

		await ctx.db.patch(args.taskId, {
			name,
			durationDays,
			dependencyTaskId: args.dependencyTaskId,
			dependencyType: args.dependencyTaskId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
		});
	},
});
