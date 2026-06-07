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
	getProjectOrThrow,
	getStandardVariantOrThrow,
	validateVariationFields,
} from './shared';

export const add = mutation({
	args: {
		projectId: v.id('projects'),
		inclusionVariantId: v.id('inclusionVariants'),
		locations: v.optional(
			v.array(
				v.object({
					name: v.string(),
					quantity: v.optional(v.number()),
					unit: v.optional(v.string()),
				})
			)
		),
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
		const { variationPrice } = buildVariationFromStandard(
			variant.class,
			salePrice,
			standardVariant.salePrice
		);
		validateVariationFields(variant.class, variationPrice);

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
			link,
			costPrice,
			salePrice,
			variationPrice,
			locations: args.locations,
			searchText,
			status: 'Under Review' as const,
		};

		return await ctx.db.insert('projectInclusions', nextValues);
	},
});
