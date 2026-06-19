import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

export const createFolder = mutation({
	args: {
		name: v.string(),
		parentPath: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const trimmedName = args.name.trim();
		if (!trimmedName) {
			throw new ConvexError({
				code: 'INVALID_ARGUMENT',
				message: 'Folder name is required',
			});
		}

		const rawKebab = toKebabCase(trimmedName);
		const slugName = rawKebab.replace(fileExtensionPattern, '') || 'folder';
		const path = args.parentPath ? `${args.parentPath}/${slugName}` : slugName;

		const existing = await ctx.db
			.query('companyDocumentFolders')
			.withIndex('by_path', (q) => q.eq('path', path))
			.first();

		if (existing) {
			throw new ConvexError({
				code: 'CONFLICT',
				message: 'A folder with this name already exists here',
			});
		}

		return await ctx.db.insert('companyDocumentFolders', {
			name: trimmedName,
			path,
			parentPath: args.parentPath,
		});
	},
});
