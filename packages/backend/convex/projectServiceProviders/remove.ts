import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const remove = mutation({
	args: {
		projectId: v.id('projects'),
		serviceProviderId: v.id('serviceProviders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const link = await ctx.db
			.query('projectServiceProviders')
			.withIndex('by_project_and_service_provider', (q) =>
				q
					.eq('projectId', args.projectId)
					.eq('serviceProviderId', args.serviceProviderId)
			)
			.first();
		if (!link) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Service provider is not linked to this project',
			});
		}
		await ctx.db.delete(link._id);
		return link._id;
	},
});
