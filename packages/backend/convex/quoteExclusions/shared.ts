import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseQuoteExclusionText(text: string): string {
	const trimmed = text.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Exclusion text is required',
		});
	}
	return trimmed;
}

export async function getQuoteExclusionOrThrow(
	ctx: QueryCtx,
	exclusionId: Id<'quoteExclusions'>
) {
	const exclusion = await ctx.db.get(exclusionId);
	if (!exclusion) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Exclusion not found',
		});
	}
	return exclusion;
}

/** Next sort position for a new exclusion, appended after the existing ones. */
export async function nextQuoteExclusionOrder(
	ctx: MutationCtx,
	templateId: Id<'quoteTemplates'>
): Promise<number> {
	const exclusions = await ctx.db
		.query('quoteExclusions')
		.withIndex('by_template_order', (q) => q.eq('templateId', templateId))
		.collect();
	return exclusions.length;
}
