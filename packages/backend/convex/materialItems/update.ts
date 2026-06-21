import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialOrThrow, parseMaterialPrice } from '../materials/shared';
import { getMaterialItemOrThrow, parseMaterialItemName } from './shared';

export const update = mutation({
	args: {
		itemId: v.id('materialItems'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		unit: v.id('units'),
		price: v.number(),
		quantity: v.optional(v.number()),
		sku: v.optional(v.string()),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getMaterialItemOrThrow(ctx, args.itemId);
		const material = await getMaterialOrThrow(ctx, existing.materialId);
		const name = parseMaterialItemName(args.name);
		const vendor = args.vendor.trim();
		if (!vendor) {
			throw new ConvexError({
				code: 'INVALID_VENDOR',
				message: 'Vendor is required',
			});
		}
		const price = parseMaterialPrice(args.price);
		const description = args.description?.trim() || undefined;
		const sku = args.sku?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildMaterialItemSearchText(
			material.name,
			name,
			vendor,
			description,
			sku
		);
		await ctx.db.patch(args.itemId, {
			name,
			description,
			vendor,
			unit: args.unit,
			price,
			quantity: args.quantity,
			sku,
			link,
			searchText,
		});
		return args.itemId;
	},
});
