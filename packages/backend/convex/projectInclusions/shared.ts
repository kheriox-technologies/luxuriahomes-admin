import { ConvexError } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { buildInclusionVariantSearchText } from '../lib/buildSearchText';

type ReadCtx = MutationCtx | QueryCtx;

function roundMoney(value: number): number {
	return Math.round(value * 100) / 100;
}

export function buildProjectInclusionSearchText(
	title: string,
	fields: Pick<Doc<'projectInclusions'>, 'code' | 'vendor' | 'models' | 'color'>
): string {
	return buildInclusionVariantSearchText(title, fields);
}

export async function getProjectOrThrow(
	ctx: ReadCtx,
	projectId: Id<'projects'>
) {
	const project = await ctx.db.get(projectId);
	if (!project) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Project not found',
		});
	}
	return project;
}

export async function getProjectInclusionOrThrow(
	ctx: ReadCtx,
	projectInclusionId: Id<'projectInclusions'>
) {
	const row = await ctx.db.get(projectInclusionId);
	if (!row) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Project inclusion not found',
		});
	}
	return row;
}

export async function getStandardVariantOrThrow(
	ctx: ReadCtx,
	inclusionId: Id<'inclusions'>
) {
	const variants = await ctx.db
		.query('inclusionVariants')
		.withIndex('by_inclusion', (q) => q.eq('inclusionId', inclusionId))
		.collect();
	const standard = variants.find((v) => v.class === 'Standard');
	if (!standard) {
		throw new ConvexError({
			code: 'STANDARD_VARIANT_REQUIRED',
			message: 'A Standard inclusion variant is required to compute variation',
		});
	}
	return standard;
}

export function copyStorageIdIfPresent(
	_ctx: MutationCtx,
	storageId: Id<'_storage'> | undefined
) {
	if (!storageId) {
		return undefined;
	}
	return storageId;
}

export function deleteProjectInclusionStorageIfPresent(
	_ctx: MutationCtx,
	_storageId: Id<'_storage'> | undefined
) {
	return undefined;
}

export function buildVariationFromStandard(
	className: Doc<'projectInclusions'>['class'],
	costPrice: number,
	salePrice: number,
	standardCostPrice: number,
	standardSalePrice: number
) {
	if (className === 'Standard') {
		return {
			variationCostPrice: undefined,
			variationSalePrice: undefined,
		};
	}
	return {
		variationCostPrice: roundMoney(costPrice - standardCostPrice),
		variationSalePrice: roundMoney(salePrice - standardSalePrice),
	};
}

export function validateVariationFields(
	className: Doc<'projectInclusions'>['class'],
	variationCostPrice: number | undefined,
	variationSalePrice: number | undefined
) {
	if (className === 'Standard') {
		if (variationCostPrice !== undefined || variationSalePrice !== undefined) {
			throw new ConvexError({
				code: 'INVALID_VARIATION',
				message: 'Standard class cannot have variation prices',
			});
		}
		return;
	}

	if (variationCostPrice === undefined || variationSalePrice === undefined) {
		throw new ConvexError({
			code: 'INVALID_VARIATION',
			message: 'Variation prices are required for non-standard classes',
		});
	}
}
