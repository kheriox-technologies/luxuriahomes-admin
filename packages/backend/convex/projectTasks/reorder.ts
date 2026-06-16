import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		stageId: v.id('projectStages'),
		taskIds: v.array(v.id('projectTasks')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (let i = 0; i < args.taskIds.length; i++) {
			const taskId = args.taskIds[i];
			if (taskId) {
				await ctx.db.patch(taskId, { order: i });
			}
		}
	},
});
