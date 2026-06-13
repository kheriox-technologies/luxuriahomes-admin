import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow } from './shared';

export const clearDependency = mutation({
	args: {
		taskId: v.id('scheduleTasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTaskOrThrow(ctx, args.taskId);
		await ctx.db.patch(args.taskId, {
			dependencyTaskId: undefined,
			dependencyType: undefined,
		});
	},
});
