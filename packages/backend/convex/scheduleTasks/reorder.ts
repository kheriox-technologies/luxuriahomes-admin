import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		stageId: v.id('scheduleStages'),
		taskIds: v.array(v.id('scheduleTasks')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (let i = 0; i < args.taskIds.length; i++) {
			await ctx.db.patch(args.taskIds[i], { order: i });
		}
	},
});
