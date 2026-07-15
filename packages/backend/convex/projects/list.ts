import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const [projects, budgets, trades] = await Promise.all([
			ctx.db.query('projects').order('desc').collect(),
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

		return projects
			.map((project) => ({
				...project,
				budgetTotal: budgetTotalByProject.get(project._id) ?? 0,
			}))
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
	},
});
