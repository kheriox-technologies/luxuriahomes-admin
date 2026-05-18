import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: {
		taskId: v.id('tasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await ctx.db.get(args.taskId);
		if (!task) {
			return null;
		}

		const stage = await ctx.db.get(task.stageId);
		return { task, stageName: stage?.name ?? 'Unknown stage' };
	},
});
