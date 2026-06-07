import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildLocationSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseLocationName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseLocationName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildLocationSearchText(name, description);
		return await ctx.db.insert('locations', { name, description, searchText });
	},
});
