import { v } from 'convex/values';
import { query } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const get = query({
	args: { templateId: v.id('quoteTemplates') },
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		return await ctx.db.get(args.templateId);
	},
});
