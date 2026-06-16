import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getProjectStageOrThrow } from './shared';

export const updateDates = mutation({
	args: {
		stageId: v.id('projectStages'),
		startDate: v.number(),
		endDate: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getProjectStageOrThrow(ctx, args.stageId);
		await ctx.db.patch(args.stageId, {
			startDate: args.startDate,
			endDate: args.endDate,
		});
	},
});
