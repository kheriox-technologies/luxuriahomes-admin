import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialVariantSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialOrThrow } from '../materials/shared';
import { parseMaterialVariantName, syncMaterialVariantCounts } from './shared';

export const add = mutation({
	args: {
		materialId: v.id('materials'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const material = await getMaterialOrThrow(ctx, args.materialId);
		const name = parseMaterialVariantName(args.name);
		const vendor = args.vendor.trim();
		if (!vendor) {
			throw new ConvexError({
				code: 'INVALID_VENDOR',
				message: 'Vendor is required',
			});
		}
		const description = args.description?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildMaterialVariantSearchText(
			material.name,
			name,
			vendor,
			description
		);
		const variantId = await ctx.db.insert('materialVariants', {
			materialId: args.materialId,
			name,
			description,
			vendor,
			link,
			itemCount: 0,
			searchText,
		});
		await syncMaterialVariantCounts(ctx, args.materialId);
		return variantId;
	},
});
