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
				price: v.optional(v.number()),
				payments: v.optional(v.number()),
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

		// Upsert budget/payments per trade, overwriting only the provided fields.
		for (const item of args.items) {
			const fields: { price?: number; payments?: number } = {};
			if (item.price !== undefined) {
				fields.price = parseItemPrice(item.price);
			}
			if (item.payments !== undefined) {
				fields.payments = parseItemPrice(item.payments);
			}
			if (fields.price === undefined && fields.payments === undefined) {
				continue;
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
