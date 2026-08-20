import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { type MutationCtx, mutation } from '../_generated/server';
import { buildQuoteTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getQuoteTemplateOrThrow,
	nextQuoteTemplateOrder,
	parseQuoteTemplateName,
	sectionItems,
	stageSections,
	templateExclusions,
	templateNotes,
	templateStages,
	templateTermSections,
	templateTermsSettings,
	termSectionItems,
} from './shared';

async function copyCatalogue(
	ctx: MutationCtx,
	sourceId: Id<'quoteTemplates'>,
	targetId: Id<'quoteTemplates'>
): Promise<void> {
	for (const stage of await templateStages(ctx, sourceId)) {
		const stageId = await ctx.db.insert('quoteStages', {
			defaultPercent: stage.defaultPercent,
			name: stage.name,
			order: stage.order,
			scopeSummary: stage.scopeSummary,
			searchText: stage.searchText,
			templateId: targetId,
		});
		for (const section of await stageSections(ctx, stage._id)) {
			const sectionId = await ctx.db.insert('quoteSections', {
				name: section.name,
				order: section.order,
				searchText: section.searchText,
				stageId,
			});
			for (const item of await sectionItems(ctx, section._id)) {
				await ctx.db.insert('quoteItems', {
					isDefault: item.isDefault,
					name: item.name,
					order: item.order,
					searchText: item.searchText,
					sectionId,
				});
			}
		}
	}
}

async function copyTerms(
	ctx: MutationCtx,
	sourceId: Id<'quoteTemplates'>,
	targetId: Id<'quoteTemplates'>
): Promise<void> {
	for (const section of await templateTermSections(ctx, sourceId)) {
		const sectionId = await ctx.db.insert('quoteTermSections', {
			name: section.name,
			order: section.order,
			searchText: section.searchText,
			templateId: targetId,
		});
		for (const item of await termSectionItems(ctx, section._id)) {
			await ctx.db.insert('quoteTermItems', {
				order: item.order,
				searchText: item.searchText,
				sectionId,
				text: item.text,
			});
		}
	}
	const settings = await templateTermsSettings(ctx, sourceId);
	if (settings) {
		await ctx.db.insert('quoteTermsSettings', {
			acknowledgementHtml: settings.acknowledgementHtml,
			disclaimerHtml: settings.disclaimerHtml,
			templateId: targetId,
		});
	}
}

/**
 * Duplicates a template and all six of its tabs under a new name. Every insert
 * lists its fields explicitly rather than spreading the source row — a spread
 * would carry `_id` and `_creationTime`, which Convex rejects.
 */
export const copy = mutation({
	args: {
		sourceTemplateId: v.id('quoteTemplates'),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const source = await getQuoteTemplateOrThrow(ctx, args.sourceTemplateId);
		const name = parseQuoteTemplateName(args.name);
		const description =
			args.description === undefined
				? source.description
				: args.description.trim() || undefined;

		const templateId = await ctx.db.insert('quoteTemplates', {
			createdAt: Date.now(),
			description,
			name,
			order: await nextQuoteTemplateOrder(ctx),
			searchText: buildQuoteTemplateSearchText(name, description),
		});

		await copyCatalogue(ctx, args.sourceTemplateId, templateId);
		await copyTerms(ctx, args.sourceTemplateId, templateId);
		for (const exclusion of await templateExclusions(
			ctx,
			args.sourceTemplateId
		)) {
			await ctx.db.insert('quoteExclusions', {
				order: exclusion.order,
				searchText: exclusion.searchText,
				templateId,
				text: exclusion.text,
			});
		}
		for (const note of await templateNotes(ctx, args.sourceTemplateId)) {
			await ctx.db.insert('quoteNotes', {
				order: note.order,
				searchText: note.searchText,
				templateId,
				text: note.text,
			});
		}

		return templateId;
	},
});
