import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildClientQuotationSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { australianAddressValidator } from '../projects/shared';
import {
	assertAustralianPostcode,
	assertPositiveTotal,
	assertStagePercentsTotal,
	FIRST_VERSION,
	getClientQuotationOrThrow,
	initialVersionFrom,
	insertQuotationVersion,
	parseQuotationClients,
	parseValidityDays,
	parseVersionDescription,
	quotationClientValidator,
	quotationEntrySnapshotValidator,
	quotationStageSnapshotValidator,
	quotationTermsSnapshotValidator,
	splitGst,
} from './shared';

/**
 * Saves a revision of an issued quotation as the next version.
 *
 * The row always holds the latest snapshot; the previous version's figures are
 * not kept, but its PDF is — every version has its own document, and the history
 * row records who changed it, when and why. The reference, the original issue
 * date and `createdBy`/`createdAt` are never touched: a revision is the same
 * quotation, not a new one.
 */
export const update = mutation({
	args: {
		quotationId: v.id('clientQuotations'),
		versionDescription: v.string(),
		projectName: v.string(),
		description: v.optional(v.string()),
		clients: v.array(quotationClientValidator),
		address: australianAddressValidator,
		validityDays: v.number(),
		budgetTemplateId: v.optional(v.id('budgetTemplates')),
		budgetTemplateTitle: v.optional(v.string()),
		budgetTemplateTotal: v.optional(v.number()),
		marginPercent: v.optional(v.number()),
		totalInclGst: v.number(),
		stages: v.array(quotationStageSnapshotValidator),
		terms: quotationTermsSnapshotValidator,
		exclusions: v.array(quotationEntrySnapshotValidator),
		notes: v.array(quotationEntrySnapshotValidator),
		documentId: v.optional(v.id('companyDocuments')),
		s3Key: v.optional(v.string()),
		fileName: v.optional(v.string()),
		folderPath: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		const existing = await getClientQuotationOrThrow(ctx, args.quotationId);

		const projectName = args.projectName.trim();
		if (projectName.length === 0) {
			throw new ConvexError({
				code: 'INVALID_NAME',
				message: 'Project name is required',
			});
		}

		const versionDescription = parseVersionDescription(args.versionDescription);
		const clients = parseQuotationClients(args.clients);
		assertAustralianPostcode(args.address.postcode);
		assertPositiveTotal(args.totalInclGst);
		assertStagePercentsTotal(args.stages);
		const validityDays = parseValidityDays(args.validityDays);

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

		// Derived server-side rather than trusted from the client, so the stored
		// figures always agree with the total that was quoted.
		const { contractSumExclGst, gstAmount } = splitGst(args.totalInclGst);

		await ctx.db.patch(args.quotationId, {
			projectName,
			description: args.description?.trim() || undefined,
			clients,
			address: args.address,
			validityDays,
			budgetTemplateId: args.budgetTemplateId,
			budgetTemplateTitle: args.budgetTemplateTitle,
			budgetTemplateTotal: args.budgetTemplateTotal,
			marginPercent: args.marginPercent,
			totalInclGst: args.totalInclGst,
			contractSumExclGst,
			gstAmount,
			stages: args.stages,
			terms: args.terms,
			exclusions: args.exclusions,
			notes: args.notes,
			documentId: args.documentId,
			s3Key: args.s3Key,
			fileName: args.fileName,
			folderPath: args.folderPath,
			version: nextVersion,
			updatedAt: savedAt,
			updatedBy: savedBy,
			searchText: buildClientQuotationSearchText({
				address: args.address,
				clients,
				projectName,
				reference: existing.reference,
			}),
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

		return { version: nextVersion };
	},
});
