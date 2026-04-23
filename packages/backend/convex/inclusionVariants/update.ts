import { ConvexError, v } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import { type MutationCtx, mutation } from '../_generated/server';
import {
	getInclusionOrThrow,
	syncSearchTextsForInclusion,
} from '../inclusions/shared';
import { requireAdmin } from '../lib/checkIdentity';
import { inclusionVariantClassValidator } from '../schema';
import {
	deleteVariantStorageIfPresent,
	type InclusionVariantClass,
	parseModels,
	parseMoney2,
	parseOptionalDetail,
	parseVendor,
} from './shared';

interface VariantPatchArgs {
	class?: InclusionVariantClass | undefined;
	costPrice?: number | undefined;
	details?: string | null | undefined;
	image?: string | null | undefined;
	link?: string | null | undefined;
	models?: string[] | undefined;
	salePrice?: number | undefined;
	storageId?: Id<'_storage'> | null | undefined;
	vendor?: string | undefined;
}

async function applyStorageAndImagePatch(
	ctx: MutationCtx,
	existing: Doc<'inclusionVariants'>,
	args: VariantPatchArgs,
	patch: Record<string, unknown>
) {
	if (args.storageId === undefined && args.image === undefined) {
		return;
	}

	if (args.storageId !== undefined) {
		const nextStorageId = args.storageId === null ? undefined : args.storageId;
		if (existing.storageId && existing.storageId !== nextStorageId) {
			await deleteVariantStorageIfPresent(ctx, existing.storageId);
		}
		patch.storageId = nextStorageId;
		if (args.storageId === null && args.image === undefined) {
			patch.image = undefined;
		}
	}
	if (args.image !== undefined) {
		patch.image =
			args.image === null ? undefined : parseOptionalDetail(args.image);
	}
}

function buildScalarVariantPatch(
	args: VariantPatchArgs
): Record<string, unknown> {
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
	if (args.details !== undefined) {
		patch.details =
			args.details === null ? undefined : parseOptionalDetail(args.details);
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
		details: v.optional(v.union(v.string(), v.null())),
		image: v.optional(v.union(v.string(), v.null())),
		storageId: v.optional(v.union(v.id('_storage'), v.null())),
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

		const patch: Record<string, unknown> = {
			...buildScalarVariantPatch(args),
		};
		await applyStorageAndImagePatch(ctx, existing, args, patch);

		await ctx.db.patch(args.variantId, patch);
		await syncSearchTextsForInclusion(ctx, existing.inclusionId);
		return args.variantId;
	},
});
