import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import {
	deleteNotesForProjectInclusion,
	getProjectInclusionOrThrow,
} from './shared';

export const remove = mutation({
	args: {
		projectInclusionId: v.id('projectInclusions'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectInclusionOrThrow(ctx, args.projectInclusionId);
		await deleteNotesForProjectInclusion(ctx, args.projectInclusionId);
		await ctx.db.delete(args.projectInclusionId);
		return args.projectInclusionId;
	},
});
