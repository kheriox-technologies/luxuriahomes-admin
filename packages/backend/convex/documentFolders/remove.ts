import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getDocumentFolderOrThrow } from './shared';

export const remove = mutation({
	args: {
		documentFolderId: v.id('documentFolders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getDocumentFolderOrThrow(ctx, args.documentFolderId);
		await ctx.db.delete(args.documentFolderId);
		return args.documentFolderId;
	},
});
