import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { insertProjectDocument } from './shared';

export const create = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		kebabName: v.string(),
		s3Key: v.string(),
		folderPath: v.string(),
		size: v.optional(v.number()),
		mimeType: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const identity = await checkIdentity(ctx);
		return await insertProjectDocument(ctx, {
			...args,
			uploadedBy: identity.name ?? identity.email ?? 'Unknown',
		});
	},
});
