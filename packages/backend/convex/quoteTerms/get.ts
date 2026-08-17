import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * The whole quote terms page in one round trip: the disclaimer and
 * acknowledgement copy, plus every terms section with its clauses sorted by
 * `order`. Mirrors `quoteCatalogue/tree` — the content is small and the page
 * renders it as one nested accordion, so a single query beats a query per node.
 *
 * The settings row is created lazily, so an unseeded deployment reads back empty
 * strings rather than null.
 */
export const get = query({
	args: {},
	handler: async (ctx) => {
		await requireAdmin(ctx);
		const settings = await ctx.db.query('quoteTermsSettings').first();
		const sections = await ctx.db
			.query('quoteTermSections')
			.withIndex('by_order')
			.order('asc')
			.collect();

		const sectionsWithItems = await Promise.all(
			sections.map(async (section) => ({
				section,
				items: await ctx.db
					.query('quoteTermItems')
					.withIndex('by_section_order', (q) => q.eq('sectionId', section._id))
					.order('asc')
					.collect(),
			}))
		);

		return {
			settings: {
				acknowledgementHtml: settings?.acknowledgementHtml ?? '',
				disclaimerHtml: settings?.disclaimerHtml ?? '',
			},
			sections: sectionsWithItems,
		};
	},
});
