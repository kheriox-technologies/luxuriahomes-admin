import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getWebsiteProjectOrThrow,
	websiteProjectMediaValidator,
} from './shared';

export const appendMedia = mutation({
	args: {
		websiteProjectId: v.id('websiteProjects'),
		media: v.array(websiteProjectMediaValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getWebsiteProjectOrThrow(ctx, args.websiteProjectId);
		const incoming = args.media.filter((item) => item.key.trim() !== '');
		if (incoming.length === 0) {
			return args.websiteProjectId;
		}
		const media = [...(existing.media ?? []), ...incoming];
		await ctx.db.patch(args.websiteProjectId, { media });
		return args.websiteProjectId;
	},
});
