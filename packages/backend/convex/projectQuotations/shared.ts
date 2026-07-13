import { ConvexError } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildSearchText } from '../lib/buildSearchText';

type ReadCtx = MutationCtx | QueryCtx;

type QuotationStatus = Doc<'projectQuotations'>['status'];

// Validates the referenced records, computes searchText, and inserts a
// quotation. Shared by the admin `add` mutation (after requireAdmin) and the
// Gmail add-on ingestion path (which authenticates via API key instead).
export async function insertProjectQuotation(
	ctx: MutationCtx,
	args: {
		projectId: Id<'projects'>;
		title: string;
		tradeId: Id<'trades'>;
		serviceProviderId: Id<'serviceProviders'>;
		price: number;
		status: QuotationStatus;
		s3Key?: string;
	}
): Promise<Id<'projectQuotations'>> {
	const title = args.title.trim();
	if (title.length === 0) {
		throw new ConvexError({
			code: 'INVALID_QUERY',
			message: 'Title is required',
		});
	}

	const [trade, project, serviceProvider] = await Promise.all([
		ctx.db.get(args.tradeId),
		ctx.db.get(args.projectId),
		ctx.db.get(args.serviceProviderId),
	]);

	if (!trade) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Trade not found',
		});
	}
	if (!project) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Project not found',
		});
	}
	if (!serviceProvider) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Service provider not found',
		});
	}

	const searchText = buildQuotationSearchText(
		title,
		trade.name,
		project.name,
		serviceProvider.company
	);

	return await ctx.db.insert('projectQuotations', {
		projectId: args.projectId,
		title,
		tradeId: args.tradeId,
		serviceProviderId: args.serviceProviderId,
		s3Key: args.s3Key,
		price: args.price,
		status: args.status,
		searchText,
	});
}

export function buildQuotationSearchText(
	title: string,
	tradeName: string,
	projectName: string,
	companyName: string
): string {
	return buildSearchText([title, tradeName, projectName, companyName]);
}

export async function getQuotationOrThrow(
	ctx: ReadCtx,
	quotationId: Id<'projectQuotations'>
) {
	const row = await ctx.db.get(quotationId);
	if (!row) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quotation not found',
		});
	}
	return row;
}

export async function syncQuotationSearchText(
	ctx: MutationCtx,
	quotationId: Id<'projectQuotations'>
) {
	const quotation = await ctx.db.get(quotationId);
	if (!quotation) {
		return;
	}
	const [trade, project, serviceProvider] = await Promise.all([
		ctx.db.get(quotation.tradeId),
		ctx.db.get(quotation.projectId),
		ctx.db.get(quotation.serviceProviderId),
	]);
	const searchText = buildQuotationSearchText(
		quotation.title,
		trade?.name ?? '',
		project?.name ?? '',
		serviceProvider?.company ?? ''
	);
	await ctx.db.patch(quotationId, { searchText });
}
