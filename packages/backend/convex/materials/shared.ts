import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
	buildMaterialSearchText,
	buildMaterialVariantSearchText,
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
	const unitAbbr = unit?.abbr;

	const variants = await ctx.db
		.query('materialVariants')
		.withIndex('by_material', (q) => q.eq('materialId', materialId))
		.collect();

	const variantCount = variants.length;
	const searchText = buildMaterialSearchText(
		material.name,
		material.description,
		unitAbbr
	);
	await ctx.db.patch(materialId, { searchText, variantCount });

	for (const variant of variants) {
		const variantSearchText = buildMaterialVariantSearchText(
			material.name,
			variant.name,
			variant.vendor,
			variant.description
		);
		await ctx.db.patch(variant._id, { searchText: variantSearchText });
	}
}
