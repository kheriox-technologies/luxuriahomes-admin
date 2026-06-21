import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { taskStatusValidator } from '../schema';
import { getTaskOrThrow } from './shared';

/**
 * Lightweight mutation used by the Kanban board's drag-and-drop to move a card
 * into a new status lane at a given position.
 */
export const updateStatus = mutation({
	args: {
		taskId: v.id('tasks'),
		status: taskStatusValidator,
		order: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTaskOrThrow(ctx, args.taskId);
		await ctx.db.patch(args.taskId, {
			status: args.status,
			order: args.order,
		});
		return args.taskId;
	},
});
