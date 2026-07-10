import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import { toKebabCase } from '../../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

/**
 * Copies every global `documentFolders` template into `projectDocumentFolders`
 * for the given project, skipping any whose slug path already exists.
 */
export async function seedProjectDocumentFolders(
	ctx: MutationCtx,
	projectId: Id<'projects'>
) {
	const folders = await ctx.db.query('documentFolders').collect();

	for (const folder of folders) {
		const slug =
			toKebabCase(folder.name).replace(fileExtensionPattern, '') || 'folder';

		const existing = await ctx.db
			.query('projectDocumentFolders')
			.withIndex('by_project_and_path', (q) =>
				q.eq('projectId', projectId).eq('path', slug)
			)
			.first();

		if (existing) {
			continue;
		}

		await ctx.db.insert('projectDocumentFolders', {
			projectId,
			name: folder.name,
			path: slug,
			parentPath: '',
		});
	}
}
