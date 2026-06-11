import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getMaterialVariantOrThrow } from '../materialVariants/shared';
import { getMaterialItemOrThrow, parseMaterialItemName } from './shared';

export const update = mutation({
	args: {
		itemId: v.id('materialItems'),
		name: v.string(),
		description: v.optional(v.string()),
		vendor: v.string(),
		unit: v.id('units'),
		quantity: v.optional(v.number()),
		sku: v.optional(v.string()),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getMaterialItemOrThrow(ctx, args.itemId);
		const variant = await getMaterialVariantOrThrow(
			ctx,
			existing.materialVariantId
		);
		const name = parseMaterialItemName(args.name);
		const vendor = args.vendor.trim();
		if (!vendor) {
			throw new ConvexError({
				code: 'INVALID_VENDOR',
				message: 'Vendor is required',
			});
		}
		const description = args.description?.trim() || undefined;
		const sku = args.sku?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildMaterialItemSearchText(
			variant.name,
			name,
			vendor,
			description
		);
		await ctx.db.patch(args.itemId, {
			name,
			description,
			vendor,
			unit: args.unit,
			quantity: args.quantity,
			sku,
			link,
			searchText,
		});
		return args.itemId;
	},
});
