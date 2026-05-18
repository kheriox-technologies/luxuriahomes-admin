import { ConvexError, v } from 'convex/values';
import { mutation } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

export const reorder = mutation({
	args: {
		orderedIds: v.array(v.id('stages')),
	},
	handler: async (ctx, args) => {
		await requireAdmin(ctx);

		for (const [i, stageId] of args.orderedIds.entries()) {
			const stage = await ctx.db.get(stageId);
			if (!stage) {
				throw new ConvexError({
					code: 'NOT_FOUND',
					message: 'Stage not found',
				});
			}
			await ctx.db.patch(stageId, { displayOrder: i });
		}
	},
});
