import { v } from 'convex/values';
import { query } from '../../_generated/server';
import { readQuotationVersions } from '../../clientQuotations/shared';
import { requireQuotationClient } from './shared';

/** The history of one quotation the caller is a client on, newest first. */
export const listVersions = query({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		const { quotation } = await requireQuotationClient(ctx, args.quotationId);
		return await readQuotationVersions(ctx, quotation);
	},
});
