import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { requireQuotationClient } from './shared';

/** Notes on one quotation, newest first. Clients see the whole thread. */
export const listNotes = query({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireQuotationClient(ctx, args.quotationId);
		const rows = await ctx.db
			.query('clientQuotationNotes')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
