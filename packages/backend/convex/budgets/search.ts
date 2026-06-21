import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { withTradeNames } from './withTradeNames';

export const search = query({
	args: {
		query: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const trimmed = args.query.trim();
		if (trimmed.length === 0) {
			throw new ConvexError({
				code: 'INVALID_QUERY',
				message: 'Search query cannot be empty',
			});
		}
		const limit = args.limit ?? 100;
		const rows = await ctx.db
			.query('budgets')
			.withSearchIndex('search_budgets', (q) => q.search('searchText', trimmed))
			.take(limit);
		return await withTradeNames(ctx, rows);
	},
});
