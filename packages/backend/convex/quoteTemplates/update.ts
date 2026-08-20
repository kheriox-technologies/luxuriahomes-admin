import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteTemplateOrThrow, parseQuoteTemplateName } from './shared';

export const update = mutation({
	args: {
		templateId: v.id('quoteTemplates'),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteTemplateOrThrow(ctx, args.templateId);
		const name = parseQuoteTemplateName(args.name);
		const description = args.description?.trim() || undefined;
		await ctx.db.patch(args.templateId, {
			description,
			name,
			searchText: buildQuoteTemplateSearchText(name, description),
		});
		return args.templateId;
	},
});
