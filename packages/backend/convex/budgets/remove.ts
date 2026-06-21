import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getBudgetOrThrow } from './shared';

export const remove = mutation({
	args: {
		budgetId: v.id('budgets'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getBudgetOrThrow(ctx, args.budgetId);
		await ctx.db.delete(args.budgetId);
		return args.budgetId;
	},
});
