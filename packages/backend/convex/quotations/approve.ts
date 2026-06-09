import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuotationOrThrow } from './shared';

export const approve = mutation({
	args: {
		quotationId: v.id('quotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const quotation = await getQuotationOrThrow(ctx, args.quotationId);

		await ctx.db.patch(args.quotationId, { status: 'Approved' });

		const siblings = await ctx.db
			.query('quotations')
			.withIndex('by_project_and_trade', (q) =>
				q.eq('projectId', quotation.projectId).eq('tradeId', quotation.tradeId)
			)
			.collect();

		for (const sibling of siblings) {
			if (sibling._id !== args.quotationId) {
				await ctx.db.patch(sibling._id, { status: 'Rejected' });
			}
		}

		return args.quotationId;
	},
});
