import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteExclusionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { nextQuoteExclusionOrder, parseQuoteExclusionText } from './shared';

export const add = mutation({
	args: {
		text: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const text = parseQuoteExclusionText(args.text);
		return await ctx.db.insert('quoteExclusions', {
			text,
			order: await nextQuoteExclusionOrder(ctx),
			searchText: buildQuoteExclusionSearchText(text),
		});
	},
});
