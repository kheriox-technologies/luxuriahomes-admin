import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Admin-only list of contact-form enquiries, newest first.
 */
export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('leads')
			.withIndex('by_createdAt')
			.order('desc')
			.collect();
	},
});
