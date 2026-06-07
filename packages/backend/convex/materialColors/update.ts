import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialColorSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialColorOrThrow, parseMaterialColorName } from './shared';

export const update = mutation({
	args: {
		materialColorId: v.id('materialColors'),
		name: v.string(),
		description: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getMaterialColorOrThrow(ctx, args.materialColorId);
		const name = parseMaterialColorName(args.name);
		const description = args.description?.trim() || undefined;
		const searchText = buildMaterialColorSearchText(name, description);
		await ctx.db.patch(args.materialColorId, { name, description, searchText });
		return args.materialColorId;
	},
});
