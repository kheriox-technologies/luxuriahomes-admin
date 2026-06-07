import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const getUnit = query({
	args: { inclusionVariantId: v.id('inclusionVariants') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const variant = await ctx.db.get(args.inclusionVariantId);
		if (!variant) {
			return null;
		}
		const inclusion = await ctx.db.get(variant.inclusionId);
		if (!inclusion?.measurementUnit) {
			return null;
		}
		const unit = await ctx.db.get(inclusion.measurementUnit);
		return unit ?? null;
	},
});
