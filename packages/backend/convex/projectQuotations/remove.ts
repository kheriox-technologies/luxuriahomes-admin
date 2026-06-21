import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuotationOrThrow } from './shared';

export const remove = mutation({
	args: {
		quotationId: v.id('projectQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuotationOrThrow(ctx, args.quotationId);
		await ctx.db.delete(args.quotationId);
	},
});
