import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

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
