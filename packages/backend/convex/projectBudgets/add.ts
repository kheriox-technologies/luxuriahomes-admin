import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { getBudgetOrThrow } from '../budgets/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		budgetId: v.id('budgets'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}

		const budget = await getBudgetOrThrow(ctx, args.budgetId);

		const existing = await ctx.db
			.query('projectBudgets')
			.withIndex('by_project_and_trade', (q) =>
				q.eq('projectId', args.projectId).eq('tradeId', budget.tradeId)
			)
			.first();
		if (existing) {
			throw new ConvexError({
				code: 'CONFLICT',
				message:
					'A budget item is already assigned for this trade on the selected project.',
			});
		}

		return await ctx.db.insert('projectBudgets', {
			projectId: args.projectId,
			budgetId: args.budgetId,
			tradeId: budget.tradeId,
		});
	},
});
