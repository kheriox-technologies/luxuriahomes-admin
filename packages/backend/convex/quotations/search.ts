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
		const trimmed = args.query.trim();
		if (trimmed.length === 0) {
			throw new ConvexError({
				code: 'INVALID_QUERY',
				message: 'Search query cannot be empty',
			});
		}
		const limit = args.limit ?? 100;
		const rows = await ctx.db
			.query('quotations')
			.withSearchIndex('search_quotations', (q) =>
				q.search('searchText', trimmed)
			)
			.take(limit);
		return Promise.all(
			rows.map(async (row) => {
				const [trades, project, serviceProvider, notes] = await Promise.all([
					Promise.all(row.tradeIds.map((id) => ctx.db.get(id))),
					ctx.db.get(row.projectId),
					ctx.db.get(row.serviceProviderId),
					ctx.db
						.query('quotationNotes')
						.withIndex('by_quotation', (q) => q.eq('quotationId', row._id))
						.collect(),
				]);
				return {
					...row,
					tradeNames: trades.map((t) => t?.name ?? '').filter(Boolean),
					projectName: project?.name ?? '',
					companyName: serviceProvider?.company ?? '',
					noteCount: notes.length,
				};
			})
		);
	},
});
