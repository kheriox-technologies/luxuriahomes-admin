import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteExclusionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteExclusionOrThrow, parseQuoteExclusionText } from './shared';

export const update = mutation({
	args: {
		exclusionId: v.id('quoteExclusions'),
		text: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteExclusionOrThrow(ctx, args.exclusionId);
		const text = parseQuoteExclusionText(args.text);
		await ctx.db.patch(args.exclusionId, {
			text,
			searchText: buildQuoteExclusionSearchText(text),
		});
		return args.exclusionId;
	},
});
