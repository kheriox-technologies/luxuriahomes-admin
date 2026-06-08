import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getServiceProviderOrThrow } from './shared';

export const remove = mutation({
	args: {
		serviceProviderId: v.id('serviceProviders'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getServiceProviderOrThrow(ctx, args.serviceProviderId);
		const links = await ctx.db
			.query('projectServiceProviders')
			.withIndex('by_service_provider', (q) =>
				q.eq('serviceProviderId', args.serviceProviderId)
			)
			.collect();
		for (const link of links) {
			await ctx.db.delete(link._id);
		}
		await ctx.db.delete(args.serviceProviderId);
		return args.serviceProviderId;
	},
});
