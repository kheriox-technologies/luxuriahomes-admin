'use node';

import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';

/**
 * Admin-triggered manual resync of the cached admin users from Clerk.
 */
export const syncNow = action({
	args: {},
	handler: async (ctx): Promise<{ synced: number }> => {
		await requireAdmin(ctx);
		return await ctx.runAction(
			internal.adminUsers.syncAdminUsers.syncAdminUsers,
			{}
		);
	},
});
