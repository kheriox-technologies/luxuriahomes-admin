import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { getInclusionOrThrow } from '../inclusions/shared';
import {
	parseModels,
	parseMoney2,
	parseOptionalDetail,
	parseVendor,
} from '../inclusionVariants/shared';
import { requireAdmin } from '../lib/checkIdentity';
import {
	buildProjectInclusionSearchText,
	buildVariationFromStandard,
	copyStorageIdIfPresent,
	deleteProjectInclusionStorageIfPresent,
	getProjectOrThrow,
	getStandardVariantOrThrow,
	validateVariationFields,
} from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		inclusionVariantId: v.id('inclusionVariants'),
		forceReplace: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectOrThrow(ctx, args.projectId);

		const variant = await ctx.db.get(args.inclusionVariantId);
		if (!variant) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Inclusion variant not found',
			});
		}

		const inclusion = await getInclusionOrThrow(ctx, variant.inclusionId);
		const costPrice = parseMoney2(variant.costPrice, 'Cost price');
		const salePrice = parseMoney2(variant.salePrice, 'Sale price');
		const standardVariant = await getStandardVariantOrThrow(
			ctx,
			variant.inclusionId
		);
		const { variationCostPrice, variationSalePrice } =
			buildVariationFromStandard(
				variant.class,
				costPrice,
				salePrice,
				standardVariant.costPrice,
				standardVariant.salePrice
			);
		validateVariationFields(
			variant.class,
			variationCostPrice,
			variationSalePrice
		);

		const storageId = await copyStorageIdIfPresent(ctx, variant.storageId);
		const title = inclusion.title.trim();
		const code = variant.code.trim();
		const vendor = parseVendor(variant.vendor);
		const models = parseModels(variant.models);
		const color =
			variant.color !== undefined
				? parseOptionalDetail(variant.color)
				: undefined;
		const details = parseOptionalDetail(variant.details);
		const image =
			variant.image !== undefined
				? parseOptionalDetail(variant.image)
				: undefined;
		const link =
			variant.link !== undefined
				? parseOptionalDetail(variant.link)
				: undefined;
		const searchText = buildProjectInclusionSearchText(title, {
			code,
			vendor,
			models,
			color,
		});
		const existingInclusions = await ctx.db
			.query('projectInclusions')
			.withIndex('by_project', (q) => q.eq('projectId', args.projectId))
			.collect();
		const existingForInclusion = existingInclusions.find(
			(entry) =>
				entry.title === title &&
				entry.categoryId === inclusion.categoryId &&
				entry.vendor === vendor
		);
		if (
			existingForInclusion &&
			existingForInclusion.class === variant.class &&
			existingForInclusion.code === code
		) {
			throw new ConvexError({
				code: 'ALREADY_EXISTS',
				message: 'This inclusion variant has already been added to the project',
			});
		}
		if (existingForInclusion && !args.forceReplace) {
			throw new ConvexError({
				code: 'REPLACE_REQUIRED',
				message: `${existingForInclusion.class} variant for this inclusion is already added. Do you want to replace it with the current variant?`,
			});
		}

		const nextValues = {
			projectId: args.projectId,
			title,
			categoryId: inclusion.categoryId,
			class: variant.class,
			code,
			vendor,
			models,
			color,
			details,
			image,
			storageId,
			link,
			costPrice,
			salePrice,
			variationCostPrice,
			variationSalePrice,
			searchText,
			status: 'Under Review' as const,
		};
		if (existingForInclusion) {
			await deleteProjectInclusionStorageIfPresent(
				ctx,
				existingForInclusion.storageId
			);
			await ctx.db.patch(existingForInclusion._id, nextValues);
			return existingForInclusion._id;
		}

		return await ctx.db.insert('projectInclusions', nextValues);
	},
});
