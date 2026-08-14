import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { budgetTotalsByProject } from './shared';

export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const [projects, budgets, trades] = await Promise.all([
			ctx.db.query('projects').order('desc').collect(),
			ctx.db.query('projectBudgets').collect(),
			ctx.db.query('trades').collect(),
		]);

		const budgetTotalByProject = budgetTotalsByProject(budgets, trades);

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
