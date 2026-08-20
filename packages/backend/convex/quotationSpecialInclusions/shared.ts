import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseSpecialInclusionText(text: string): string {
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Special inclusion text is required',
		});
	}
	return trimmed;
}

/**
 * Normalises a standard price. Mirrors `parseSpecialInclusions` on the
 * quotation snapshot: anything at or below zero reads as "no price".
 */
export function parseSpecialInclusionAmount(
	amount: number | null | undefined
): number | undefined {
	if (amount === null || amount === undefined) {
		return undefined;
	}
	if (!Number.isFinite(amount)) {
		throw new ConvexError({
			code: 'INVALID_AMOUNT',
			message: 'Amount must be a number',
		});
	}
	if (amount < 0) {
		throw new ConvexError({
			code: 'INVALID_AMOUNT',
			message: 'Amount cannot be negative',
		});
	}
	return amount > 0 ? Math.round(amount * 100) / 100 : undefined;
}

export async function getSpecialInclusionOrThrow(
	ctx: QueryCtx,
	inclusionId: Id<'quotationSpecialInclusions'>
) {
	const inclusion = await ctx.db.get(inclusionId);
	if (!inclusion) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Special inclusion not found',
		});
	}
	return inclusion;
}

/** Next sort position, appended after the existing rows. */
export async function nextSpecialInclusionOrder(
	ctx: MutationCtx
): Promise<number> {
	const rows = await ctx.db
		.query('quotationSpecialInclusions')
		.withIndex('by_order')
		.collect();
	return rows.length;
}
