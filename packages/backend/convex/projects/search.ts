import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { budgetTotalsByProject } from './shared';

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

		const budgetTotalByProject = budgetTotalsByProject(budgets, trades);

		return projects.map((project) => ({
			...project,
			budgetTotal: budgetTotalByProject.get(project._id) ?? 0,
		}));
	},
});
