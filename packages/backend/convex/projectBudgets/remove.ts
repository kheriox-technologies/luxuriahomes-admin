import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = mutation({
	args: {
		projectBudgetId: v.id('projectBudgets'),
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
		await ctx.db.delete(args.projectBudgetId);
		return args.projectBudgetId;
	},
});
