import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

export function parseMaterialVariantName(name: string): string {
	const trimmed = name.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_NAME',
			message: 'Variant name is required',
		});
	}
	return trimmed;
}

export async function getMaterialVariantOrThrow(
	ctx: MutationCtx,
	variantId: Id<'materialVariants'>
) {
	const variant = await ctx.db.get(variantId);
	if (!variant) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Material variant not found',
		});
	}
	return variant;
}

export async function syncMaterialVariantCounts(
	ctx: MutationCtx,
	materialId: Id<'materials'>
) {
	const variants = await ctx.db
		.query('materialVariants')
		.withIndex('by_material', (q) => q.eq('materialId', materialId))
		.collect();
	await ctx.db.patch(materialId, { variantCount: variants.length });
}

export async function syncVariantItemCount(
	ctx: MutationCtx,
	variantId: Id<'materialVariants'>
) {
	const items = await ctx.db
		.query('materialItems')
		.withIndex('by_material_variant', (q) =>
			q.eq('materialVariantId', variantId)
		)
		.collect();
	await ctx.db.patch(variantId, { itemCount: items.length });
}
