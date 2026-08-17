import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClientQuotationOrThrow } from './shared';

export const get = query({
	args: {
		quotationId: v.id('clientQuotations'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await getClientQuotationOrThrow(ctx, args.quotationId);
	},
});
