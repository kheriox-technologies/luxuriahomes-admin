import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseTradeName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseTradeName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildTradeSearchText(name, description);
		return await ctx.db.insert('trades', { name, description, searchText });
	},
});
