import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db
			.query('quoteStages')
			.withIndex('by_template_order', (q) =>
				q.eq('templateId', args.templateId)
			)
			.order('asc')
			.collect();
	},
});
