import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';

export const removeTransaction = mutation({
	args: { transactionId: v.id('investmentTransactions') },
	handler: async (ctx, { transactionId }) => {
		await requireSuperAdmin(ctx);
		const existing = await ctx.db.get(transactionId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Transaction not found',
			});
		}
		await ctx.db.delete(transactionId);
	},
});
