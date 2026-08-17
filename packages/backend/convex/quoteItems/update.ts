import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildQuoteItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteSectionOrThrow } from '../quoteSections/shared';
import { getQuoteStageOrThrow } from '../quoteStages/shared';
import {
	getQuoteItemOrThrow,
	nextQuoteItemOrder,
	parseQuoteItemName,
} from './shared';

export const update = mutation({
	args: {
		itemId: v.id('quoteItems'),
		name: v.string(),
		isDefault: v.boolean(),
		// When present and different, the item moves to this section and is appended
		// to the end of it.
		sectionId: v.optional(v.id('quoteSections')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const item = await getQuoteItemOrThrow(ctx, args.itemId);
		const sectionId = args.sectionId ?? item.sectionId;
		const section = await getQuoteSectionOrThrow(ctx, sectionId);
		const stage = await getQuoteStageOrThrow(ctx, section.stageId);
		const name = parseQuoteItemName(args.name);

		const patch: {
			isDefault: boolean;
			name: string;
			order?: number;
			searchText: string;
			sectionId?: Id<'quoteSections'>;
		} = {
			name,
			isDefault: args.isDefault,
			searchText: buildQuoteItemSearchText(name, section.name, stage.name),
		};
		if (sectionId !== item.sectionId) {
			patch.sectionId = sectionId;
			patch.order = await nextQuoteItemOrder(ctx, sectionId);
		}
		await ctx.db.patch(args.itemId, patch);
		return args.itemId;
	},
});
