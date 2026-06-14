import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow } from './shared';

export const updateOffset = mutation({
	args: {
		stageId: v.id('scheduleStages'),
		offsetDays: v.number(),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getStageOrThrow(ctx, args.stageId);
		await ctx.db.patch(args.stageId, { offsetDays: args.offsetDays });
	},
});
