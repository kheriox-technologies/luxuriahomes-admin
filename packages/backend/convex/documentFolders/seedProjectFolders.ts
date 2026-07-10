import { internalMutation } from '../_generated/server';
import { seedProjectDocumentFolders } from './lib/seedFolders';

export const populate = internalMutation({
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

		for (const project of projects) {
			await seedProjectDocumentFolders(ctx, project._id);
		}

		return { populated: projects.length };
	},
});
