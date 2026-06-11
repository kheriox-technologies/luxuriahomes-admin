import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: { materialId: v.id('materials') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const material = await ctx.db.get(args.materialId);
		if (!material) {
			return null;
		}
		const unit = await ctx.db.get(material.unit);
		return { material, unit };
	},
});
