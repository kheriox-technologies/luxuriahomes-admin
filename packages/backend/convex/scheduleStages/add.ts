import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getScheduleTemplateOrThrow } from '../scheduleTemplates/shared';
import { nextStageOrder, parseStageName } from './shared';

export const add = mutation({
	args: {
		scheduleTemplateId: v.id('scheduleTemplates'),
		name: v.string(),
		dependencyStageId: v.optional(v.id('scheduleStages')),
		dependencyType: v.optional(
			v.union(v.literal('startAfter'), v.literal('startWith'))
		),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		await getScheduleTemplateOrThrow(ctx, args.scheduleTemplateId);
		const name = parseStageName(args.name);

		if (args.dependencyStageId) {
			const dep = await ctx.db.get(args.dependencyStageId);
			if (!dep || dep.scheduleTemplateId !== args.scheduleTemplateId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency stage must belong to the same schedule template',
				});
			}
		}

		const order = await nextStageOrder(ctx, args.scheduleTemplateId);

		return await ctx.db.insert('scheduleStages', {
			scheduleTemplateId: args.scheduleTemplateId,
			name,
			order,
			dependencyStageId: args.dependencyStageId,
			dependencyType: args.dependencyStageId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
		});
	},
});
