import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { type MutationCtx, mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getQuoteTemplateOrThrow,
	sectionItems,
	stageSections,
	templateExclusions,
	templateNotes,
	templateStages,
	templateTermSections,
	templateTermsSettings,
	termSectionItems,
} from './shared';

async function removeCatalogue(
	ctx: MutationCtx,
	templateId: Id<'quoteTemplates'>
): Promise<void> {
	for (const stage of await templateStages(ctx, templateId)) {
		for (const section of await stageSections(ctx, stage._id)) {
			for (const item of await sectionItems(ctx, section._id)) {
				await ctx.db.delete(item._id);
			}
			await ctx.db.delete(section._id);
		}
		await ctx.db.delete(stage._id);
	}
}

async function removeTerms(
	ctx: MutationCtx,
	templateId: Id<'quoteTemplates'>
): Promise<void> {
	for (const section of await templateTermSections(ctx, templateId)) {
		for (const item of await termSectionItems(ctx, section._id)) {
			await ctx.db.delete(item._id);
		}
		await ctx.db.delete(section._id);
	}
	const settings = await templateTermsSettings(ctx, templateId);
	if (settings) {
		await ctx.db.delete(settings._id);
	}
}

/**
 * Deletes a template and every row under it. Quotations already issued from the
 * template are left alone — their body is a complete snapshot, so the
 * `templateId` they carry is provenance and nothing more.
 */
export const remove = mutation({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteTemplateOrThrow(ctx, args.templateId);

		await removeCatalogue(ctx, args.templateId);
		await removeTerms(ctx, args.templateId);
		for (const exclusion of await templateExclusions(ctx, args.templateId)) {
			await ctx.db.delete(exclusion._id);
		}
		for (const note of await templateNotes(ctx, args.templateId)) {
			await ctx.db.delete(note._id);
		}
		await ctx.db.delete(args.templateId);
		return args.templateId;
	},
});
