import { ConvexError, v } from 'convex/values';
import { internalQuery } from '../_generated/server';

export const listProjects = internalQuery({
	args: {},
	handler: async (ctx) => {
		const projects = await ctx.db.query('projects').collect();
		return projects
			.map((project) => ({
				id: project._id,
				name: project.name,
				status: project.status,
			}))
			.sort((a, b) =>
				a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
			);
	},
});

export const getProject = internalQuery({
	args: { projectId: v.id('projects') },
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.projectId);
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}
		return { id: project._id, name: project.name };
	},
});
