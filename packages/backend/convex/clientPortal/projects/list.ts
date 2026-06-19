import { query } from '../../_generated/server';
import { checkIdentity } from '../../lib/checkIdentity';

export const list = query({
	args: {},
	handler: async (ctx) => {
		const identity = await checkIdentity(ctx);
		const projects = await ctx.db.query('projects').order('desc').collect();
		const owned = projects.filter((project) =>
			project.clients.some(
				(client) =>
					client.portalUserId && client.portalUserId === identity.subject
			)
		);
		return owned.sort((a, b) =>
			a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
		);
	},
});
