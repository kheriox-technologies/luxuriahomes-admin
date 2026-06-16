import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		projectId: v.id('projects'),
		stageIds: v.array(v.id('projectStages')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (let i = 0; i < args.stageIds.length; i++) {
			const stageId = args.stageIds[i];
			if (stageId) {
				await ctx.db.patch(stageId, { order: i });
			}
		}
	},
});
