import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getWebsiteProjectOrThrow } from './shared';

export const remove = mutation({
	args: {
		websiteProjectId: v.id('websiteProjects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getWebsiteProjectOrThrow(ctx, args.websiteProjectId);
		// Bucket objects are intentionally left in place; the static bucket is
		// public and orphan cleanup is out of scope for project deletion.
		await ctx.db.delete(args.websiteProjectId);
		return args.websiteProjectId;
	},
});
