import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { checkIdentity } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

export const createFolder = mutation({
	args: {
		projectId: v.id('projects'),
		name: v.string(),
		parentPath: v.string(),
	},
	handler: async (ctx, args) => {
		await checkIdentity(ctx);

		const trimmedName = args.name.trim();
		if (!trimmedName) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'Folder name is required',
			});
		}

		// Strip any file extension and convert to kebab slug
		const rawKebab = toKebabCase(trimmedName);
		const slugName = rawKebab.replace(fileExtensionPattern, '') || 'folder';
		const path = args.parentPath ? `${args.parentPath}/${slugName}` : slugName;

		const existing = await ctx.db
			.query('projectDocumentFolders')
			.withIndex('by_project_and_path', (q) =>
				q.eq('projectId', args.projectId).eq('path', path)
			)
			.first();

		if (existing) {
			throw new ConvexError({
				code: 'CONFLICT',
				message: 'A folder with this name already exists here',
			});
		}

		return await ctx.db.insert('projectDocumentFolders', {
			projectId: args.projectId,
			name: trimmedName,
			path,
			parentPath: args.parentPath,
		});
	},
});
