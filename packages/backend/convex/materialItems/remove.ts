import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { syncVariantItemCount } from '../materialVariants/shared';
import { getMaterialItemOrThrow } from './shared';

export const remove = mutation({
	args: { itemId: v.id('materialItems') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getMaterialItemOrThrow(ctx, args.itemId);
		await ctx.db.delete(args.itemId);
		await syncVariantItemCount(ctx, existing.materialVariantId);
		return args.itemId;
	},
});
