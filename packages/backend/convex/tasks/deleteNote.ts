import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { getVisibleTaskOrThrow } from './shared';

export const deleteNote = mutation({
	args: {
		noteId: v.id('taskNotes'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const note = await ctx.db.get(args.noteId);
		if (!note) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Note not found',
			});
		}
		// Notes inherit their task's visibility.
		await getVisibleTaskOrThrow(ctx, note.taskId, identity.subject);
		await ctx.db.delete(args.noteId);
	},
});
