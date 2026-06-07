import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialColorSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseMaterialColorName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseMaterialColorName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildMaterialColorSearchText(name, description);
		return await ctx.db.insert('materialColors', {
			name,
			description,
			searchText,
		});
	},
});
