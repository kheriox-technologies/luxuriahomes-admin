import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';

export function parseQuoteTemplateName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Template name is required',
		});
	}
	return trimmed;
}

export async function getQuoteTemplateOrThrow(
	ctx: QueryCtx,
	templateId: Id<'quoteTemplates'>
) {
	const template = await ctx.db.get(templateId);
	if (!template) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quotation template not found',
		});
	}
	return template;
}

/** Next sort position for a new template, appended after the existing ones. */
export async function nextQuoteTemplateOrder(
	ctx: MutationCtx
): Promise<number> {
	const templates = await ctx.db.query('quoteTemplates').collect();
	return templates.length;
}

// ---------------------------------------------------------------------------
// Traversal
//
// The six catalogue tabs live across eight tables. `remove` and `copy` both walk
// the same shape, so the reads are shared here rather than duplicated.
// ---------------------------------------------------------------------------

export function templateStages(
	ctx: QueryCtx,
	templateId: Id<'quoteTemplates'>
) {
	return ctx.db
		.query('quoteStages')
		.withIndex('by_template_order', (q) => q.eq('templateId', templateId))
		.order('asc')
		.collect();
}

export function stageSections(ctx: QueryCtx, stageId: Id<'quoteStages'>) {
	return ctx.db
		.query('quoteSections')
		.withIndex('by_stage_order', (q) => q.eq('stageId', stageId))
		.order('asc')
		.collect();
}

export function sectionItems(ctx: QueryCtx, sectionId: Id<'quoteSections'>) {
	return ctx.db
		.query('quoteItems')
		.withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
		.order('asc')
		.collect();
}

export function templateTermSections(
	ctx: QueryCtx,
	templateId: Id<'quoteTemplates'>
) {
	return ctx.db
		.query('quoteTermSections')
		.withIndex('by_template_order', (q) => q.eq('templateId', templateId))
		.order('asc')
		.collect();
}

export function termSectionItems(
	ctx: QueryCtx,
	sectionId: Id<'quoteTermSections'>
) {
	return ctx.db
		.query('quoteTermItems')
		.withIndex('by_section_order', (q) => q.eq('sectionId', sectionId))
		.order('asc')
		.collect();
}

export function templateTermsSettings(
	ctx: QueryCtx,
	templateId: Id<'quoteTemplates'>
) {
	return ctx.db
		.query('quoteTermsSettings')
		.withIndex('by_template', (q) => q.eq('templateId', templateId))
		.first();
}

export function templateExclusions(
	ctx: QueryCtx,
	templateId: Id<'quoteTemplates'>
) {
	return ctx.db
		.query('quoteExclusions')
		.withIndex('by_template_order', (q) => q.eq('templateId', templateId))
		.order('asc')
		.collect();
}

export function templateNotes(ctx: QueryCtx, templateId: Id<'quoteTemplates'>) {
	return ctx.db
		.query('quoteNotes')
		.withIndex('by_template_order', (q) => q.eq('templateId', templateId))
		.order('asc')
		.collect();
}
