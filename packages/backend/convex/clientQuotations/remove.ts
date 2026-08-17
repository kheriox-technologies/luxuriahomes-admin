import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClientQuotationOrThrow } from './shared';

/**
 * Deletes the quotation record only. The generated PDF lives in company
 * documents and is removed separately via `companyDocuments.remove` (an action,
 * because it also deletes the S3 object) — the delete dialog calls that first
 * when the user asks for the file to go too.
 */
export const remove = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getClientQuotationOrThrow(ctx, args.quotationId);
		await ctx.db.delete(args.quotationId);
	},
});
