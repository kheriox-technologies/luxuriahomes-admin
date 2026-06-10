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
		await getQuotationOrThrow(ctx, args.quotationId);

		await ctx.db.patch(args.quotationId, { status: 'Approved' });

		return args.quotationId;
	},
});
