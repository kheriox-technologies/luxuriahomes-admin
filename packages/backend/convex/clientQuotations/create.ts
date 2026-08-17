import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildClientQuotationSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { australianAddressValidator } from '../projects/shared';
import {
	assertAustralianPostcode,
	assertPositiveTotal,
	assertStagePercentsTotal,
	parseQuotationClients,
	parseValidityDays,
	quotationClientValidator,
	quotationEntrySnapshotValidator,
	quotationStageSnapshotValidator,
	quotationTermsSnapshotValidator,
	splitGst,
} from './shared';

export const create = mutation({
	args: {
		reference: v.string(),
		projectName: v.string(),
		description: v.optional(v.string()),
		clients: v.array(quotationClientValidator),
		address: australianAddressValidator,
		issuedAt: v.number(),
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

		const projectName = args.projectName.trim();
		if (projectName.length === 0) {
			throw new ConvexError({
				code: 'INVALID_NAME',
				message: 'Project name is required',
			});
		}

		const clients = parseQuotationClients(args.clients);
		assertAustralianPostcode(args.address.postcode);
		assertPositiveTotal(args.totalInclGst);
		assertStagePercentsTotal(args.stages);
		const validityDays = parseValidityDays(args.validityDays);

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

		// Derived server-side rather than trusted from the client, so the stored
		// figures always agree with the total that was quoted.
		const { contractSumExclGst, gstAmount } = splitGst(args.totalInclGst);

		return await ctx.db.insert('clientQuotations', {
			reference: args.reference,
			projectName,
			description: args.description?.trim() || undefined,
			clients,
			address: args.address,
			issuedAt: args.issuedAt,
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
			createdBy: identity.name ?? identity.email ?? 'Unknown',
			createdAt: Date.now(),
			searchText: buildClientQuotationSearchText({
				address: args.address,
				clients,
				projectName,
				reference: args.reference,
			}),
		});
	},
});
