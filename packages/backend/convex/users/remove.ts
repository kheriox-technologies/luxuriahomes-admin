'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import { deleteClerkUser, getClerkClientFromEnv } from '../lib/clerk';

/**
 * Permanently deletes a Clerk user. Super-admin only.
 */
export const remove = action({
	args: {
		userId: v.string(),
	},
	handler: async (ctx, args): Promise<{ deleted: boolean }> => {
		await requireSuperAdmin(ctx);
		const clerk = getClerkClientFromEnv();
		await deleteClerkUser(clerk, args.userId);
		return { deleted: true };
	},
});
