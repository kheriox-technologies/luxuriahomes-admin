import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	deleteNotesForProjectInclusion,
	deleteProjectInclusionStorageIfPresent,
	getProjectInclusionOrThrow,
} from './shared';

export const remove = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const existing = await getProjectInclusionOrThrow(
			ctx,
			args.projectInclusionId
		);
		await deleteProjectInclusionStorageIfPresent(ctx, existing.storageId);
		await deleteNotesForProjectInclusion(ctx, args.projectInclusionId);
		await ctx.db.delete(args.projectInclusionId);
		return args.projectInclusionId;
	},
});
