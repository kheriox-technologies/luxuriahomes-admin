import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';

/**
 * Normalizes a trade's single Xero account GUID: trims; a blank/`null` becomes
 * `undefined` so an unmapped trade stores no field.
 */
export function normalizeXeroAccountId(
	id: string | null | undefined
): string | undefined {
	if (id === undefined || id === null) {
		return;
	}
	const trimmed = id.trim();
	return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Enforces the 1:1 rule — a Xero account GUID maps to at most one trade. Throws
 * if `accountId` is already mapped to a different trade (`exceptTradeId` is the
 * trade being edited, excluded from the check).
 */
export async function assertXeroAccountAvailable(
	ctx: MutationCtx,
	accountId: string,
	exceptTradeId?: Id<'trades'>
): Promise<void> {
	const mapped = await ctx.db
		.query('trades')
		.withIndex('by_xero_account', (q) => q.eq('xeroAccountId', accountId))
		.collect();
	const conflict = mapped.find((trade) => trade._id !== exceptTradeId);
	if (conflict) {
		throw new ConvexError({
			code: 'DUPLICATE_XERO_CODE',
			message: `This Xero code is already mapped to "${conflict.name}".`,
		});
	}
}

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
		xeroAccountId?: string | null | undefined;
	}
): Promise<Id<'trades'>> {
	const name = parseTradeName(args.name);
	const description = args.description?.trim() || undefined;
	const searchText = buildTradeSearchText(name, description);
	const order = await nextTradeOrder(ctx, args.stageId);
	const xeroAccountId = normalizeXeroAccountId(args.xeroAccountId);
	if (xeroAccountId) {
		await assertXeroAccountAvailable(ctx, xeroAccountId);
	}
	return await ctx.db.insert('trades', {
		name,
		description,
		stageId: args.stageId,
		order,
		xeroAccountId,
		searchText,
	});
}
