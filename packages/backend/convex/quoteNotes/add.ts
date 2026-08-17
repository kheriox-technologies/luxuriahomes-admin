import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteNoteSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { nextQuoteNoteOrder, parseQuoteNoteText } from './shared';

export const add = mutation({
	args: {
		text: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const text = parseQuoteNoteText(args.text);
		return await ctx.db.insert('quoteNotes', {
			text,
			order: await nextQuoteNoteOrder(ctx),
			searchText: buildQuoteNoteSearchText(text),
		});
	},
});
