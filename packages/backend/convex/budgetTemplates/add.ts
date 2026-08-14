import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildBudgetTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	parseContingencyPercent,
	parseTemplateTitle,
	seedMissingTradeItems,
} from './shared';

export const add = mutation({
	args: {
		title: v.string(),
		description: v.optional(v.string()),
		defaultContingencyPercent: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const title = parseTemplateTitle(args.title);
		const description = args.description?.trim() || undefined;
		const searchText = buildBudgetTemplateSearchText(title, description);
		const defaultContingencyPercent =
			args.defaultContingencyPercent === undefined
				? undefined
				: parseContingencyPercent(args.defaultContingencyPercent);
		const budgetTemplateId = await ctx.db.insert('budgetTemplates', {
			title,
			description,
			totalPrice: 0,
			defaultContingencyPercent,
			searchText,
		});
		// Seed a $0 row for every trade so prices can be edited inline.
		await seedMissingTradeItems(ctx, budgetTemplateId);
		return budgetTemplateId;
	},
});
