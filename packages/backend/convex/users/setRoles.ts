'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import {
	type ClerkUserRow,
	getClerkClientFromEnv,
	setClerkUserRoles,
} from '../lib/clerk';

/**
 * Sets the roles stored in a Clerk user's public metadata. Super-admin only.
 */
export const setRoles = action({
	args: {
		userId: v.string(),
		roles: v.array(v.string()),
	},
	handler: async (ctx, args): Promise<ClerkUserRow> => {
		await requireSuperAdmin(ctx);
		const clerk = getClerkClientFromEnv();
		return await setClerkUserRoles(clerk, args.userId, args.roles);
	},
});
