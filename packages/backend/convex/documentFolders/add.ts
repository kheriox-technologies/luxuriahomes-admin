import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseDocumentFolderName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseDocumentFolderName(args.name);
		const searchText = buildDocumentFolderSearchText(name);
		return await ctx.db.insert('documentFolders', { name, searchText });
	},
});
