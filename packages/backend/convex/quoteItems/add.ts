import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteSectionOrThrow } from '../quoteSections/shared';
import { getQuoteStageOrThrow } from '../quoteStages/shared';
import { nextQuoteItemOrder, parseQuoteItemName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		sectionId: v.id('quoteSections'),
		isDefault: v.boolean(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const section = await getQuoteSectionOrThrow(ctx, args.sectionId);
		const stage = await getQuoteStageOrThrow(ctx, section.stageId);
		const name = parseQuoteItemName(args.name);
		return await ctx.db.insert('quoteItems', {
			name,
			sectionId: args.sectionId,
			isDefault: args.isDefault,
			order: await nextQuoteItemOrder(ctx, args.sectionId),
			searchText: buildQuoteItemSearchText(name, section.name, stage.name),
		});
	},
});
