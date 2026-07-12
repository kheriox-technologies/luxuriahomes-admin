import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

/**
 * Patches each project's `expenses` (the portal's "Spent" value) and `received`
 * value with figures derived from Xero. Internal-only: invoked by the
 * syncProjectFinancials action. Neither field is part of `searchText`, so the
 * search index does not need rebuilding.
 */
export const applyXeroFinancials = internalMutation({
	args: {
		updates: v.array(
			v.object({
				projectId: v.id('projects'),
				expenses: v.number(),
				received: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		for (const update of args.updates) {
			await ctx.db.patch(update.projectId, {
				expenses: update.expenses,
				received: update.received,
			});
		}
		return args.updates.length;
	},
});
