import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildQuoteStageSearchText } from '../lib/buildSearchText';

export function parseQuoteStageName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Stage name is required',
		});
	}
	return trimmed;
}

export async function getQuoteStageOrThrow(
	ctx: QueryCtx,
	stageId: Id<'quoteStages'>
) {
	const stage = await ctx.db.get(stageId);
	if (!stage) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quote stage not found',
		});
	}
	return stage;
}

/**
 * Next sort position for a new stage, appended after existing stages.
 */
export async function nextQuoteStageOrder(ctx: MutationCtx): Promise<number> {
	const stages = await ctx.db.query('quoteStages').collect();
	return stages.length;
}

/**
 * Inserts a stage from a raw name with computed order + searchText. Shared by the
 * stage dialog and the inline "or create new stage" flow on the item form.
 */
export async function createQuoteStage(
	ctx: MutationCtx,
	rawName: string
): Promise<Id<'quoteStages'>> {
	const name = parseQuoteStageName(rawName);
	const searchText = buildQuoteStageSearchText(name);
	const order = await nextQuoteStageOrder(ctx);
	return await ctx.db.insert('quoteStages', { name, order, searchText });
}
