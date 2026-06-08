import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const list = query({
	args: {
		projectId: v.id('projects'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const links = await ctx.db
			.query('projectServiceProviders')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		const serviceProviders = await Promise.all(
			links.map((link) => ctx.db.get(link.serviceProviderId))
		);
		return serviceProviders.filter(
			(sp): sp is NonNullable<typeof sp> => sp !== null
		);
	},
});
