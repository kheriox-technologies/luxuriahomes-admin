import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/** The whole standard list in order. Small enough to load in one go. */
export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('quotationSpecialInclusions')
			.withIndex('by_order')
			.order('asc')
			.collect();
	},
});
