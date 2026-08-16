import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildQuoteStageSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { syncSearchTextsForStage } from '../quoteSections/shared';
import { getQuoteStageOrThrow, parseQuoteStageName } from './shared';

export const update = mutation({
	args: {
		stageId: v.id('quoteStages'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getQuoteStageOrThrow(ctx, args.stageId);
		const name = parseQuoteStageName(args.name);
		await ctx.db.patch(args.stageId, {
			name,
			searchText: buildQuoteStageSearchText(name),
		});
		// Section and item search text embed the stage name, so they go stale on rename.
		await syncSearchTextsForStage(ctx, args.stageId, name);
		return args.stageId;
	},
});
