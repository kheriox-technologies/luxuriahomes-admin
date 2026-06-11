import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialItemSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import {
	getMaterialVariantOrThrow,
	syncVariantItemCount,
} from '../materialVariants/shared';
import { parseMaterialItemName } from './shared';

export const add = mutation({
	args: {
		materialVariantId: v.id('materialVariants'),
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
		const variant = await getMaterialVariantOrThrow(
			ctx,
			args.materialVariantId
		);
		const name = parseMaterialItemName(args.name);
		const vendor = args.vendor.trim();
		if (!vendor) {
			throw new ConvexError({
				code: 'INVALID_VENDOR',
				message: 'Vendor is required',
			});
		}
		const unit = await ctx.db.get(args.unit);
		if (!unit) {
			throw new ConvexError({ code: 'NOT_FOUND', message: 'Unit not found' });
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
		const itemId = await ctx.db.insert('materialItems', {
			materialVariantId: args.materialVariantId,
			name,
			description,
			vendor,
			unit: args.unit,
			quantity: args.quantity,
			sku,
			link,
			searchText,
		});
		await syncVariantItemCount(ctx, args.materialVariantId);
		return itemId;
	},
});
