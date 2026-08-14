import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildBudgetTemplateSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	applyDefaultContingency,
	getTemplateOrThrow,
	parseContingencyPercent,
	parseTemplateTitle,
	recomputeTemplateTotal,
} from './shared';

export const update = mutation({
	args: {
		budgetTemplateId: v.id('budgetTemplates'),
		title: v.string(),
		description: v.optional(v.string()),
		defaultContingencyPercent: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const template = await getTemplateOrThrow(ctx, args.budgetTemplateId);
		const title = parseTemplateTitle(args.title);
		const description = args.description?.trim() || undefined;
		const searchText = buildBudgetTemplateSearchText(title, description);
		const defaultContingencyPercent =
			args.defaultContingencyPercent === undefined
				? undefined
				: parseContingencyPercent(args.defaultContingencyPercent);
		await ctx.db.patch(args.budgetTemplateId, {
			title,
			description,
			searchText,
			...(defaultContingencyPercent === undefined
				? {}
				: { defaultContingencyPercent }),
		});

		// Only push the default down when it actually changed, so re-saving the
		// title doesn't wipe per-trade contingency overrides.
		const changed =
			defaultContingencyPercent !== undefined &&
			defaultContingencyPercent !== (template.defaultContingencyPercent ?? 0);
		if (changed) {
			await applyDefaultContingency(
				ctx,
				args.budgetTemplateId,
				defaultContingencyPercent
			);
			await recomputeTemplateTotal(ctx, args.budgetTemplateId);
		}
		return args.budgetTemplateId;
	},
});
