import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTemplateOrThrow } from './shared';

export const remove = mutation({
	args: {
		templateId: v.id('emailTemplates'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.templateId);
		await ctx.db.delete(args.templateId);
		return args.templateId;
	},
});
