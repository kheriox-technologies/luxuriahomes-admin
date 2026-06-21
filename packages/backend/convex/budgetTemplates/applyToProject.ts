import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTemplateOrThrow } from './shared';

export const applyToProject = mutation({
	args: {
		projectId: v.id('projects'),
		budgetTemplateId: v.id('budgetTemplates'),
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

		await getTemplateOrThrow(ctx, args.budgetTemplateId);

		const items = await ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template', (q) =>
				q.eq('budgetTemplateId', args.budgetTemplateId)
			)
			.collect();

		// For each trade price in the template, upsert the project budget,
		// overwriting an existing price for that trade on the project.
		for (const item of items) {
			const existing = await ctx.db
				.query('projectBudgets')
				.withIndex('by_project_and_trade', (q) =>
					q.eq('projectId', args.projectId).eq('tradeId', item.tradeId)
				)
				.first();
			if (existing) {
				await ctx.db.patch(existing._id, { price: item.price });
			} else {
				await ctx.db.insert('projectBudgets', {
					projectId: args.projectId,
					tradeId: item.tradeId,
					price: item.price,
				});
			}
		}

		return args.projectId;
	},
});
