import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Rewrites the whole list's sort positions from the order the ids arrive in.
 * The frontend sends every note after a drag, so `order` always ends up dense
 * and zero-based.
 */
export const reorder = mutation({
	args: {
		noteIds: v.array(v.id('quoteNotes')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const [index, noteId] of args.noteIds.entries()) {
			await ctx.db.patch(noteId, { order: index });
		}
	},
});
