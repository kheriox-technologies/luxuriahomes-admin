import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	buildQuotationSnapshotPatch,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	initialVersionFrom,
	insertQuotationVersion,
	parseVersionDescription,
	quotationSnapshotArgs,
	REOPENED_VERSION_DESCRIPTION,
	REVIEW_QUOTATION_STATUS,
	requiresReapproval,
} from './shared';

/**
 * Saves a revision of an issued quotation as the next version.
 *
 * The row always holds the latest snapshot; the previous version's figures are
 * not kept, but its PDF is — every version has its own document, and the history
 * row records who changed it, when and why. The reference, the original issue
 * date and `createdBy`/`createdAt` are never touched: a revision is the same
 * quotation, not a new one.
 *
 * A quotation the clients had already approved, or that had moved on to
 * signatures, goes back to Under Review: they agreed to figures this version
 * replaces, so the revision has to be approved on its own terms.
 */
export const update = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
		versionDescription: v.string(),
		...quotationSnapshotArgs,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getClientQuotationOrThrow(ctx, args.quotationId);

		const versionDescription = parseVersionDescription(args.versionDescription);
		const snapshot = buildQuotationSnapshotPatch(args, existing.reference);

		const savedBy = identity.name ?? identity.email ?? 'Unknown';
		const savedAt = Date.now();

		// Quotations issued before versioning existed have no history rows, so the
		// document they were issued with would otherwise vanish from the trail.
		// Backfilling here beats a migration — it only runs on first edit.
		const history = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation', (q) => q.eq('quotationId', args.quotationId))
			.collect();
		if (history.length === 0) {
			await insertQuotationVersion(ctx, {
				quotationId: args.quotationId,
				...initialVersionFrom(existing),
			});
		}

		const latestVersion = history.reduce(
			(highest, row) => Math.max(highest, row.version),
			existing.version ?? FIRST_VERSION
		);
		const nextVersion = latestVersion + 1;
		const reopened = requiresReapproval(existing.status);

		await ctx.db.patch(args.quotationId, {
			...snapshot,
			version: nextVersion,
			updatedAt: savedAt,
			updatedBy: savedBy,
			...(reopened ? { status: REVIEW_QUOTATION_STATUS } : {}),
		});

		await insertQuotationVersion(ctx, {
			quotationId: args.quotationId,
			version: nextVersion,
			description: versionDescription,
			updatedBy: savedBy,
			updatedAt: savedAt,
			totalInclGst: args.totalInclGst,
			documentId: args.documentId,
			s3Key: args.s3Key,
			fileName: args.fileName,
			folderPath: args.folderPath,
		});

		// Recorded against the new version rather than through
		// `recordQuotationStatusEvent`, which reads the version off the row as it
		// was before this revision was written.
		if (reopened) {
			await insertQuotationVersion(ctx, {
				quotationId: args.quotationId,
				version: nextVersion,
				changeType: 'Status',
				description: REOPENED_VERSION_DESCRIPTION,
				updatedBy: savedBy,
				updatedAt: savedAt,
				totalInclGst: args.totalInclGst,
			});
		}

		return { reopened, version: nextVersion };
	},
});
