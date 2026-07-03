import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';

export function parseTradeName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Trade name is required',
		});
	}
	return trimmed;
}

export async function getTradeOrThrow(ctx: MutationCtx, tradeId: Id<'trades'>) {
	const trade = await ctx.db.get(tradeId);
	if (!trade) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Trade not found',
		});
	}
	return trade;
}

/**
 * Next sort position for a new trade within a group. Stage-less trades share the
 * "Ungrouped" group (stageId === undefined). Uses the current member count so new
 * trades append to the end of their group.
 */
export async function nextTradeOrder(
	ctx: MutationCtx,
	stageId: Id<'tradeStages'> | undefined
): Promise<number> {
	const members = await ctx.db
		.query('trades')
		.withIndex('by_stage', (q) => q.eq('stageId', stageId))
		.collect();
	return members.length;
}

/**
 * Inserts a trade with computed searchText and an appended order within its group.
 * Centralizes order assignment so every create path (direct dialog, quotation and
 * service-provider forms, budget items) stays consistent.
 */
export async function createTrade(
	ctx: MutationCtx,
	args: {
		name: string;
		description?: string | undefined;
		stageId?: Id<'tradeStages'> | undefined;
	}
): Promise<Id<'trades'>> {
	const name = parseTradeName(args.name);
	const description = args.description?.trim() || undefined;
	const searchText = buildTradeSearchText(name, description);
	const order = await nextTradeOrder(ctx, args.stageId);
	return await ctx.db.insert('trades', {
		name,
		description,
		stageId: args.stageId,
		order,
		searchText,
	});
}
