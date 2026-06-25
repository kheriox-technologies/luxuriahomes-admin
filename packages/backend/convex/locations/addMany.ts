import { v } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import { mutation } from '../_generated/server';
import { buildLocationSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseLocationName } from './shared';

export const addMany = mutation({
	args: {
		names: v.array(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const ids: Id<'locations'>[] = [];
		for (const raw of args.names) {
			const name = parseLocationName(raw);
			const searchText = buildLocationSearchText(name);
			ids.push(await ctx.db.insert('locations', { name, searchText }));
		}
		return ids;
	},
});
