import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildVendorSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseVendorName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseVendorName(args.name);
		const description = args.description?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildVendorSearchText(name, description, link);
		return await ctx.db.insert('vendors', {
			name,
			description,
			link,
			searchText,
		});
	},
});
