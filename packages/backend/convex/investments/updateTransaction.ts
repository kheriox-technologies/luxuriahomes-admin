import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import {
	assertPositiveAmount,
	investmentCategoryValidator,
	investmentTransactionKindValidator,
} from './shared';

export const updateTransaction = mutation({
	args: {
		transactionId: v.id('investmentTransactions'),
		kind: investmentTransactionKindValidator,
		date: v.number(),
		description: v.string(),
		category: investmentCategoryValidator,
		amount: v.number(),
		notes: v.optional(v.string()),
	},
	handler: async (ctx, { transactionId, ...fields }) => {
		await requireSuperAdmin(ctx);
		assertPositiveAmount(fields.amount);
		const existing = await ctx.db.get(transactionId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Transaction not found',
			});
		}
		await ctx.db.patch(transactionId, fields);
	},
});
