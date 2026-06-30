import { v } from 'convex/values';
import { query } from '../_generated/server';
import { sortByName, toPublicProject, webProjectValidator } from './shared';

/**
 * Public (unauthenticated) read queries that power the marketing website.
 *
 * Unlike the admin `websiteProjects/*` queries, these are intentionally NOT
 * gated by `requireAdmin`. They only ever expose projects flagged `include`,
 * and strip internal fields via `toPublicProject`.
 */

// All published projects (include === true), any status. Used by /projects.
export const listPublished = query({
	args: {},
	returns: v.array(webProjectValidator),
	handler: async (ctx) => {
		const rows = await ctx.db
			.query('websiteProjects')
			.withIndex('by_include', (q) => q.eq('include', true))
			.collect();
		return sortByName(rows).map(toPublicProject);
	},
});

// Published AND completed projects. Used by the home page grid.
export const listCompleted = query({
	args: {},
	returns: v.array(webProjectValidator),
	handler: async (ctx) => {
		const rows = await ctx.db
			.query('websiteProjects')
			.withIndex('by_include', (q) => q.eq('include', true))
			.collect();
		return sortByName(rows.filter((p) => p.status === 'completed')).map(
			toPublicProject
		);
	},
});

// Single project by id — returns null unless it is published AND completed.
// In-progress projects have no detail page (they only appear as minimal cards),
// so deep-links to hidden/un-included or in-progress projects 404 on the site.
export const get = query({
	args: { id: v.id('websiteProjects') },
	returns: v.union(webProjectValidator, v.null()),
	handler: async (ctx, { id }) => {
		const project = await ctx.db.get(id);
		if (!project?.include || project.status !== 'completed') {
			return null;
		}
		return toPublicProject(project);
	},
});
