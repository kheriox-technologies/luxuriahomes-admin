import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const listContents = query({
	args: {
		projectId: v.id('projects'),
		folderPath: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const folders = await ctx.db
			.query('projectDocumentFolders')
			.withIndex('by_project_and_parent', (q) =>
				q.eq('projectId', args.projectId).eq('parentPath', args.folderPath)
			)
			.collect();
		const documents = await ctx.db
			.query('projectDocuments')
			.withIndex('by_project_and_folder', (q) =>
				q.eq('projectId', args.projectId).eq('folderPath', args.folderPath)
			)
			.collect();
		return { folders, documents };
	},
});
