import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteTermItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteTermSectionOrThrow } from '../quoteTermSections/shared';

/**
 * Batched reorder covering both reordering clauses within a section and dragging
 * a clause into another section. The frontend sends every clause whose section or
 * order changed across the affected sections.
 */
export const reorder = mutation({
	args: {
		updates: v.array(
			v.object({
				itemId: v.id('quoteTermItems'),
				sectionId: v.id('quoteTermSections'),
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
			// Moved to another section — the section name is embedded in the clause's
			// search text.
			const section = await getQuoteTermSectionOrThrow(ctx, update.sectionId);
			await ctx.db.patch(update.itemId, {
				sectionId: update.sectionId,
				order: update.order,
				searchText: buildQuoteTermItemSearchText(item.text, section.name),
			});
		}
	},
});
