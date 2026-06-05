import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildLocationSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getLocationOrThrow, parseLocationName } from './shared';

export const update = mutation({
	args: {
		locationId: v.id('locations'),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getLocationOrThrow(ctx, args.locationId);
		const name = parseLocationName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildLocationSearchText(name, description);
		await ctx.db.patch(args.locationId, { name, description, searchText });
		return args.locationId;
	},
});
