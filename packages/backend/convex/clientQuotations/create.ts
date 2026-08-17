import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	buildQuotationSnapshotPatch,
	FIRST_VERSION,
	INITIAL_QUOTATION_STATUS,
	INITIAL_VERSION_DESCRIPTION,
	insertQuotationVersion,
	quotationSnapshotArgs,
} from './shared';

export const create = mutation({
	args: {
		reference: v.string(),
		issuedAt: v.number(),
		...quotationSnapshotArgs,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);

		const snapshot = buildQuotationSnapshotPatch(args, args.reference);

		const existing = await ctx.db
			.query('clientQuotations')
			.withIndex('by_reference', (q) => q.eq('reference', args.reference))
			.first();
		if (existing) {
			throw new ConvexError({
				code: 'DUPLICATE_REFERENCE',
				message: `Quotation ${args.reference} already exists`,
			});
		}

		const savedBy = identity.name ?? identity.email ?? 'Unknown';
		const savedAt = Date.now();

		const quotationId = await ctx.db.insert('clientQuotations', {
			...snapshot,
			reference: args.reference,
			issuedAt: args.issuedAt,
			status: INITIAL_QUOTATION_STATUS,
			createdBy: savedBy,
			createdAt: savedAt,
			version: FIRST_VERSION,
			updatedAt: savedAt,
			updatedBy: savedBy,
		});

		await insertQuotationVersion(ctx, {
			quotationId,
			version: FIRST_VERSION,
			description: INITIAL_VERSION_DESCRIPTION,
			updatedBy: savedBy,
			updatedAt: savedAt,
			totalInclGst: args.totalInclGst,
			documentId: args.documentId,
			s3Key: args.s3Key,
			fileName: args.fileName,
			folderPath: args.folderPath,
		});

		return quotationId;
	},
});
