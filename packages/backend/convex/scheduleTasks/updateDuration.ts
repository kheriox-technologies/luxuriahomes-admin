import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow, parseTaskDurationDays } from './shared';

export const updateDuration = mutation({
	args: {
		taskId: v.id('scheduleTasks'),
		durationDays: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTaskOrThrow(ctx, args.taskId);
		const durationDays = parseTaskDurationDays(args.durationDays);
		await ctx.db.patch(args.taskId, { durationDays });
	},
});
