import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClientQuotationOrThrow, readQuotationVersions } from './shared';

/**
 * The history of one quotation, newest first — its revisions plus the lifecycle
 * events recorded against them.
 */
export const listVersions = query({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);
		return await readQuotationVersions(ctx, quotation);
	},
});
