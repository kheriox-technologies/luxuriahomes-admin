import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/** Every exclusion in print order. The list is small, so it loads in one go. */
export const list = query({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('quoteExclusions')
			.withIndex('by_template_order', (q) =>
				q.eq('templateId', args.templateId)
			)
			.order('asc')
			.collect();
	},
});
