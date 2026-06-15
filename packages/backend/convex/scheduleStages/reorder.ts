import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
		stageIds: v.array(v.id('scheduleStages')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		for (let i = 0; i < args.stageIds.length; i++) {
			await ctx.db.patch(args.stageIds[i], { order: i });
		}
	},
});
