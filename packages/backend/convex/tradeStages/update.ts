import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTradeStageSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow, parseStageName } from './shared';

export const update = mutation({
	args: {
		stageId: v.id('tradeStages'),
		name: v.string(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);
		const name = parseStageName(args.name);
		const searchText = buildTradeStageSearchText(name);
		await ctx.db.patch(args.stageId, { name, searchText });
		return args.stageId;
	},
});
