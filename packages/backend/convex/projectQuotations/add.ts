import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { quotationStatusValidator } from '../schema';
import { insertProjectQuotation } from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		title: v.string(),
		tradeId: v.id('trades'),
		serviceProviderId: v.id('serviceProviders'),
		s3Key: v.optional(v.string()),
		price: v.number(),
		status: quotationStatusValidator,
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await insertProjectQuotation(ctx, args);
	},
});
