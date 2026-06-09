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

		const projectQuotations = await ctx.db
			.query('quotations')
			.withIndex('by_project', (q) => q.eq('projectId', quotation.projectId))
			.collect();

		const approvedTradeSet = new Set(quotation.tradeIds);
		for (const sibling of projectQuotations) {
			if (
				sibling._id !== args.quotationId &&
				sibling.tradeIds.some((id) => approvedTradeSet.has(id))
			) {
				await ctx.db.patch(sibling._id, { status: 'Rejected' });
			}
		}

		return args.quotationId;
	},
});
