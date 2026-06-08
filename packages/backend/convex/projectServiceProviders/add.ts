import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		serviceProviderId: v.id('serviceProviders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db
			.query('projectServiceProviders')
			.withIndex('by_project_and_service_provider', (q) =>
				q
					.eq('projectId', args.projectId)
					.eq('serviceProviderId', args.serviceProviderId)
			)
			.first();
		if (existing) {
			throw new ConvexError({
				code: 'ALREADY_EXISTS',
				message: 'Service provider is already linked to this project',
			});
		}
		return await ctx.db.insert('projectServiceProviders', {
			projectId: args.projectId,
			serviceProviderId: args.serviceProviderId,
		});
	},
});
