import { internalMutation } from '../_generated/server';

/**
 * One-time cleanup: delete projectBudgets rows that reference a project or trade
 * that no longer exists. Such orphans inflate a project's budget total on the
 * projects list relative to the Budgets tab (which ignores rows whose trade is
 * gone). New deletes are cascaded by trades/remove.ts and projects/remove.ts, so
 * this only needs running once to clean up historical data.
 *
 * Run with: npx convex run projectBudgets/purgeOrphaned:purgeOrphaned
 */
export const purgeOrphaned = internalMutation({
	args: {},
	handler: async (ctx) => {
		const [budgets, projects, trades] = await Promise.all([
			ctx.db.query('projectBudgets').collect(),
			ctx.db.query('projects').collect(),
			ctx.db.query('trades').collect(),
		]);

		const existingProjectIds = new Set(projects.map((project) => project._id));
		const existingTradeIds = new Set(trades.map((trade) => trade._id));

		let deleted = 0;
		for (const budget of budgets) {
			if (
				existingProjectIds.has(budget.projectId) &&
				existingTradeIds.has(budget.tradeId)
			) {
				continue;
			}
			await ctx.db.delete(budget._id);
			deleted += 1;
		}

		return { scanned: budgets.length, deleted };
	},
});
