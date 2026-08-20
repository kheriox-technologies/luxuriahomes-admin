import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import {
	buildQuoteTermItemSearchText,
	buildQuoteTermSectionSearchText,
} from '../lib/buildSearchText';

export function parseQuoteTermSectionName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Section name is required',
		});
	}
	return trimmed;
}

export async function getQuoteTermSectionOrThrow(
	ctx: QueryCtx,
	sectionId: Id<'quoteTermSections'>
) {
	const section = await ctx.db.get(sectionId);
	if (!section) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Terms section not found',
		});
	}
	return section;
}

/** Next sort position for a new section, appended after the existing ones. */
export async function nextQuoteTermSectionOrder(
	ctx: MutationCtx,
	templateId: Id<'quoteTemplates'>
): Promise<number> {
	const sections = await ctx.db
		.query('quoteTermSections')
		.withIndex('by_template_order', (q) => q.eq('templateId', templateId))
		.collect();
	return sections.length;
}

/**
 * Inserts a section from a raw name with computed order + searchText. Shared by
 * the section dialog and the inline "or create new section" flow on the clause
 * form.
 */
export async function createQuoteTermSection(
	ctx: MutationCtx,
	templateId: Id<'quoteTemplates'>,
	rawName: string
): Promise<Id<'quoteTermSections'>> {
	const name = parseQuoteTermSectionName(rawName);
	return await ctx.db.insert('quoteTermSections', {
		name,
		order: await nextQuoteTermSectionOrder(ctx, templateId),
		searchText: buildQuoteTermSectionSearchText(name),
		templateId,
	});
}

/**
 * Rewrites the denormalized searchText of every clause under a section after the
 * section was renamed (clause search text embeds its section name).
 */
export async function syncItemSearchTextsForSection(
	ctx: MutationCtx,
	sectionId: Id<'quoteTermSections'>,
	sectionName: string
): Promise<void> {
	const items = await ctx.db
		.query('quoteTermItems')
		.withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
		.collect();
	for (const item of items) {
		await ctx.db.patch(item._id, {
			searchText: buildQuoteTermItemSearchText(item.text, sectionName),
		});
	}
}
