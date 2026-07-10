import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

// Idempotently creates a nested folder path relative to `parentPath`, creating
// any missing intermediate folders. Used by folder uploads where many files
// share the same (possibly pre-existing) folder tree. Returns the final
// kebab-slugged path so callers can place files at the correct folderPath.
export const ensureFolder = mutation({
	args: {
		projectId: v.id('projects'),
		parentPath: v.string(),
		segments: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		let path = args.parentPath;

		for (const rawSegment of args.segments) {
			const trimmedName = rawSegment.trim();
			if (!trimmedName) {
				throw new ConvexError({
					code: 'INVALID_ARGUMENT',
					message: 'Folder name is required',
				});
			}

			const rawKebab = toKebabCase(trimmedName);
			const slugName = rawKebab.replace(fileExtensionPattern, '') || 'folder';
			const candidate = path ? `${path}/${slugName}` : slugName;

			const existing = await ctx.db
				.query('projectDocumentFolders')
				.withIndex('by_project_and_path', (q) =>
					q.eq('projectId', args.projectId).eq('path', candidate)
				)
				.first();

			if (!existing) {
				await ctx.db.insert('projectDocumentFolders', {
					projectId: args.projectId,
					name: trimmedName,
					path: candidate,
					parentPath: path,
				});
			}

			path = candidate;
		}

		return path;
	},
});
