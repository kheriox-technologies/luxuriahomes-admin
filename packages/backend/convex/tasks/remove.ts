import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow, syncStageCounters } from './shared';

export const remove = mutation({
	args: {
		taskId: v.id('tasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getTaskOrThrow(ctx, args.taskId);

		await ctx.db.delete(args.taskId);
		await syncStageCounters(ctx, task.stageId);
	},
});
