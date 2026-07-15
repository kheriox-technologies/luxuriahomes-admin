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
		const projects = await ctx.db
			.query('projects')
			.withSearchIndex('search_projects', (q) =>
				q.search('searchText', trimmed)
			)
			.take(limit);

		const [budgets, trades] = await Promise.all([
			ctx.db.query('projectBudgets').collect(),
			ctx.db.query('trades').collect(),
		]);

		// Mirror the Budgets tab total: only count budget rows whose trade still
		// exists, so orphaned rows left by a deleted trade don't inflate the total.
		const existingTradeIds = new Set(trades.map((trade) => trade._id));
		const budgetTotalByProject = new Map<string, number>();
		for (const budget of budgets) {
			if (!existingTradeIds.has(budget.tradeId)) {
				continue;
			}
			const current = budgetTotalByProject.get(budget.projectId) ?? 0;
			budgetTotalByProject.set(budget.projectId, current + (budget.price ?? 0));
		}

		return projects.map((project) => ({
			...project,
			budgetTotal: budgetTotalByProject.get(project._id) ?? 0,
		}));
	},
});
