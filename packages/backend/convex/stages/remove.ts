import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from './shared';

export const remove = mutation({
	args: {
		stageId: v.id('stages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);

		const tasks = await ctx.db
			.query('tasks')
			.withIndex('by_stage', (q) => q.eq('stageId', args.stageId))
			.first();

		if (tasks) {
			throw new ConvexError({
				code: 'STAGE_HAS_TASKS',
				message: 'Remove all tasks from this stage before deleting it',
			});
		}

		await ctx.db.delete(args.stageId);
	},
});
