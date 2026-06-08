import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildSearchText } from '../lib/buildSearchText';

type ReadCtx = MutationCtx | QueryCtx;

export function buildQuotationSearchText(
	tradeName: string,
	projectName: string,
	companyName: string
): string {
	return buildSearchText([tradeName, projectName, companyName]);
}

export async function getQuotationOrThrow(
	ctx: ReadCtx,
	quotationId: Id<'quotations'>
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
