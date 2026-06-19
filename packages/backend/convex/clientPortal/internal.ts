import { v } from 'convex/values';
import { internalMutation, internalQuery } from '../_generated/server';
import { normalizeClientEmail } from '../projects/shared';

/**
 * Returns the portal-relevant fields of a project client identified by email,
 * or null when the project or client does not exist.
 */
export const getClientForPortal = internalQuery({
	args: {
		projectId: v.id('projects'),
		email: v.string(),
	},
	returns: v.union(
		v.null(),
		v.object({
			firstName: v.string(),
			lastName: v.string(),
			email: v.string(),
			portalUserId: v.optional(v.string()),
		})
	),
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.projectId);
		if (!project) {
			return null;
		}
		const target = normalizeClientEmail(args.email);
		const client = project.clients.find(
			(c) => normalizeClientEmail(c.email) === target
		);
		if (!client) {
			return null;
		}
		return {
			firstName: client.firstName,
			lastName: client.lastName,
			email: client.email,
			portalUserId: client.portalUserId,
		};
	},
});

/** Links a project client to its Clerk portal user. */
export const linkClientPortalUser = internalMutation({
	args: {
		projectId: v.id('projects'),
		email: v.string(),
		portalUserId: v.string(),
		grantedAt: v.number(),
	},
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.projectId);
		if (!project) {
			return;
		}
		const target = normalizeClientEmail(args.email);
		const clients = project.clients.map((client) =>
			normalizeClientEmail(client.email) === target
				? {
						...client,
						portalUserId: args.portalUserId,
						portalAccessGrantedAt: args.grantedAt,
					}
				: client
		);
		await ctx.db.patch(args.projectId, { clients });
	},
});

/** Removes the portal link from a project client. */
export const unlinkClientPortalUser = internalMutation({
	args: {
		projectId: v.id('projects'),
		email: v.string(),
	},
	handler: async (ctx, args) => {
		const project = await ctx.db.get(args.projectId);
		if (!project) {
			return;
		}
		const target = normalizeClientEmail(args.email);
		const clients = project.clients.map((client) =>
			normalizeClientEmail(client.email) === target
				? {
						...client,
						portalUserId: undefined,
						portalAccessGrantedAt: undefined,
					}
				: client
		);
		await ctx.db.patch(args.projectId, { clients });
	},
});

/**
 * Counts how many project clients (across all projects) reference a given Clerk
 * portal user. Used to decide whether the Clerk user can be safely deleted.
 */
export const countPortalUserReferences = internalQuery({
	args: { portalUserId: v.string() },
	returns: v.number(),
	handler: async (ctx, args) => {
		const projects = await ctx.db.query('projects').collect();
		let count = 0;
		for (const project of projects) {
			for (const client of project.clients) {
				if (client.portalUserId === args.portalUserId) {
					count += 1;
				}
			}
		}
		return count;
	},
});
