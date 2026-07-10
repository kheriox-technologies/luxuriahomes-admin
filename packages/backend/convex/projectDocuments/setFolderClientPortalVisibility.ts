import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const setFolderClientPortalVisibility = mutation({
	args: {
		folderId: v.id('projectDocumentFolders'),
		visible: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const folder = await ctx.db.get(args.folderId);
		if (!folder) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Folder not found',
			});
		}
		const documents = await ctx.db
			.query('projectDocuments')
			.withIndex('by_project', (q) => q.eq('projectId', folder.projectId))
			.collect();
		// Same affected-set logic as deleteFolder.ts: this folder OR any subfolder.
		const affected = documents.filter(
			(doc) =>
				doc.folderPath === folder.path ||
				doc.folderPath.startsWith(`${folder.path}/`)
		);
		for (const doc of affected) {
			await ctx.db.patch(doc._id, { clientPortalVisible: args.visible });
		}
		return affected.length;
	},
});
