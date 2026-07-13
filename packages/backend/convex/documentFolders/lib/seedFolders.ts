import type { Id } from '../../_generated/dataModel';
import type { MutationCtx } from '../../_generated/server';
import { toKebabCase } from '../../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

/** Inserts a project document folder unless one already exists at `path`. */
async function ensureProjectFolder(
	ctx: MutationCtx,
	projectId: Id<'projects'>,
	folder: { name: string; path: string; parentPath: string }
) {
	const existing = await ctx.db
		.query('projectDocumentFolders')
		.withIndex('by_project_and_path', (q) =>
			q.eq('projectId', projectId).eq('path', folder.path)
		)
		.first();

	if (existing) {
		return;
	}

	await ctx.db.insert('projectDocumentFolders', {
		projectId,
		name: folder.name,
		path: folder.path,
		parentPath: folder.parentPath,
	});
}

/**
 * Copies every global `documentFolders` template into `projectDocumentFolders`
 * for the given project, skipping any whose slug path already exists. Also
 * ensures the nested Xero/Bills folder used for Xero bill forwarding exists.
 */
export async function seedProjectDocumentFolders(
	ctx: MutationCtx,
	projectId: Id<'projects'>
) {
	const folders = await ctx.db.query('documentFolders').collect();

	for (const folder of folders) {
		const slug =
			toKebabCase(folder.name).replace(fileExtensionPattern, '') || 'folder';

		await ensureProjectFolder(ctx, projectId, {
			name: folder.name,
			path: slug,
			parentPath: '',
		});
	}

	// The "Bills" subfolder under "Xero" is the Xero bill-forwarding trigger.
	// The parent "Xero" folder is a template (seeded above), but ensure it too
	// in case the template is missing.
	await ensureProjectFolder(ctx, projectId, {
		name: 'Xero',
		path: 'xero',
		parentPath: '',
	});
	await ensureProjectFolder(ctx, projectId, {
		name: 'Bills',
		path: 'xero/bills',
		parentPath: 'xero',
	});
}
