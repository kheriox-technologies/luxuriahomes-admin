import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildVendorSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseVendorName } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'vendors'>[] = [];
		for (const raw of args.names) {
			const name = parseVendorName(raw);
			const searchText = buildVendorSearchText(name);
			ids.push(await ctx.db.insert('vendors', { name, searchText }));
		}
		return ids;
	},
});
