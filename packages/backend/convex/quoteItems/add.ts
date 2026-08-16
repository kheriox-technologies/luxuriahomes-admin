import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteSectionOrThrow } from '../quoteSections/shared';
import { getQuoteStageOrThrow } from '../quoteStages/shared';
import {
	nextQuoteItemOrder,
	parseQuoteItemDescription,
	parseQuoteItemName,
} from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		sectionId: v.id('quoteSections'),
		isDefault: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const section = await getQuoteSectionOrThrow(ctx, args.sectionId);
		const stage = await getQuoteStageOrThrow(ctx, section.stageId);
		const name = parseQuoteItemName(args.name);
		const description = parseQuoteItemDescription(args.description);
		return await ctx.db.insert('quoteItems', {
			name,
			description,
			sectionId: args.sectionId,
			isDefault: args.isDefault,
			order: await nextQuoteItemOrder(ctx, args.sectionId),
			searchText: buildQuoteItemSearchText(
				name,
				description,
				section.name,
				stage.name
			),
		});
	},
});
