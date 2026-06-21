import { v } from 'convex/values';
import { internalMutation } from '../_generated/server';

/**
 * Replaces the entire adminUsers snapshot with a fresh set fetched from Clerk.
 * Internal-only: invoked by the syncAdminUsers action.
 */
export const replaceAll = internalMutation({
	args: {
		users: v.array(
			v.object({
				userId: v.string(),
				fullName: v.string(),
				email: v.string(),
			})
		),
	},
	handler: async (ctx, args) => {
		const existing = await ctx.db.query('adminUsers').collect();
		for (const row of existing) {
			await ctx.db.delete(row._id);
		}
		const syncedAt = Date.now();
		for (const user of args.users) {
			await ctx.db.insert('adminUsers', { ...user, syncedAt });
		}
		return args.users.length;
	},
});
