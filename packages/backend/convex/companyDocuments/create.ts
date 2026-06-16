import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity } from '../lib/checkIdentity';

export const create = mutation({
	args: {
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		folderPath: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		const identity = await checkIdentity(ctx);
		return await ctx.db.insert('companyDocuments', {
			name: args.name,
			kebabName: args.kebabName,
			s3Key: args.s3Key,
			folderPath: args.folderPath,
			size: args.size,
			mimeType: args.mimeType,
			uploadedBy: identity.name ?? identity.email ?? 'Unknown',
			uploadedAt: Date.now(),
		});
	},
});
