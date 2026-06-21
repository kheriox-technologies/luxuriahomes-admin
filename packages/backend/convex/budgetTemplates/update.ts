import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildBudgetTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTemplateOrThrow, parseTemplateTitle } from './shared';

export const update = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
		title: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTemplateOrThrow(ctx, args.budgetTemplateId);
		const title = parseTemplateTitle(args.title);
		const description = args.description?.trim() || undefined;
		const searchText = buildBudgetTemplateSearchText(title, description);
		await ctx.db.patch(args.budgetTemplateId, {
			title,
			description,
			searchText,
		});
		return args.budgetTemplateId;
	},
});
