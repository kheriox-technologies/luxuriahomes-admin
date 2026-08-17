import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteNoteSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteNoteOrThrow, parseQuoteNoteText } from './shared';

export const update = mutation({
	args: {
		noteId: v.id('quoteNotes'),
		text: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteNoteOrThrow(ctx, args.noteId);
		const text = parseQuoteNoteText(args.text);
		await ctx.db.patch(args.noteId, {
			text,
			searchText: buildQuoteNoteSearchText(text),
		});
		return args.noteId;
	},
});
