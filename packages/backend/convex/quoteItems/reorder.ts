import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteSectionOrThrow } from '../quoteSections/shared';
import { getQuoteStageOrThrow } from '../quoteStages/shared';

/**
 * Batched reorder covering both reordering items within a section and dragging an
 * item into another section. The frontend sends every item whose section or order
 * changed across the affected sections.
 */
export const reorder = mutation({
	args: {
		updates: v.array(
			v.object({
				itemId: v.id('quoteItems'),
				sectionId: v.id('quoteSections'),
				order: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const update of args.updates) {
			const item = await ctx.db.get(update.itemId);
			if (!item) {
				continue;
			}
			if (item.sectionId === update.sectionId) {
				await ctx.db.patch(update.itemId, { order: update.order });
				continue;
			}
			// Moved to another section — the section and stage names are embedded in
			// the item's search text.
			const section = await getQuoteSectionOrThrow(ctx, update.sectionId);
			const stage = await getQuoteStageOrThrow(ctx, section.stageId);
			await ctx.db.patch(update.itemId, {
				sectionId: update.sectionId,
				order: update.order,
				searchText: buildQuoteItemSearchText(
					item.name,
					section.name,
					stage.name
				),
			});
		}
	},
});
