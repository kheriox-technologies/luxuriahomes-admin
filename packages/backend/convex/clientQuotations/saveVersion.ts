import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	buildQuotationSnapshotPatch,
	CLEARED_SIGNED_DOCUMENT,
	DEFAULT_VERSION_CHANGE_TYPE,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	insertQuotationVersion,
	parseVersionDescription,
	quotationSnapshotArgs,
	REVIEW_QUOTATION_STATUS,
	SIGNATURES_VOIDED_DESCRIPTION,
	voidSignaturesForVersion,
} from './shared';

/**
 * Rewrites an existing version of a quotation in place — a correction rather
 * than a revision, so no new version is issued and the history keeps its shape.
 *
 * Only the current version can be edited: a history row carries who changed the
 * quotation and what the total was, not the snapshot behind it, so there is
 * nothing to load an older version back from. `update` is the path for anything
 * that should become a new version.
 */
export const saveVersion = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
		version: v.number(),
		versionDescription: v.string(),
		...quotationSnapshotArgs,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getClientQuotationOrThrow(ctx, args.quotationId);

		const currentVersion = existing.version ?? FIRST_VERSION;
		if (args.version !== currentVersion) {
			throw new ConvexError({
				code: 'VERSION_NOT_EDITABLE',
				message: `Only version ${currentVersion} can be edited`,
			});
		}

		const versionDescription = parseVersionDescription(args.versionDescription);
		const snapshot = buildQuotationSnapshotPatch(args, existing.reference);

		const savedBy = identity.name ?? identity.email ?? 'Unknown';
		const savedAt = Date.now();

		// An amend rewrites the very snapshot that was signed, so anything already
		// collected against this version has to go — a signature has to belong to
		// the document the signer actually read.
		const voided = await voidSignaturesForVersion(
			ctx,
			args.quotationId,
			currentVersion,
			savedAt
		);

		// The version is deliberately left as it was — this rewrites that version.
		await ctx.db.patch(args.quotationId, {
			...snapshot,
			updatedAt: savedAt,
			updatedBy: savedBy,
			...(voided > 0
				? { ...CLEARED_SIGNED_DOCUMENT, status: REVIEW_QUOTATION_STATUS }
				: {}),
		});

		// A version can hold several rows — the revision plus every lifecycle event
		// recorded against it — so the revision is picked out rather than assumed
		// to be the only one.
		const rowsAtVersion = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation_version', (q) =>
				q.eq('quotationId', args.quotationId).eq('version', args.version)
			)
			.collect();
		const versionRow = rowsAtVersion
			.filter(
				(row) => (row.changeType ?? DEFAULT_VERSION_CHANGE_TYPE) === 'Revision'
			)
			.sort((a, b) => b.updatedAt - a.updatedAt)[0];

		const versionFields = {
			description: versionDescription,
			updatedBy: savedBy,
			updatedAt: savedAt,
			totalInclGst: args.totalInclGst,
			documentId: args.documentId,
			s3Key: args.s3Key,
			fileName: args.fileName,
			folderPath: args.folderPath,
		};

		if (versionRow) {
			await ctx.db.patch(versionRow._id, versionFields);
		} else {
			// A quotation issued before versioning existed has no history row yet.
			// Writing it here is the same backfill `update` does on first edit.
			await insertQuotationVersion(ctx, {
				quotationId: args.quotationId,
				version: args.version,
				...versionFields,
			});
		}

		if (voided > 0) {
			await insertQuotationVersion(ctx, {
				quotationId: args.quotationId,
				version: args.version,
				changeType: 'Status',
				description: SIGNATURES_VOIDED_DESCRIPTION,
				updatedBy: savedBy,
				updatedAt: savedAt,
				totalInclGst: args.totalInclGst,
			});
		}

		return { version: args.version, voidedSignatures: voided };
	},
});
