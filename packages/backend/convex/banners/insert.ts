import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

/**
 * Inserts a banner record. Called by the `createFromMedia` action after the
 * source image has been copied into the static bucket's `banners/` prefix.
 */
export const insert = internalMutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		key: v.string(),
		sourceKey: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert('banners', {
			title: args.title,
			description: args.description,
			key: args.key,
			sourceKey: args.sourceKey,
		});
	},
});
