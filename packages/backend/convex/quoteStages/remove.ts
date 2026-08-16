import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteStageOrThrow } from './shared';

export const remove = mutation({
	args: {
		stageId: v.id('quoteStages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteStageOrThrow(ctx, args.stageId);

		// Sections and items cannot exist without a parent, so deleting a stage
		// cascades all the way down. The delete dialog warns with the child counts.
		const sections = await ctx.db
			.query('quoteSections')
			.withIndex('by_stage_order', (q) => q.eq('stageId', args.stageId))
			.collect();
		for (const section of sections) {
			const items = await ctx.db
				.query('quoteItems')
				.withIndex('by_section_order', (q) => q.eq('sectionId', section._id))
				.collect();
			for (const item of items) {
				await ctx.db.delete(item._id);
			}
			await ctx.db.delete(section._id);
		}

		await ctx.db.delete(args.stageId);
		return args.stageId;
	},
});
