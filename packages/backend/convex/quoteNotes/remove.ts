import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteNoteOrThrow } from './shared';

export const remove = mutation({
	args: {
		noteId: v.id('quoteNotes'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteNoteOrThrow(ctx, args.noteId);
		await ctx.db.delete(args.noteId);
		return args.noteId;
	},
});
