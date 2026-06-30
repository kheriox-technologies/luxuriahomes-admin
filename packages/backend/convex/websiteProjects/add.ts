import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	buildWebsiteProjectSearchText,
	websiteProjectStatusValidator,
} from './shared';

export const add = mutation({
	args: {
		name: v.string(),
		description: v.optional(v.string()),
		status: websiteProjectStatusValidator,
		completedYear: v.optional(v.number()),
		beds: v.optional(v.number()),
		baths: v.optional(v.number()),
		powder: v.optional(v.number()),
		cars: v.optional(v.number()),
		living: v.optional(v.number()),
		study: v.optional(v.number()),
		landArea: v.optional(v.number()),
		buildingArea: v.optional(v.number()),
		hasPool: v.optional(v.boolean()),
		hasMediaRoom: v.optional(v.boolean()),
		include: v.optional(v.boolean()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const name = args.name.trim();
		if (name === '') {
			throw new ConvexError({
				code: 'NAME_REQUIRED',
				message: 'Project name is required',
			});
		}
		const description = args.description?.trim() || undefined;
		const searchText = buildWebsiteProjectSearchText({
			name,
			description,
			status: args.status,
			completedYear: args.completedYear,
		});
		return await ctx.db.insert('websiteProjects', {
			name,
			description,
			status: args.status,
			completedYear: args.completedYear,
			beds: args.beds,
			baths: args.baths,
			powder: args.powder,
			cars: args.cars,
			living: args.living,
			study: args.study,
			landArea: args.landArea,
			buildingArea: args.buildingArea,
			hasPool: args.hasPool,
			hasMediaRoom: args.hasMediaRoom,
			include: args.include ?? false,
			searchText,
		});
	},
});
