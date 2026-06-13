import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow } from './shared';

export const remove = mutation({
	args: {
		taskId: v.id('scheduleTasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const task = await getTaskOrThrow(ctx, args.taskId);

		// Null out dependency references from sibling tasks
		const siblings = await ctx.db
			.query('scheduleTasks')
			.withIndex('by_stage', (q) => q.eq('stageId', task.stageId))
			.collect();
		for (const sibling of siblings) {
			if (sibling.dependencyTaskId === args.taskId) {
				await ctx.db.patch(sibling._id, {
					dependencyTaskId: undefined,
					dependencyType: undefined,
				});
			}
		}

		await ctx.db.delete(args.taskId);
		return args.taskId;
	},
});
