import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteSectionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteStageOrThrow } from '../quoteStages/shared';
import { syncItemSearchTextsForSection } from './shared';

/**
 * Batched reorder covering both reordering sections within a stage and dragging a
 * section into another stage. The frontend sends every section whose stage or
 * order changed across the affected stages.
 */
export const reorder = mutation({
	args: {
		updates: v.array(
			v.object({
				sectionId: v.id('quoteSections'),
				stageId: v.id('quoteStages'),
				order: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const update of args.updates) {
			const section = await ctx.db.get(update.sectionId);
			if (!section) {
				continue;
			}
			if (section.stageId === update.stageId) {
				await ctx.db.patch(update.sectionId, { order: update.order });
				continue;
			}
			// Moved to another stage — the stage name is embedded in the section's and
			// its items' search text, so both have to be rewritten.
			const stage = await getQuoteStageOrThrow(ctx, update.stageId);
			await ctx.db.patch(update.sectionId, {
				stageId: update.stageId,
				order: update.order,
				searchText: buildQuoteSectionSearchText(section.name, stage.name),
			});
			await syncItemSearchTextsForSection(
				ctx,
				update.sectionId,
				section.name,
				stage.name
			);
		}
	},
});
