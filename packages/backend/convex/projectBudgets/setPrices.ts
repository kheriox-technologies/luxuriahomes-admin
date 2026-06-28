import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { parseItemPrice } from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const setPrices = mutation({
	args: {
		projectId: v.id('projects'),
		items: v.array(
			v.object({
				tradeId: v.id('trades'),
				price: v.number(),
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

		// Upsert each trade price, overwriting an existing budget for that trade.
		for (const item of args.items) {
			const price = parseItemPrice(item.price);
			const existing = await ctx.db
				.query('projectBudgets')
				.withIndex('by_project_and_trade', (q) =>
					q.eq('projectId', args.projectId).eq('tradeId', item.tradeId)
				)
				.first();
			if (existing) {
				await ctx.db.patch(existing._id, { price });
			} else {
				await ctx.db.insert('projectBudgets', {
					projectId: args.projectId,
					tradeId: item.tradeId,
					price,
				});
			}
		}

		return args.projectId;
	},
});
