import { internalMutation, internalQuery } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';
import { seedProjectDocumentFolders } from './lib/seedFolders';

const XERO_FOLDER_NAME = 'Xero';
const BILLS_FOLDER_NAME = 'Bills';
const OLD_BILLS_PATH = 'bills';

/** True when a folder path is the old root "bills" folder or nested under it. */
function isUnderOldBills(path: string): boolean {
	return path === OLD_BILLS_PATH || path.startsWith(`${OLD_BILLS_PATH}/`);
}

/**
 * DB half of the Xero/Bills backfill (see `runXeroBillsBackfill` action):
 * ensures the global "Xero" template exists, removes the global "Bills"
 * template so future project seeds no longer create a root "bills" folder, then
 * seeds the "Xero" and "Xero/Bills" folders into every existing project.
 * Idempotent — `seedProjectDocumentFolders` skips folders that already exist.
 */
export const seedProjectsForXeroBills = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existingXeroTemplate = await ctx.db
			.query('documentFolders')
			.filter((q) => q.eq(q.field('name'), XERO_FOLDER_NAME))
			.first();
		if (!existingXeroTemplate) {
			await ctx.db.insert('documentFolders', {
				name: XERO_FOLDER_NAME,
				searchText: buildDocumentFolderSearchText(XERO_FOLDER_NAME),
			});
		}

		const existingBillsTemplate = await ctx.db
			.query('documentFolders')
			.filter((q) => q.eq(q.field('name'), BILLS_FOLDER_NAME))
			.first();
		if (existingBillsTemplate) {
			await ctx.db.delete(existingBillsTemplate._id);
		}

		const projects = await ctx.db.query('projects').collect();
		for (const project of projects) {
			await seedProjectDocumentFolders(ctx, project._id);
		}
		return { projects: projects.length };
	},
});

/**
 * Collects every document and folder under the old root "bills" folder across
 * all projects so the `runXeroBillsBackfill` action can remove their S3 objects
 * and records. Returns document `s3Key`s (for S3 deletion) and record ids.
 */
export const getOldBillsCleanupTargets = internalQuery({
	args: {},
	handler: async (ctx) => {
		const documents = await ctx.db.query('projectDocuments').collect();
		const folders = await ctx.db.query('projectDocumentFolders').collect();

		const documentTargets = documents
			.filter((doc) => isUnderOldBills(doc.folderPath))
			.map((doc) => ({ documentId: doc._id, s3Key: doc.s3Key }));

		const folderIds = folders
			.filter((folder) => isUnderOldBills(folder.path))
			.map((folder) => folder._id);

		return { documents: documentTargets, folderIds };
	},
});
