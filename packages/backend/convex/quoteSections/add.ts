import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { createQuoteSection } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		stageId: v.id('quoteStages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await createQuoteSection(ctx, args.stageId, args.name);
	},
});
