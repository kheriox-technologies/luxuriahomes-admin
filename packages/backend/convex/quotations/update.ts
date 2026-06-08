import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { quotationStatusValidator } from '../schema';
import { buildQuotationSearchText, getQuotationOrThrow } from './shared';

export const update = mutation({
	args: {
		quotationId: v.id('quotations'),
		projectId: v.optional(v.id('projects')),
		tradeId: v.optional(v.id('trades')),
		serviceProviderId: v.optional(v.id('serviceProviders')),
		s3Key: v.optional(v.string()),
		price: v.optional(v.number()),
		status: v.optional(quotationStatusValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getQuotationOrThrow(ctx, args.quotationId);

		const projectId = args.projectId ?? existing.projectId;
		const tradeId = args.tradeId ?? existing.tradeId;
		const serviceProviderId =
			args.serviceProviderId ?? existing.serviceProviderId;

		const [trade, project, serviceProvider] = await Promise.all([
			ctx.db.get(tradeId),
			ctx.db.get(projectId),
			ctx.db.get(serviceProviderId),
		]);

		const searchText = buildQuotationSearchText(
			trade?.name ?? '',
			project?.name ?? '',
			serviceProvider?.company ?? ''
		);

		const patch: Record<string, unknown> = { searchText };
		if (args.projectId !== undefined) {
			patch.projectId = args.projectId;
		}
		if (args.tradeId !== undefined) {
			patch.tradeId = args.tradeId;
		}
		if (args.serviceProviderId !== undefined) {
			patch.serviceProviderId = args.serviceProviderId;
		}
		if (args.s3Key !== undefined) {
			patch.s3Key = args.s3Key;
		}
		if (args.price !== undefined) {
			patch.price = args.price;
		}
		if (args.status !== undefined) {
			patch.status = args.status;
		}

		await ctx.db.patch(args.quotationId, patch);
		return args.quotationId;
	},
});
