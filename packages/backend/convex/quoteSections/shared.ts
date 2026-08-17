import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import {
	buildQuoteItemSearchText,
	buildQuoteSectionSearchText,
} from '../lib/buildSearchText';
import { getQuoteStageOrThrow } from '../quoteStages/shared';

export function parseQuoteSectionName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Section name is required',
		});
	}
	return trimmed;
}

export async function getQuoteSectionOrThrow(
	ctx: QueryCtx,
	sectionId: Id<'quoteSections'>
) {
	const section = await ctx.db.get(sectionId);
	if (!section) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quote section not found',
		});
	}
	return section;
}

/**
 * Next sort position for a new section, appended after the stage's existing
 * sections.
 */
export async function nextQuoteSectionOrder(
	ctx: MutationCtx,
	stageId: Id<'quoteStages'>
): Promise<number> {
	const sections = await ctx.db
		.query('quoteSections')
		.withIndex('by_stage_order', (q) => q.eq('stageId', stageId))
		.collect();
	return sections.length;
}

/**
 * Inserts a section from a raw name with computed order + searchText. Shared by
 * the section dialog and the inline "or create new section" flow on the item form.
 */
export async function createQuoteSection(
	ctx: MutationCtx,
	stageId: Id<'quoteStages'>,
	rawName: string
): Promise<Id<'quoteSections'>> {
	const stage = await getQuoteStageOrThrow(ctx, stageId);
	const name = parseQuoteSectionName(rawName);
	const searchText = buildQuoteSectionSearchText(name, stage.name);
	const order = await nextQuoteSectionOrder(ctx, stageId);
	return await ctx.db.insert('quoteSections', {
		name,
		stageId,
		order,
		searchText,
	});
}

/**
 * Rewrites the denormalized searchText of every item under a section after the
 * section or its stage was renamed (item search text embeds both names).
 */
export async function syncItemSearchTextsForSection(
	ctx: MutationCtx,
	sectionId: Id<'quoteSections'>,
	sectionName: string,
	stageName: string
): Promise<void> {
	const items = await ctx.db
		.query('quoteItems')
		.withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
		.collect();
	for (const item of items) {
		await ctx.db.patch(item._id, {
			searchText: buildQuoteItemSearchText(item.name, sectionName, stageName),
		});
	}
}

/**
 * Rewrites the searchText of every section under a stage and of every item under
 * those sections. Called after a stage rename.
 */
export async function syncSearchTextsForStage(
	ctx: MutationCtx,
	stageId: Id<'quoteStages'>,
	stageName: string
): Promise<void> {
	const sections = await ctx.db
		.query('quoteSections')
		.withIndex('by_stage_order', (q) => q.eq('stageId', stageId))
		.collect();
	for (const section of sections) {
		await ctx.db.patch(section._id, {
			searchText: buildQuoteSectionSearchText(section.name, stageName),
		});
		await syncItemSearchTextsForSection(
			ctx,
			section._id,
			section.name,
			stageName
		);
	}
}
