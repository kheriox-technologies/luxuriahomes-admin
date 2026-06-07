import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const search = query({
	args: {
		query: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		if (args.query.trim().length === 0) {
			throw new ConvexError({
				code: 'INVALID_QUERY',
				message: 'Search query is required',
			});
		}
		return await ctx.db
			.query('stages')
			.withSearchIndex('search_stages', (q) =>
				q.search('searchText', args.query)
			)
			.take(args.limit ?? 100);
	},
});
