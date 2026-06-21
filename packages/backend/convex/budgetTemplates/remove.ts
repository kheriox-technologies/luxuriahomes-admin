import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTemplateOrThrow } from './shared';

export const remove = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);
		const items = await ctx.db
			.query('budgetTemplateItems')
			.withIndex('by_template', (q) =>
				q.eq('budgetTemplateId', args.budgetTemplateId)
			)
			.collect();
		for (const item of items) {
			await ctx.db.delete(item._id);
		}
		await ctx.db.delete(args.budgetTemplateId);
		return args.budgetTemplateId;
	},
});
