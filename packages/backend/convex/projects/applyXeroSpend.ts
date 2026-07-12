import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

/**
 * Patches each project's `expenses` (the portal's "Spent" value) with a figure
 * derived from Xero. Internal-only: invoked by the syncProjectSpend action.
 * `searchText` does not include `expenses`, so it does not need rebuilding.
 */
export const applyXeroSpend = internalMutation({
	args: {
		updates: v.array(
			v.object({
				projectId: v.id('projects'),
				expenses: v.number(),
			})
		),
	},
	handler: async (ctx, args) => {
		for (const update of args.updates) {
			await ctx.db.patch(update.projectId, { expenses: update.expenses });
		}
		return args.updates.length;
	},
});
