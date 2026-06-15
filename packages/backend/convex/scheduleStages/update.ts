import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getStageOrThrow, parseStageName } from './shared';

export const update = mutation({
	args: {
		stageId: v.id('scheduleStages'),
		name: v.string(),
		dependencyStageId: v.optional(v.id('scheduleStages')),
		dependencyType: v.optional(
			v.union(v.literal('startAfter'), v.literal('startWith'))
		),
		offsetDays: v.optional(v.number()),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);
		const stage = await getStageOrThrow(ctx, args.stageId);
		const name = parseStageName(args.name);

		if (args.dependencyStageId) {
			if (args.dependencyStageId === args.stageId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'A stage cannot depend on itself',
				});
			}
			const dep = await ctx.db.get(args.dependencyStageId);
			if (!dep || dep.scheduleTemplateId !== stage.scheduleTemplateId) {
				throw new ConvexError({
					code: 'INVALID_DEPENDENCY',
					message: 'Dependency stage must belong to the same schedule template',
				});
			}
		}

		await ctx.db.patch(args.stageId, {
			name,
			dependencyStageId: args.dependencyStageId,
			dependencyType: args.dependencyStageId
				? (args.dependencyType ?? 'startAfter')
				: undefined,
			offsetDays: args.offsetDays ?? 0,
		});
	},
});
