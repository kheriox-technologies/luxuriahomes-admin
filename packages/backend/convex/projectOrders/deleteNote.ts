import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const deleteNote = mutation({
	args: {
		noteId: v.id('projectOrderNotes'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const note = await ctx.db.get(args.noteId);
		if (!note) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Note not found',
			});
		}
		await ctx.db.delete(args.noteId);
	},
});
