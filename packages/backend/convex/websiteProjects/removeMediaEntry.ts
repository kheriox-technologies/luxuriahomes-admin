import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';
import { getWebsiteProjectOrThrow } from './shared';

/**
 * Removes the media entry with the given key from a website project's `media`
 * array. Called by the `deleteMedia` action after the object is deleted from the
 * static bucket.
 */
export const removeMediaEntry = internalMutation({
	args: {
		websiteProjectId: v.id('websiteProjects'),
		key: v.string(),
	},
	handler: async (ctx, args) => {
		const existing = await getWebsiteProjectOrThrow(ctx, args.websiteProjectId);
		const media = (existing.media ?? []).filter(
			(item) => item.key !== args.key
		);
		await ctx.db.patch(args.websiteProjectId, {
			media: media.length > 0 ? media : undefined,
		});
		return args.websiteProjectId;
	},
});
