import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildVendorSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getVendorOrThrow, parseVendorName } from './shared';

export const update = mutation({
	args: {
		vendorId: v.id('vendors'),
		name: v.string(),
		description: v.optional(v.string()),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getVendorOrThrow(ctx, args.vendorId);
		const name = parseVendorName(args.name);
		const description = args.description?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildVendorSearchText(name, description, link);
		await ctx.db.patch(args.vendorId, { name, description, link, searchText });
		return args.vendorId;
	},
});
