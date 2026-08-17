import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteTermSectionSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getQuoteTermSectionOrThrow,
	parseQuoteTermSectionName,
	syncItemSearchTextsForSection,
} from './shared';

export const update = mutation({
	args: {
		sectionId: v.id('quoteTermSections'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteTermSectionOrThrow(ctx, args.sectionId);
		const name = parseQuoteTermSectionName(args.name);
		await ctx.db.patch(args.sectionId, {
			name,
			searchText: buildQuoteTermSectionSearchText(name),
		});
		// Clause search text embeds the section name.
		await syncItemSearchTextsForSection(ctx, args.sectionId, name);
		return args.sectionId;
	},
});
