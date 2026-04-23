import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	getInclusionOrThrow,
	syncSearchTextsForInclusion,
} from '../inclusions/shared';
import { buildInclusionVariantSearchText } from '../lib/buildSearchText';
import { requireAdmin } from '../lib/checkIdentity';
import { inclusionVariantClassValidator } from '../schema';
import {
	allocateUniqueVariantCode,
	parseModels,
	parseMoney2,
	parseOptionalDetail,
	parseVendor,
} from './shared';

export const add = mutation({
	args: {
		inclusionId: v.id('inclusions'),
		class: inclusionVariantClassValidator,
		vendor: v.string(),
		models: v.array(v.string()),
		details: v.optional(v.string()),
		image: v.optional(v.string()),
		storageId: v.optional(v.id('_storage')),
		link: v.optional(v.string()),
		costPrice: v.number(),
		salePrice: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const inclusion = await getInclusionOrThrow(ctx, args.inclusionId);
		const category = await ctx.db.get(inclusion.categoryId);
		if (!category) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Category not found',
			});
		}

		const vendor = parseVendor(args.vendor);
		const models = parseModels(args.models);
		const details = parseOptionalDetail(args.details);
		const image =
			args.image !== undefined ? parseOptionalDetail(args.image) : undefined;
		const link =
			args.link !== undefined ? parseOptionalDetail(args.link) : undefined;
		const costPrice = parseMoney2(args.costPrice, 'Cost price');
		const salePrice = parseMoney2(args.salePrice, 'Sale price');

		const code = await allocateUniqueVariantCode(ctx, category.code);
		const searchText = buildInclusionVariantSearchText(inclusion.title, {
			code,
			vendor,
			models,
		});

		const variantId = await ctx.db.insert('inclusionVariants', {
			inclusionId: args.inclusionId,
			class: args.class,
			code,
			vendor,
			models,
			details,
			image,
			storageId: args.storageId,
			link,
			costPrice,
			salePrice,
			searchText,
		});

		await syncSearchTextsForInclusion(ctx, args.inclusionId);
		return variantId;
	},
});
