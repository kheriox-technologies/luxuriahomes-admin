import { internalMutation } from '../_generated/server';

/**
 * One-off migration: clears the deprecated `payments` field on every
 * projectBudgets doc so the field can be removed from the schema without
 * tripping Convex document validation. Run once from the Convex dashboard
 * (`internal.projectBudgets.clearPayments.clearPayments`) between the two
 * deploys, then delete this file. See docs/xero-chart-of-accounts-trades.md.
 */
export const clearPayments = internalMutation({
	args: {},
	handler: async (ctx) => {
		const budgets = await ctx.db.query('projectBudgets').collect();
		let cleared = 0;
		for (const budget of budgets) {
			if (budget.payments !== undefined) {
				await ctx.db.patch(budget._id, { payments: undefined });
				cleared++;
			}
		}
		return { cleared, total: budgets.length };
	},
});
