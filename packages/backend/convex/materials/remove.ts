import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialOrThrow } from './shared';

export const remove = mutation({
	args: { materialId: v.id('materials') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getMaterialOrThrow(ctx, args.materialId);

		const variants = await ctx.db
			.query('materialVariants')
			.withIndex('by_material', (q) => q.eq('materialId', args.materialId))
			.collect();

		for (const variant of variants) {
			const items = await ctx.db
				.query('materialItems')
				.withIndex('by_material_variant', (q) =>
					q.eq('materialVariantId', variant._id)
				)
				.collect();
			for (const item of items) {
				await ctx.db.delete(item._id);
			}
			await ctx.db.delete(variant._id);
		}

		await ctx.db.delete(args.materialId);
		return args.materialId;
	},
});
