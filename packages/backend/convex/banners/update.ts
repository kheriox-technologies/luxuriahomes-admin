import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const update = mutation({
	args: {
		bannerId: v.id('banners'),
		title: v.string(),
		description: v.optional(v.union(v.string(), v.null())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.bannerId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Banner not found',
			});
		}
		const title = args.title.trim();
		if (title === '') {
			throw new ConvexError({
				code: 'TITLE_REQUIRED',
				message: 'Banner title is required',
			});
		}
		let description = existing.description;
		if (args.description !== undefined) {
			description =
				args.description === null
					? undefined
					: args.description.trim() || undefined;
		}
		await ctx.db.patch(args.bannerId, { title, description });
		return args.bannerId;
	},
});
