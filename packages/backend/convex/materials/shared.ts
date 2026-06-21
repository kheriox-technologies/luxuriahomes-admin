import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
	buildMaterialItemSearchText,
	buildMaterialSearchText,
} from '../lib/buildSearchText';

export function parseMaterialName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Material name is required',
		});
	}
	return trimmed;
}

export function parseMaterialVendor(vendor: string): string {
	const trimmed = vendor.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_VENDOR',
			message: 'Vendor is required',
		});
	}
	return trimmed;
}

export function parseMaterialPrice(price: number): number {
	if (!Number.isFinite(price) || price < 0) {
		throw new ConvexError({
			code: 'INVALID_PRICE',
			message: 'Price must be a positive number',
		});
	}
	return Math.round(price * 100) / 100;
}

export async function getMaterialOrThrow(
	ctx: MutationCtx,
	materialId: Id<'materials'>
) {
	const material = await ctx.db.get(materialId);
	if (!material) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Material not found',
		});
	}
	return material;
}

export async function syncMaterialSearchText(
	ctx: MutationCtx,
	materialId: Id<'materials'>
) {
	const material = await ctx.db.get(materialId);
	if (!material) {
		return;
	}

	const unit = await ctx.db.get(material.unit);
	const trade = await ctx.db.get(material.tradeId);

	const searchText = buildMaterialSearchText(material.name, {
		description: material.description,
		unitAbbr: unit?.abbr,
		vendor: material.vendor,
		tradeName: trade?.name,
		sku: material.sku,
	});
	await ctx.db.patch(materialId, { searchText });

	const items = await ctx.db
		.query('materialItems')
		.withIndex('by_material', (q) => q.eq('materialId', materialId))
		.collect();

	for (const item of items) {
		const itemSearchText = buildMaterialItemSearchText(
			material.name,
			item.name,
			item.vendor,
			item.description,
			item.sku
		);
		await ctx.db.patch(item._id, { searchText: itemSearchText });
	}
}
