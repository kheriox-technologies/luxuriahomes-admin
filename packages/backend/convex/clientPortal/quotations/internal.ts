import { v } from 'convex/values';
import { internalQuery } from '../../_generated/server';
import { requireQuotationClient } from './shared';

/**
 * Every S3 key the caller may open for one quotation: the current PDF plus the
 * PDF issued for each version. `signUrl` runs in Node and cannot read the
 * database itself, so it authorizes against this list.
 */
export const listSignableKeys = internalQuery({
	args: { quotationId: v.id('clientQuotations') },
	handler: async (ctx, args): Promise<string[]> => {
		const { quotation } = await requireQuotationClient(ctx, args.quotationId);

		const versions = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();

		const keys = new Set<string>();
		if (quotation.s3Key) {
			keys.add(quotation.s3Key);
		}
		for (const version of versions) {
			if (version.s3Key) {
				keys.add(version.s3Key);
			}
		}
		return [...keys];
	},
});
