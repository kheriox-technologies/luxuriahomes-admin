import { ConvexError } from 'convex/values';
import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import {
	buildInclusionAggregateSearchText,
	buildInclusionVariantSearchText,
	type InclusionVariantSearchFields,
} from '../lib/buildSearchText';

export function parseInclusionTitle(title: string): string {
	const trimmed = title.trim();
	if (trimmed.length === 0) {
		throw new ConvexError({
			code: 'INVALID_TITLE',
			message: 'Inclusion title is required',
		});
	}
	return trimmed;
}

export async function getInclusionOrThrow(
	ctx: MutationCtx,
	inclusionId: Id<'inclusions'>
) {
	const inclusion = await ctx.db.get(inclusionId);
	if (!inclusion) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Inclusion not found',
		});
	}
	return inclusion;
}

export async function syncSearchTextsForInclusion(
	ctx: MutationCtx,
	inclusionId: Id<'inclusions'>
) {
	const inclusion = await ctx.db.get(inclusionId);
	if (!inclusion) {
		return;
	}
	const variants = await ctx.db
		.query('inclusionVariants')
		.withIndex('by_inclusion', (q) => q.eq('inclusionId', inclusionId))
		.collect();

	const fieldsList: InclusionVariantSearchFields[] = variants.map((v) => ({
		code: v.code,
		vendor: v.vendor,
		models: v.models,
	}));

	const parentSearch = buildInclusionAggregateSearchText(
		inclusion.title,
		fieldsList
	);
	const variantCount = variants.length;
	await ctx.db.patch(inclusionId, { searchText: parentSearch, variantCount });

	for (const variant of variants) {
		const searchText = buildInclusionVariantSearchText(inclusion.title, {
			code: variant.code,
			vendor: variant.vendor,
			models: variant.models,
		});
		await ctx.db.patch(variant._id, { searchText });
	}
}
