import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import {
	getInclusionOrThrow,
	syncSearchTextsForInclusion,
} from '../inclusions/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { inclusionVariantClassValidator } from '../schema';
import {
	type InclusionVariantClass,
	parseModels,
	parseMoney2,
	parseOptionalDetail,
	parseVendor,
} from './shared';

interface VariantPatchArgs {
	class?: InclusionVariantClass | undefined;
	color?: string | null | undefined;
	costPrice?: number | undefined;
	details?: string | null | undefined;
	image?: string | null | undefined;
	link?: string | null | undefined;
	models?: string[] | undefined;
	salePrice?: number | undefined;
	vendor?: string | undefined;
}

function buildVariantPatch(args: VariantPatchArgs): Record<string, unknown> {
	const patch: Record<string, unknown> = {};
	if (args.class !== undefined) {
		patch.class = args.class;
	}
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
	if (args.image !== undefined) {
		patch.image =
			args.image === null ? undefined : parseOptionalDetail(args.image);
	}
	if (args.link !== undefined) {
		patch.link =
			args.link === null ? undefined : parseOptionalDetail(args.link);
	}
	if (args.costPrice !== undefined) {
		patch.costPrice = parseMoney2(args.costPrice, 'Cost price');
	}
	if (args.salePrice !== undefined) {
		patch.salePrice = parseMoney2(args.salePrice, 'Sale price');
	}
	return patch;
}

export const update = mutation({
	args: {
		variantId: v.id('inclusionVariants'),
		class: v.optional(inclusionVariantClassValidator),
		vendor: v.optional(v.string()),
		models: v.optional(v.array(v.string())),
		color: v.optional(v.union(v.string(), v.null())),
		details: v.optional(v.union(v.string(), v.null())),
		image: v.optional(v.union(v.string(), v.null())),
		link: v.optional(v.union(v.string(), v.null())),
		costPrice: v.optional(v.number()),
		salePrice: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await ctx.db.get(args.variantId);
		if (!existing) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Variant not found',
			});
		}

		await getInclusionOrThrow(ctx, existing.inclusionId);

		const patch = buildVariantPatch(args);
		await ctx.db.patch(args.variantId, patch);
		await syncSearchTextsForInclusion(ctx, existing.inclusionId);
		return args.variantId;
	},
});
