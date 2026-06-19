import { v } from 'convex/values';
import { mutation } from '../../_generated/server';
import { requireProjectClient } from '../../lib/clientAccess';
import {
	buildProjectInclusionSearchText,
	getProjectInclusionOrThrow,
} from '../../projectInclusions/shared';
import { projectInclusionStatusValidator } from '../../schema';

export const setStatus = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
		status: projectInclusionStatusValidator,
	},
	handler: async (ctx, args) => {
		const existing = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		await requireProjectClient(ctx, existing.projectId);

		const searchText = buildProjectInclusionSearchText(existing.title, {
			code: existing.code,
			vendor: existing.vendor,
			models: existing.models,
			color: existing.color,
			locations: existing.locations,
			status: args.status,
		});

		await ctx.db.patch(args.projectInclusionId, {
			status: args.status,
			searchText,
		});
		return args.projectInclusionId;
	},
});
