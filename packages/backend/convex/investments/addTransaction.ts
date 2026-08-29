import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import {
	assertPositiveAmount,
	investmentCategoryValidator,
	investmentTransactionKindValidator,
} from './shared';

export const addTransaction = mutation({
	args: {
		investmentId: v.id('investments'),
		kind: investmentTransactionKindValidator,
		date: v.number(),
		description: v.string(),
		category: investmentCategoryValidator,
		amount: v.number(),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireSuperAdmin(ctx);
		assertPositiveAmount(args.amount);
		const investment = await ctx.db.get(args.investmentId);
		if (!investment) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Investment not found',
			});
		}
		return await ctx.db.insert('investmentTransactions', args);
	},
});
