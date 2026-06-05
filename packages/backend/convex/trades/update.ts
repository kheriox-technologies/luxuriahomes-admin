import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow, parseTradeName } from './shared';

export const update = mutation({
	args: {
		tradeId: v.id('trades'),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getTradeOrThrow(ctx, args.tradeId);
		const name = parseTradeName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildTradeSearchText(name, description);
		await ctx.db.patch(args.tradeId, { name, description, searchText });
		return args.tradeId;
	},
});
