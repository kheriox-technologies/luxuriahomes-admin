import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseQuoteItemName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Item name is required',
		});
	}
	return trimmed;
}

export async function getQuoteItemOrThrow(
	ctx: QueryCtx,
	itemId: Id<'quoteItems'>
) {
	const item = await ctx.db.get(itemId);
	if (!item) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quote item not found',
		});
	}
	return item;
}

/**
 * Next sort position for a new item, appended after the section's existing items.
 */
export async function nextQuoteItemOrder(
	ctx: MutationCtx,
	sectionId: Id<'quoteSections'>
): Promise<number> {
	const items = await ctx.db
		.query('quoteItems')
		.withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
		.collect();
	return items.length;
}
