import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteTermItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteTermSectionOrThrow } from '../quoteTermSections/shared';
import { nextQuoteTermItemOrder, parseQuoteTermItemText } from './shared';

export const add = mutation({
	args: {
		text: v.string(),
		sectionId: v.id('quoteTermSections'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const section = await getQuoteTermSectionOrThrow(ctx, args.sectionId);
		const text = parseQuoteTermItemText(args.text);
		return await ctx.db.insert('quoteTermItems', {
			text,
			sectionId: args.sectionId,
			order: await nextQuoteTermItemOrder(ctx, args.sectionId),
			searchText: buildQuoteTermItemSearchText(text, section.name),
		});
	},
});
