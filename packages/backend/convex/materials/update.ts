import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getMaterialOrThrow,
	parseMaterialName,
	syncMaterialSearchText,
} from './shared';

export const update = mutation({
	args: {
		materialId: v.id('materials'),
		name: v.string(),
		description: v.optional(v.string()),
		unit: v.id('units'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getMaterialOrThrow(ctx, args.materialId);
		const unit = await ctx.db.get(args.unit);
		if (!unit) {
			throw new ConvexError({ code: 'NOT_FOUND', message: 'Unit not found' });
		}
		const name = parseMaterialName(args.name);
		const description = args.description?.trim() || undefined;
		await ctx.db.patch(args.materialId, { name, description, unit: args.unit });
		await syncMaterialSearchText(ctx, args.materialId);
		return args.materialId;
	},
});
