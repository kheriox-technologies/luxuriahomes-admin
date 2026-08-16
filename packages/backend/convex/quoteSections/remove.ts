import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteSectionOrThrow } from './shared';

export const remove = mutation({
	args: {
		sectionId: v.id('quoteSections'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteSectionOrThrow(ctx, args.sectionId);

		// Items cannot exist without a section, so this cascades.
		const items = await ctx.db
			.query('quoteItems')
			.withIndex('by_section_order', (q) => q.eq('sectionId', args.sectionId))
			.collect();
		for (const item of items) {
			await ctx.db.delete(item._id);
		}

		await ctx.db.delete(args.sectionId);
		return args.sectionId;
	},
});
