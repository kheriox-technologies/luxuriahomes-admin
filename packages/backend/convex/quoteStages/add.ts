import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { createQuoteStage } from './shared';

export const add = mutation({
	args: {
		templateId: v.id('quoteTemplates'),
		name: v.string(),
		defaultPercent: v.optional(v.number()),
		scopeSummary: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await createQuoteStage(ctx, args.templateId, args.name, {
			defaultPercent: args.defaultPercent,
			scopeSummary: args.scopeSummary,
		});
	},
});
