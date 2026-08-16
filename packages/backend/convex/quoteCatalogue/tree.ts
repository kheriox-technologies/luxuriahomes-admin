import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * The whole quote catalogue in one round trip: stages, each with its sections,
 * each with its items — all sorted by `order`. The catalogue is small and the
 * page renders it as one nested accordion, so a single query beats a query per
 * open node.
 */
export const tree = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const stages = await ctx.db
			.query('quoteStages')
			.withIndex('by_order')
			.order('asc')
			.collect();

		return await Promise.all(
			stages.map(async (stage) => {
				const sections = await ctx.db
					.query('quoteSections')
					.withIndex('by_stage_order', (q) => q.eq('stageId', stage._id))
					.order('asc')
					.collect();
				const sectionsWithItems = await Promise.all(
					sections.map(async (section) => ({
						section,
						items: await ctx.db
							.query('quoteItems')
							.withIndex('by_section_order', (q) =>
								q.eq('sectionId', section._id)
							)
							.order('asc')
							.collect(),
					}))
				);
				return { stage, sections: sectionsWithItems };
			})
		);
	},
});
