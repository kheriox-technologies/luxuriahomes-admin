import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getWebsiteProjectOrThrow } from './shared';

/**
 * Flags a single project image as the marketing main image. Pass `key: null` to
 * clear the current selection. The key is expected to reference an existing
 * media entry; the object itself already lives in the static bucket so nothing
 * is copied.
 */
export const setMainImage = mutation({
	args: {
		websiteProjectId: v.id('websiteProjects'),
		key: v.union(v.string(), v.null()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getWebsiteProjectOrThrow(ctx, args.websiteProjectId);
		await ctx.db.patch(args.websiteProjectId, {
			mainImageKey: args.key ?? undefined,
		});
		return args.websiteProjectId;
	},
});
