import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import {
	buildQuotationSnapshotPatch,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	insertQuotationVersion,
	parseVersionDescription,
	quotationSnapshotArgs,
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

		// The version is deliberately left as it was — this rewrites that version.
		await ctx.db.patch(args.quotationId, {
			...snapshot,
			updatedAt: savedAt,
			updatedBy: savedBy,
		});

		const versionRow = await ctx.db
			.query('clientQuotationVersions')
			.withIndex('by_quotation_version', (q) =>
				q.eq('quotationId', args.quotationId).eq('version', args.version)
			)
			.unique();

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

		return { version: args.version };
	},
});
