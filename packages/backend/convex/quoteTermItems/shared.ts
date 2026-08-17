import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseQuoteTermItemText(text: string): string {
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Clause text is required',
		});
	}
	return trimmed;
}

export async function getQuoteTermItemOrThrow(
	ctx: QueryCtx,
	itemId: Id<'quoteTermItems'>
) {
	const item = await ctx.db.get(itemId);
	if (!item) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Clause not found',
		});
	}
	return item;
}

/**
 * Next sort position for a new clause, appended after the section's existing
 * clauses.
 */
export async function nextQuoteTermItemOrder(
	ctx: MutationCtx,
	sectionId: Id<'quoteTermSections'>
): Promise<number> {
	const items = await ctx.db
		.query('quoteTermItems')
		.withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
		.collect();
	return items.length;
}
