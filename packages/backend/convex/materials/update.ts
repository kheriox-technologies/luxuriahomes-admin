import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow } from '../trades/shared';
import {
	getMaterialOrThrow,
	parseMaterialName,
	parseMaterialPrice,
	parseMaterialVendor,
	syncMaterialSearchText,
} from './shared';

export const update = mutation({
	args: {
		materialId: v.id('materials'),
		name: v.string(),
		description: v.optional(v.string()),
		tradeId: v.id('trades'),
		unit: v.id('units'),
		price: v.number(),
		vendor: v.string(),
		sku: v.optional(v.string()),
		link: v.optional(v.string()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getMaterialOrThrow(ctx, args.materialId);
		await getTradeOrThrow(ctx, args.tradeId);
		const unit = await ctx.db.get(args.unit);
		if (!unit) {
			throw new ConvexError({ code: 'NOT_FOUND', message: 'Unit not found' });
		}
		const name = parseMaterialName(args.name);
		const price = parseMaterialPrice(args.price);
		const vendor = parseMaterialVendor(args.vendor);
		const description = args.description?.trim() || undefined;
		const sku = args.sku?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		await ctx.db.patch(args.materialId, {
			name,
			description,
			tradeId: args.tradeId,
			unit: args.unit,
			price,
			vendor,
			sku,
			link,
		});
		await syncMaterialSearchText(ctx, args.materialId);
		return args.materialId;
	},
});
