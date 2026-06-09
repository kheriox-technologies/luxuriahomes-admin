import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { quotationStatusValidator } from '../schema';
import { buildQuotationSearchText, getQuotationOrThrow } from './shared';

export const update = mutation({
	args: {
		quotationId: v.id('quotations'),
		projectId: v.optional(v.id('projects')),
		tradeIds: v.optional(v.array(v.id('trades'))),
		serviceProviderId: v.optional(v.id('serviceProviders')),
		s3Key: v.optional(v.string()),
		price: v.optional(v.number()),
		status: v.optional(quotationStatusValidator),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getQuotationOrThrow(ctx, args.quotationId);

		const projectId = args.projectId ?? existing.projectId;
		const tradeIds = args.tradeIds ?? existing.tradeIds;
		const serviceProviderId =
			args.serviceProviderId ?? existing.serviceProviderId;

		const [trades, project, serviceProvider] = await Promise.all([
			Promise.all(tradeIds.map((id) => ctx.db.get(id))),
			ctx.db.get(projectId),
			ctx.db.get(serviceProviderId),
		]);

		const tradeNames = trades.map((t) => t?.name ?? '');
		const searchText = buildQuotationSearchText(
			tradeNames,
			project?.name ?? '',
			serviceProvider?.company ?? ''
		);

		const patch: Record<string, unknown> = { searchText };
		if (args.projectId !== undefined) {
			patch.projectId = args.projectId;
		}
		if (args.tradeIds !== undefined) {
			patch.tradeIds = args.tradeIds;
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
