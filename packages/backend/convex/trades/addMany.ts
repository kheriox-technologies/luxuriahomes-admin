import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildTradeSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseTradeName } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'trades'>[] = [];
		for (const raw of args.names) {
			const name = parseTradeName(raw);
			const searchText = buildTradeSearchText(name);
			ids.push(await ctx.db.insert('trades', { name, searchText }));
		}
		return ids;
	},
});
