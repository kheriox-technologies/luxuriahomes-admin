import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: { variantId: v.id('materialVariants') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const variant = await ctx.db.get(args.variantId);
		if (!variant) {
			return null;
		}
		const material = await ctx.db.get(variant.materialId);
		if (!material) {
			return null;
		}
		const unit = await ctx.db.get(material.unit);
		return { variant, material, unit };
	},
});
