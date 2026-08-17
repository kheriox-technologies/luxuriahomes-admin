import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClientQuotationOrThrow } from './shared';

/**
 * Deletes the quotation record and its revision history. The generated PDFs live
 * in company documents and are removed separately via `companyDocuments.remove`
 * (an action, because it also deletes the S3 object) — the delete dialog calls
 * that for every version first when the user asks for the files to go too.
 */
export const remove = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getClientQuotationOrThrow(ctx, args.quotationId);

		const versions = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();
		for (const version of versions) {
			await ctx.db.delete(version._id);
		}

		await ctx.db.delete(args.quotationId);
	},
});
