import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTaskOrThrow } from './shared';

export const remove = mutation({
	args: {
		taskId: v.id('tasks'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTaskOrThrow(ctx, args.taskId);
		// Remove the task's notes first to avoid orphaned rows.
		const notes = await ctx.db
			.query('taskNotes')
			.withIndex('by_task', (q) => q.eq('taskId', args.taskId))
			.collect();
		for (const note of notes) {
			await ctx.db.delete(note._id);
		}
		await ctx.db.delete(args.taskId);
		return args.taskId;
	},
});
