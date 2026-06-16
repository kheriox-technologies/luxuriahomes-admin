import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectStageOrThrow } from './shared';

export const clearDependency = mutation({
	args: {
		stageId: v.id('projectStages'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectStageOrThrow(ctx, args.stageId);
		await ctx.db.patch(args.stageId, {
			dependencyStageId: undefined,
			dependencyType: undefined,
		});
	},
});
