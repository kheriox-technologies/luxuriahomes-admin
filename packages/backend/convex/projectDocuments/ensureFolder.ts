import { ConvexError, v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { type MutationCtx, mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { toKebabCase } from '../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

// Idempotently creates a nested folder path relative to `parentPath`, creating
// any missing intermediate folders. Returns the final kebab-slugged path so
// callers can place files at the correct folderPath.
export async function ensureFolderPath(
	ctx: MutationCtx,
	projectId: Id<'projects'>,
	parentPath: string,
	segments: string[]
): Promise<string> {
	let path = parentPath;

	for (const rawSegment of segments) {
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
				q.eq('projectId', projectId).eq('path', candidate)
			)
			.first();

		if (!existing) {
			await ctx.db.insert('projectDocumentFolders', {
				projectId,
				name: trimmedName,
				path: candidate,
				parentPath: path,
			});
		}

		path = candidate;
	}

	return path;
}

// Used by folder uploads where many files share the same (possibly
// pre-existing) folder tree.
export const ensureFolder = mutation({
	args: {
		projectId: v.id('projects'),
		parentPath: v.string(),
		segments: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ensureFolderPath(
			ctx,
			args.projectId,
			args.parentPath,
			args.segments
		);
	},
});
