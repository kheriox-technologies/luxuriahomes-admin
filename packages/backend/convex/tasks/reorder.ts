import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from '../stages/shared';

export const reorder = mutation({
	args: {
		stageId: v.id('stages'),
		orderedIds: v.array(v.id('tasks')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);

		for (const [i, taskId] of args.orderedIds.entries()) {
			const task = await ctx.db.get(taskId);
			if (!task) {
				throw new ConvexError({ code: 'NOT_FOUND', message: 'Task not found' });
			}
			if (task.stageId !== args.stageId) {
				throw new ConvexError({
					code: 'TASK_STAGE_MISMATCH',
					message: 'Task does not belong to the specified stage',
				});
			}
			await ctx.db.patch(taskId, { displayOrder: i });
		}
	},
});
