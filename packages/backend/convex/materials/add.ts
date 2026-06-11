import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { parseMaterialName } from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		unit: v.id('units'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = parseMaterialName(args.name);
		const unit = await ctx.db.get(args.unit);
		if (!unit) {
			throw new ConvexError({ code: 'NOT_FOUND', message: 'Unit not found' });
		}
		const description = args.description?.trim() || undefined;
		const searchText = buildMaterialSearchText(name, description, unit.abbr);
		return await ctx.db.insert('materials', {
			name,
			description,
			unit: args.unit,
			variantCount: 0,
			searchText,
		});
	},
});
