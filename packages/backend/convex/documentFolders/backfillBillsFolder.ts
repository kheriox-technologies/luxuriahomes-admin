import { internalMutation } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';
import { seedProjectDocumentFolders } from './lib/seedFolders';

const BILLS_FOLDER_NAME = 'Bills';

/**
 * One-off backfill: ensures the global "Bills" folder template exists, then
 * seeds it into every existing project's document folders. Idempotent —
 * `seedProjectDocumentFolders` skips folders whose slug already exists, so this
 * is safe to run more than once. Invoke via the Convex dashboard/CLI after
 * deploying the new folder template.
 */
export const backfillBillsFolder = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existingTemplate = await ctx.db
			.query('documentFolders')
			.filter((q) => q.eq(q.field('name'), BILLS_FOLDER_NAME))
			.first();
		if (!existingTemplate) {
			await ctx.db.insert('documentFolders', {
				name: BILLS_FOLDER_NAME,
				searchText: buildDocumentFolderSearchText(BILLS_FOLDER_NAME),
			});
		}

		const projects = await ctx.db.query('projects').collect();
		for (const project of projects) {
			await seedProjectDocumentFolders(ctx, project._id);
		}
		return { projects: projects.length };
	},
});
