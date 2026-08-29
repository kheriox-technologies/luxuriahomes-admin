import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';

/** All ledger rows for an investment, oldest first. */
export const listTransactions = query({
	args: { investmentId: v.id('investments') },
	handler: async (ctx, { investmentId }) => {
		await requireSuperAdmin(ctx);
		return await ctx.db
			.query('investmentTransactions')
			.withIndex('by_investment_date', (q) =>
				q.eq('investmentId', investmentId)
			)
			.order('asc')
			.collect();
	},
});
