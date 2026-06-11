import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByVariant = query({
	args: { variantId: v.id('materialVariants') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const variant = await ctx.db.get(args.variantId);
		if (!variant) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Variant not found',
			});
		}
		const items = await ctx.db
			.query('materialItems')
			.withIndex('by_material_variant', (q) =>
				q.eq('materialVariantId', args.variantId)
			)
			.collect();
		return items.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
	},
});
