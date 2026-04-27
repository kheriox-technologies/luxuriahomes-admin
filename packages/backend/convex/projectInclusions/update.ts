import { v } from 'convex/values';
import type { Doc } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';
import { mutation } from '../_generated/server';
import {
	parseModels,
	parseMoney2,
	parseOptionalDetail,
	parseVendor,
} from '../inclusionVariants/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { inclusionVariantClassValidator } from '../schema';
import {
	buildProjectInclusionSearchText,
	deleteProjectInclusionStorageIfPresent,
	getProjectInclusionOrThrow,
	validateVariationFields,
} from './shared';

interface UpdateArgs {
	categoryId?: Doc<'projectInclusions'>['categoryId'] | undefined;
	class?: Doc<'projectInclusions'>['class'] | undefined;
	code?: string | undefined;
	color?: string | null | undefined;
	costPrice?: number | undefined;
	details?: string | null | undefined;
	image?: string | null | undefined;
	link?: string | null | undefined;
	models?: string[] | undefined;
	projectInclusionId: Doc<'projectInclusions'>['_id'];
	salePrice?: number | undefined;
	storageId?: Doc<'projectInclusions'>['storageId'] | null | undefined;
	title?: string | undefined;
	variationCostPrice?: number | null | undefined;
	variationSalePrice?: number | null | undefined;
	vendor?: string | undefined;
}

function applyIdentityFields(args: UpdateArgs, patch: Record<string, unknown>) {
	if (args.title !== undefined) {
		patch.title = args.title.trim();
	}
	if (args.categoryId !== undefined) {
		patch.categoryId = args.categoryId;
	}
	if (args.class !== undefined) {
		patch.class = args.class;
	}
	if (args.code !== undefined) {
		patch.code = args.code.trim();
	}
}

function applyVendorFields(args: UpdateArgs, patch: Record<string, unknown>) {
	if (args.vendor !== undefined) {
		patch.vendor = parseVendor(args.vendor);
	}
	if (args.models !== undefined) {
		patch.models = parseModels(args.models);
	}
	if (args.color !== undefined) {
		patch.color =
			args.color === null ? undefined : parseOptionalDetail(args.color);
	}
	if (args.details !== undefined) {
		patch.details =
			args.details === null ? undefined : parseOptionalDetail(args.details);
	}
	if (args.link !== undefined) {
		patch.link =
			args.link === null ? undefined : parseOptionalDetail(args.link);
	}
	if (args.image !== undefined) {
		patch.image =
			args.image === null ? undefined : parseOptionalDetail(args.image);
	}
}

function applyPriceFields(args: UpdateArgs, patch: Record<string, unknown>) {
	if (args.costPrice !== undefined) {
		patch.costPrice = parseMoney2(args.costPrice, 'Cost price');
	}
	if (args.salePrice !== undefined) {
		patch.salePrice = parseMoney2(args.salePrice, 'Sale price');
	}
}

function applyVariationFields(
	args: UpdateArgs,
	patch: Record<string, unknown>
) {
	if (args.variationCostPrice !== undefined) {
		patch.variationCostPrice =
			args.variationCostPrice === null
				? undefined
				: parseMoney2(args.variationCostPrice, 'Variation cost price');
	}
	if (args.variationSalePrice !== undefined) {
		patch.variationSalePrice =
			args.variationSalePrice === null
				? undefined
				: parseMoney2(args.variationSalePrice, 'Variation sale price');
	}
}

function buildScalarPatch(args: UpdateArgs): Record<string, unknown> {
	const patch: Record<string, unknown> = {};
	applyIdentityFields(args, patch);
	applyVendorFields(args, patch);
	applyPriceFields(args, patch);
	applyVariationFields(args, patch);
	return patch;
}

async function applyStoragePatch(
	ctx: MutationCtx,
	args: UpdateArgs,
	existing: Doc<'projectInclusions'>,
	patch: Record<string, unknown>
) {
	if (args.storageId === undefined) {
		return;
	}
	const nextStorageId = args.storageId === null ? undefined : args.storageId;
	if (existing.storageId && existing.storageId !== nextStorageId) {
		await deleteProjectInclusionStorageIfPresent(ctx, existing.storageId);
	}
	patch.storageId = nextStorageId;
	if (args.storageId === null && args.image === undefined) {
		patch.image = undefined;
	}
}

function applyVariationPatchRules(
	existing: Doc<'projectInclusions'>,
	patch: Record<string, unknown>
) {
	const nextClass =
		(patch.class as typeof existing.class | undefined) ?? existing.class;
	const nextVariationCost =
		(patch.variationCostPrice as number | undefined) ??
		existing.variationCostPrice;
	const nextVariationSale =
		(patch.variationSalePrice as number | undefined) ??
		existing.variationSalePrice;
	validateVariationFields(nextClass, nextVariationCost, nextVariationSale);
	if (nextClass === 'Standard') {
		patch.variationCostPrice = undefined;
		patch.variationSalePrice = undefined;
	}
}

function applySearchTextPatch(
	existing: Doc<'projectInclusions'>,
	patch: Record<string, unknown>
) {
	const nextTitle = (patch.title as string | undefined) ?? existing.title;
	const nextCode = (patch.code as string | undefined) ?? existing.code;
	const nextVendor = (patch.vendor as string | undefined) ?? existing.vendor;
	const nextModels = (patch.models as string[] | undefined) ?? existing.models;
	const nextColor =
		(patch.color as string | undefined) ??
		(existing.color as string | undefined);
	patch.searchText = buildProjectInclusionSearchText(nextTitle, {
		code: nextCode,
		vendor: nextVendor,
		models: nextModels,
		color: nextColor,
	});
}

export const update = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
		title: v.optional(v.string()),
		categoryId: v.optional(v.id('inclusionCategories')),
		class: v.optional(inclusionVariantClassValidator),
		code: v.optional(v.string()),
		vendor: v.optional(v.string()),
		models: v.optional(v.array(v.string())),
		color: v.optional(v.union(v.string(), v.null())),
		details: v.optional(v.union(v.string(), v.null())),
		image: v.optional(v.union(v.string(), v.null())),
		storageId: v.optional(v.union(v.id('_storage'), v.null())),
		link: v.optional(v.union(v.string(), v.null())),
		costPrice: v.optional(v.number()),
		salePrice: v.optional(v.number()),
		variationCostPrice: v.optional(v.union(v.number(), v.null())),
		variationSalePrice: v.optional(v.union(v.number(), v.null())),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		const patch = buildScalarPatch(args);
		await applyStoragePatch(ctx, args, existing, patch);
		applyVariationPatchRules(existing, patch);
		applySearchTextPatch(existing, patch);

		await ctx.db.patch(args.projectInclusionId, patch);
		return args.projectInclusionId;
	},
});
