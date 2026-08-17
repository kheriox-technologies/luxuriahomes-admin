import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/** Every note in print order. The list is small, so it loads in one go. */
export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('quoteNotes')
			.withIndex('by_order')
			.order('asc')
			.collect();
	},
});
