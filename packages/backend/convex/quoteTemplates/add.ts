import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { nextQuoteTemplateOrder, parseQuoteTemplateName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseQuoteTemplateName(args.name);
		const description = args.description?.trim() || undefined;
		return await ctx.db.insert('quoteTemplates', {
			createdAt: Date.now(),
			description,
			name,
			order: await nextQuoteTemplateOrder(ctx),
			searchText: buildQuoteTemplateSearchText(name, description),
		});
	},
});
