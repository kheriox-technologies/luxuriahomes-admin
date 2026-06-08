import { mutation } from '../_generated/server';
import { buildDocumentFolderSearchText } from '../lib/buildSearchText';

const DOCUMENT_FOLDERS_DATA: string[] = [
	'Signed Master Builders Contract',
	'Architectural Plans',
	'Constructions Documents',
	'Council Documents',
	'Certificates',
	'Marketing',
	'Design & CC Stage',
];

export const populate = mutation({
	args: {},
	handler: async (ctx) => {
		const existing = await ctx.db.query('documentFolders').first();
		if (existing) {
			return { skipped: true, message: 'Document folders already populated' };
		}
		for (const name of DOCUMENT_FOLDERS_DATA) {
			await ctx.db.insert('documentFolders', {
				name,
				searchText: buildDocumentFolderSearchText(name),
			});
		}
		return { inserted: DOCUMENT_FOLDERS_DATA.length };
	},
});
