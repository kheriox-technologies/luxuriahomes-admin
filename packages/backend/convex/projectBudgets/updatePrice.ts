import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { parseItemPrice } from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const updatePrice = mutation({
	args: {
		projectBudgetId: v.id('projectBudgets'),
		price: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.projectBudgetId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project budget not found',
			});
		}
		const price = parseItemPrice(args.price);
		await ctx.db.patch(args.projectBudgetId, { price });
		return args.projectBudgetId;
	},
});
