import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteTermSectionOrThrow } from './shared';

export const remove = mutation({
	args: {
		sectionId: v.id('quoteTermSections'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteTermSectionOrThrow(ctx, args.sectionId);

		// Clauses cannot exist without a section, so this cascades. The delete
		// dialog warns with the clause count.
		const items = await ctx.db
			.query('quoteTermItems')
			.withIndex('by_section_order', (q) => q.eq('sectionId', args.sectionId))
			.collect();
		for (const item of items) {
			await ctx.db.delete(item._id);
		}

		await ctx.db.delete(args.sectionId);
		return args.sectionId;
	},
});
