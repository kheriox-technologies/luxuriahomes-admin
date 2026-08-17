import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { withNoteCounts } from './shared';

/**
 * Every quotation, newest first. Volume is a few dozen a year, so a single
 * collect beats pagination here.
 */
export const list = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const rows = await ctx.db
			.query('clientQuotations')
			.withIndex('by_created')
			.order('desc')
			.collect();
		return await withNoteCounts(ctx, rows);
	},
});
