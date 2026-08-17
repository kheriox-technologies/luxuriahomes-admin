import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		sectionIds: v.array(v.id('quoteTermSections')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (const [index, sectionId] of args.sectionIds.entries()) {
			await ctx.db.patch(sectionId, { order: index });
		}
	},
});
