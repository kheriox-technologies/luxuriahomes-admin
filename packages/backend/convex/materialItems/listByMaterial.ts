import { ConvexError, v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listByMaterial = query({
	args: { materialId: v.id('materials') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const material = await ctx.db.get(args.materialId);
		if (!material) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Material not found',
			});
		}
		const items = await ctx.db
			.query('materialItems')
			.withIndex('by_material', (q) => q.eq('materialId', args.materialId))
			.collect();
		return items.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
	},
});
