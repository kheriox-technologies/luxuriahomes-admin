import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

/**
 * Inserts a banner record. Called by the `createFromMedia` action after the
 * source image has been copied into the static bucket's `banners/` prefix.
 * The new banner is placed last by assigning it `maxExistingOrder + 1`.
 */
export const insert = internalMutation({
	args: {
		key: v.string(),
		sourceKey: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db.query('banners').collect();
		// Place the new banner last. Fall back to `_creationTime` for any row not
		// yet backfilled with an explicit `order`, matching the sort in `list`.
		const maxOrder = existing.reduce(
			(max, banner) => Math.max(max, banner.order ?? banner._creationTime),
			0
		);
		return await ctx.db.insert('banners', {
			key: args.key,
			sourceKey: args.sourceKey,
			order: maxOrder + 1,
		});
	},
});
