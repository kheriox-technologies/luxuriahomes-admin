import { mutation } from '../_generated/server';
import { toKebabCase } from '../lib/toKebabCase';

const fileExtensionPattern = /\.[^.]*$/;

export const populate = mutation({
	args: {},
	handler: async (ctx) => {
		const projects = await ctx.db.query('projects').collect();
		const folders = await ctx.db.query('documentFolders').collect();

		if (projects.length === 0 || folders.length === 0) {
			return {
				skipped: true,
				message: 'No projects or document folders found',
			};
		}

		let inserted = 0;
		let skipped = 0;

		for (const project of projects) {
			for (const folder of folders) {
				const slug =
					toKebabCase(folder.name).replace(fileExtensionPattern, '') ||
					'folder';

				const existing = await ctx.db
					.query('projectDocumentFolders')
					.withIndex('by_project_and_path', (q) =>
						q.eq('projectId', project._id).eq('path', slug)
					)
					.first();

				if (existing) {
					skipped++;
					continue;
				}

				await ctx.db.insert('projectDocumentFolders', {
					projectId: project._id,
					name: folder.name,
					path: slug,
					parentPath: '',
				});
				inserted++;
			}
		}

		return { inserted, skipped };
	},
});
