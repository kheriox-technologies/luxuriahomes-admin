import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	parseContingencyPercent,
	parseItemPrice,
} from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const setPrices = mutation({
	args: {
		projectId: v.id('projects'),
		items: v.array(
			v.object({
				tradeId: v.id('trades'),
				price: v.optional(v.number()),
				contingencyPercent: v.optional(v.number()),
			})
		),
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

		// Upsert the budget price/contingency per trade, skipping items with
		// nothing to set.
		for (const item of args.items) {
			if (item.price === undefined && item.contingencyPercent === undefined) {
				continue;
			}
			const fields: { price?: number; contingencyPercent?: number } = {};
			if (item.price !== undefined) {
				fields.price = parseItemPrice(item.price);
			}
			if (item.contingencyPercent !== undefined) {
				fields.contingencyPercent = parseContingencyPercent(
					item.contingencyPercent
				);
			}
			const existing = await ctx.db
				.query('projectBudgets')
				.withIndex('by_project_and_trade', (q) =>
					q.eq('projectId', args.projectId).eq('tradeId', item.tradeId)
				)
				.first();
			if (existing) {
				await ctx.db.patch(existing._id, fields);
			} else {
				await ctx.db.insert('projectBudgets', {
					projectId: args.projectId,
					tradeId: item.tradeId,
					...fields,
				});
			}
		}

		return args.projectId;
	},
});
