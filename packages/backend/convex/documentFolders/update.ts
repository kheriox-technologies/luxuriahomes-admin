import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getDocumentFolderOrThrow, parseDocumentFolderName } from './shared';

export const update = mutation({
	args: {
		documentFolderId: v.id('documentFolders'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getDocumentFolderOrThrow(ctx, args.documentFolderId);
		const name = parseDocumentFolderName(args.name);
		const searchText = buildDocumentFolderSearchText(name);
		await ctx.db.patch(args.documentFolderId, { name, searchText });
		return args.documentFolderId;
	},
});
