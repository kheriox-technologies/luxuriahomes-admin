import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialVariantOrThrow, syncMaterialVariantCounts } from './shared';

export const remove = mutation({
	args: { variantId: v.id('materialVariants') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getMaterialVariantOrThrow(ctx, args.variantId);

		const items = await ctx.db
			.query('materialItems')
			.withIndex('by_material_variant', (q) =>
				q.eq('materialVariantId', args.variantId)
			)
			.collect();
		for (const item of items) {
			await ctx.db.delete(item._id);
		}

		await ctx.db.delete(args.variantId);
		await syncMaterialVariantCounts(ctx, existing.materialId);
		return args.variantId;
	},
});
