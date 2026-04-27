import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectOrThrow } from './shared';

export const search = query({
	args: {
		projectId: v.id('projects'),
		query: v.string(),
		limit: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectOrThrow(ctx, args.projectId);
		const trimmed = args.query.trim();
		if (trimmed.length === 0) {
			throw new ConvexError({
				code: 'INVALID_QUERY',
				message: 'Search query cannot be empty',
			});
		}
		const limit = args.limit ?? 100;
		return await ctx.db
			.query('projectInclusions')
			.withSearchIndex('search_project_inclusions', (q) =>
				q.search('searchText', trimmed).eq('projectId', args.projectId)
			)
			.take(limit);
	},
});
