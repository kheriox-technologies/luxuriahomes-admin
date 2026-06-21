import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuotationOrThrow } from './shared';

export const listNotes = query({
	args: {
		quotationId: v.id('projectQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuotationOrThrow(ctx, args.quotationId);
		const rows = await ctx.db
			.query('projectQuotationNotes')
			.withIndex('by_project_quotation', (q) =>
				q.eq('projectQuotationId', args.quotationId)
			)
			.collect();
		return rows.sort((a, b) => b.timestamp - a.timestamp);
	},
});
