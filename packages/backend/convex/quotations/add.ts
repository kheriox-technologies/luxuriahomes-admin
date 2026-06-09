import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { quotationStatusValidator } from '../schema';
import { buildQuotationSearchText } from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		tradeIds: v.array(v.id('trades')),
		serviceProviderId: v.id('serviceProviders'),
		s3Key: v.optional(v.string()),
		price: v.number(),
		status: quotationStatusValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		const [trades, project, serviceProvider] = await Promise.all([
			Promise.all(args.tradeIds.map((id) => ctx.db.get(id))),
			ctx.db.get(args.projectId),
			ctx.db.get(args.serviceProviderId),
		]);

		for (const trade of trades) {
			if (!trade) {
				throw new ConvexError({
					code: 'NOT_FOUND',
					message: 'Trade not found',
				});
			}
		}
		if (!project) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Project not found',
			});
		}
		if (!serviceProvider) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Service provider not found',
			});
		}

		const tradeNames = trades.map((t) => t?.name ?? '');
		const searchText = buildQuotationSearchText(
			tradeNames,
			project.name,
			serviceProvider.company
		);

		return await ctx.db.insert('quotations', {
			projectId: args.projectId,
			tradeIds: args.tradeIds,
			serviceProviderId: args.serviceProviderId,
			s3Key: args.s3Key,
			price: args.price,
			status: args.status,
			searchText,
		});
	},
});
