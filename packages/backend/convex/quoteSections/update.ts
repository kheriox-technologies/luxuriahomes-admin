import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteSectionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getQuoteStageOrThrow } from '../quoteStages/shared';
import {
	getQuoteSectionOrThrow,
	nextQuoteSectionOrder,
	parseQuoteSectionName,
	syncItemSearchTextsForSection,
} from './shared';

export const update = mutation({
	args: {
		sectionId: v.id('quoteSections'),
		name: v.string(),
		// When present and different, the section moves to this stage and is
		// appended to the end of it.
		stageId: v.optional(v.id('quoteStages')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const section = await getQuoteSectionOrThrow(ctx, args.sectionId);
		const name = parseQuoteSectionName(args.name);
		const stageId = args.stageId ?? section.stageId;
		const stage = await getQuoteStageOrThrow(ctx, stageId);

		const patch: {
			name: string;
			searchText: string;
			order?: number;
			stageId?: typeof stageId;
		} = {
			name,
			searchText: buildQuoteSectionSearchText(name, stage.name),
		};
		if (stageId !== section.stageId) {
			patch.stageId = stageId;
			patch.order = await nextQuoteSectionOrder(ctx, stageId);
		}
		await ctx.db.patch(args.sectionId, patch);
		// Item search text embeds both the section and stage name.
		await syncItemSearchTextsForSection(ctx, args.sectionId, name, stage.name);
		return args.sectionId;
	},
});
