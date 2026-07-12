import { internalMutation } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';

const DOCUMENT_FOLDERS_DATA: string[] = [
	'Signed Master Builders Contract',
	'Architectural Plans',
	'Constructions Documents',
	'Council Documents',
	'Certificates',
	'Marketing',
	'Design & CC Stage',
	'Certifier Approved Documents',
	// PDFs added here are auto-forwarded to the Xero bills inbox (slug: "bills").
	'Bills',
];

export const populate = internalMutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('documentFolders').collect();
		const existingNames = new Set(existing.map((f) => f.name));

		let inserted = 0;
		let skipped = 0;

		for (const name of DOCUMENT_FOLDERS_DATA) {
			if (existingNames.has(name)) {
				skipped++;
				continue;
			}
			await ctx.db.insert('documentFolders', {
				name,
				searchText: buildDocumentFolderSearchText(name),
			});
			inserted++;
		}
		return { inserted, skipped };
	},
});
