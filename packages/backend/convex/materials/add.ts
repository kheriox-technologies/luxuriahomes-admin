import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { buildMaterialSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { getTradeOrThrow } from '../trades/shared';
import {
	parseMaterialName,
	parseMaterialPrice,
	parseMaterialVendor,
} from './shared';

export const add = mutation({
	args: {
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
		const name = parseMaterialName(args.name);
		const trade = await getTradeOrThrow(ctx, args.tradeId);
		const unit = await ctx.db.get(args.unit);
		if (!unit) {
			throw new ConvexError({ code: 'NOT_FOUND', message: 'Unit not found' });
		}
		const price = parseMaterialPrice(args.price);
		const vendor = parseMaterialVendor(args.vendor);
		const description = args.description?.trim() || undefined;
		const sku = args.sku?.trim() || undefined;
		const link = args.link?.trim() || undefined;
		const searchText = buildMaterialSearchText(name, {
			description,
			unitAbbr: unit.abbr,
			vendor,
			tradeName: trade.name,
			sku,
		});
		return await ctx.db.insert('materials', {
			name,
			description,
			tradeId: args.tradeId,
			unit: args.unit,
			price,
			vendor,
			sku,
			link,
			searchText,
		});
	},
});
