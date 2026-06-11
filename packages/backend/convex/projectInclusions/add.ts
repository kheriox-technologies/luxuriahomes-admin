import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { getInclusionOrThrow } from '../inclusions/shared';
import {
	parseModels,
	parseMoney2,
	parseOptionalDetail,
	parseVendor,
} from '../inclusionVariants/shared';
import { buildProjectOrderSearchText } from '../lib/buildSearchText';
import { checkIdentity, requireAdmin } from '../lib/checkIdentity';
import { addedByFromIdentity } from '../projectOrders/shared';
import {
	buildProjectInclusionSearchText,
	buildVariationFromStandard,
	getProjectOrThrow,
	getStandardVariantOrThrow,
	roundMoney,
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
		const { variationPrice: perUnitVariationPrice } =
			buildVariationFromStandard(
				variant.class,
				salePrice,
				standardVariant.salePrice
			);
		validateVariationFields(variant.class, perUnitVariationPrice);

		const totalQuantity = args.locations
			? args.locations.reduce((sum, loc) => sum + (loc.quantity ?? 0), 0)
			: 0;
		const variationPrice =
			perUnitVariationPrice !== undefined && totalQuantity > 0
				? roundMoney(perUnitVariationPrice * totalQuantity)
				: perUnitVariationPrice;

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
			locations: args.locations,
			status: 'Under Review',
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

		const projectInclusionId = await ctx.db.insert(
			'projectInclusions',
			nextValues
		);

		if (totalQuantity > 0) {
			const identity = await checkIdentity(ctx);
			const orderUnit = args.locations?.find((loc) => loc.unit)?.unit ?? '';
			const orderDescription = color || undefined;
			const orderSearchText = buildProjectOrderSearchText(
				title,
				vendor,
				orderDescription
			);
			const orderId = await ctx.db.insert('projectOrders', {
				projectId: args.projectId,
				projectInclusionId,
				name: title,
				description: orderDescription,
				vendor,
				quantity: totalQuantity,
				unit: orderUnit,
				link,
				status: 'Pending',
				searchText: orderSearchText,
			});
			await ctx.db.insert('projectOrderStatusHistory', {
				orderId,
				status: 'Pending',
				label: 'Order Added',
				changedBy: addedByFromIdentity(identity),
				timestamp: Date.now(),
			});
		}

		return projectInclusionId;
	},
});
