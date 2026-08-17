import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClientQuotationOrThrow, initialVersionFrom } from './shared';

/**
 * The revision history of one quotation, newest version first.
 *
 * Rows issued before versioning existed have no history, so a version-1 row is
 * synthesised from the quotation itself — the UI never has to special-case
 * legacy data, and `update` writes the same row when it backfills.
 */
export const listVersions = query({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const quotation = await getClientQuotationOrThrow(ctx, args.quotationId);

		const rows = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();

		const versions =
			rows.length === 0
				? [initialVersionFrom(quotation)]
				: rows.map((row) => ({
						description: row.description,
						documentId: row.documentId,
						fileName: row.fileName,
						folderPath: row.folderPath,
						s3Key: row.s3Key,
						totalInclGst: row.totalInclGst,
						updatedAt: row.updatedAt,
						updatedBy: row.updatedBy,
						version: row.version,
					}));

		return versions.sort((a, b) => b.version - a.version);
	},
});
