import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	buildWebsiteProjectSearchText,
	getWebsiteProjectOrThrow,
	websiteProjectStatusValidator,
} from './shared';

/** Resolves a clearable number patch: `undefined` keeps, `null` clears. */
function resolveNumber(
	next: number | null | undefined,
	existing: number | undefined
): number | undefined {
	if (next === undefined) {
		return existing;
	}
	return next === null ? undefined : next;
}

export const update = mutation({
	args: {
		websiteProjectId: v.id('websiteProjects'),
		name: v.optional(v.string()),
		description: v.optional(v.union(v.string(), v.null())),
		status: v.optional(websiteProjectStatusValidator),
		completedYear: v.optional(v.union(v.number(), v.null())),
		beds: v.optional(v.union(v.number(), v.null())),
		baths: v.optional(v.union(v.number(), v.null())),
		powder: v.optional(v.union(v.number(), v.null())),
		cars: v.optional(v.union(v.number(), v.null())),
		living: v.optional(v.union(v.number(), v.null())),
		study: v.optional(v.union(v.number(), v.null())),
		landArea: v.optional(v.union(v.number(), v.null())),
		buildingArea: v.optional(v.union(v.number(), v.null())),
		hasPool: v.optional(v.boolean()),
		hasMediaRoom: v.optional(v.boolean()),
		include: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getWebsiteProjectOrThrow(ctx, args.websiteProjectId);

		let name = existing.name;
		if (args.name !== undefined) {
			const trimmed = args.name.trim();
			if (trimmed === '') {
				throw new ConvexError({
					code: 'NAME_REQUIRED',
					message: 'Project name is required',
				});
			}
			name = trimmed;
		}

		let description = existing.description;
		if (args.description !== undefined) {
			description =
				args.description === null
					? undefined
					: args.description.trim() || undefined;
		}

		const status = args.status ?? existing.status;
		const completedYear = resolveNumber(
			args.completedYear,
			existing.completedYear
		);
		const include = args.include ?? existing.include;

		const searchText = buildWebsiteProjectSearchText({
			name,
			description,
			status,
			completedYear,
		});

		await ctx.db.patch(args.websiteProjectId, {
			name,
			description,
			status,
			completedYear,
			beds: resolveNumber(args.beds, existing.beds),
			baths: resolveNumber(args.baths, existing.baths),
			powder: resolveNumber(args.powder, existing.powder),
			cars: resolveNumber(args.cars, existing.cars),
			living: resolveNumber(args.living, existing.living),
			study: resolveNumber(args.study, existing.study),
			landArea: resolveNumber(args.landArea, existing.landArea),
			buildingArea: resolveNumber(args.buildingArea, existing.buildingArea),
			hasPool: args.hasPool ?? existing.hasPool,
			hasMediaRoom: args.hasMediaRoom ?? existing.hasMediaRoom,
			include,
			searchText,
		});
		return args.websiteProjectId;
	},
});
