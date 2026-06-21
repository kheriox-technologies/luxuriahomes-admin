import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { recomputeTemplateTotal } from '../budgetTemplates/shared';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = mutation({
	args: {
		budgetTemplateItemId: v.id('budgetTemplateItems'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const item = await ctx.db.get(args.budgetTemplateItemId);
		if (!item) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Budget template item not found',
			});
		}
		const { budgetTemplateId } = item;
		await ctx.db.delete(args.budgetTemplateItemId);
		await recomputeTemplateTotal(ctx, budgetTemplateId);
		return args.budgetTemplateItemId;
	},
});
