import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectTaskOrThrow } from './shared';

export const clearDependency = mutation({
	args: {
		taskId: v.id('projectTasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectTaskOrThrow(ctx, args.taskId);
		await ctx.db.patch(args.taskId, {
			dependencyTaskId: undefined,
			dependencyType: undefined,
		});
	},
});
