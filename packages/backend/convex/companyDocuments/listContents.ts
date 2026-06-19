import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listContents = query({
	args: {
		folderPath: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const folders = await ctx.db
			.query('companyDocumentFolders')
			.withIndex('by_parent', (q) => q.eq('parentPath', args.folderPath))
			.collect();
		const documents = await ctx.db
			.query('companyDocuments')
			.withIndex('by_folder', (q) => q.eq('folderPath', args.folderPath))
			.collect();
		return { folders, documents };
	},
});
