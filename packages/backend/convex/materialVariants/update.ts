import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialVariantSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialOrThrow } from '../materials/shared';
import { getMaterialVariantOrThrow, parseMaterialVariantName } from './shared';

export const update = mutation({
	args: {
		variantId: v.id('materialVariants'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getMaterialVariantOrThrow(ctx, args.variantId);
		const material = await getMaterialOrThrow(ctx, existing.materialId);
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
		await ctx.db.patch(args.variantId, {
			name,
			description,
			vendor,
			link,
			searchText,
		});
		return args.variantId;
	},
});
