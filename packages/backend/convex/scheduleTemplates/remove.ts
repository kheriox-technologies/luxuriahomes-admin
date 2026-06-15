import { v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getScheduleTemplateOrThrow } from './shared';

export const remove = mutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getScheduleTemplateOrThrow(ctx, args.scheduleTemplateId);
		await ctx.db.delete(args.scheduleTemplateId);
		return args.scheduleTemplateId;
	},
});
