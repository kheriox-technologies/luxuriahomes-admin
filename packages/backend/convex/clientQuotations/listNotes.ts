import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClientQuotationOrThrow } from './shared';

/** Notes for one quotation, newest first. */
export const listNotes = query({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getClientQuotationOrThrow(ctx, args.quotationId);
		const rows = await ctx.db
			.query('clientQuotationNotes')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
