import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { buildTradeStageSearchText } from '../lib/buildSearchText';

export function parseStageName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Stage name is required',
		});
	}
	return trimmed;
}

export async function getStageOrThrow(
	ctx: MutationCtx,
	stageId: Id<'tradeStages'>
) {
	const stage = await ctx.db.get(stageId);
	if (!stage) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Trade stage not found',
		});
	}
	return stage;
}

/**
 * Next sort position for a new stage, appended after existing stages.
 */
export async function nextStageOrder(ctx: MutationCtx): Promise<number> {
	const stages = await ctx.db.query('tradeStages').collect();
	return stages.length;
}

/**
 * Inserts a stage from a raw name with computed order + searchText. Shared by the
 * stage dialog and the inline create-trade flows (budget items, etc.).
 */
export async function createTradeStage(
	ctx: MutationCtx,
	rawName: string
): Promise<Id<'tradeStages'>> {
	const name = parseStageName(rawName);
	const searchText = buildTradeStageSearchText(name);
	const order = await nextStageOrder(ctx);
	return await ctx.db.insert('tradeStages', { name, order, searchText });
}
