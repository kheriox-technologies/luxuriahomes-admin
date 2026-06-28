'use node';

import { action } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import {
	type ClerkUserRow,
	getClerkClientFromEnv,
	listAllUserRows,
} from '../lib/clerk';

/**
 * Lists all Clerk users for the admin Users table. Super-admin only.
 */
export const list = action({
	args: {},
	handler: async (ctx): Promise<ClerkUserRow[]> => {
		await requireSuperAdmin(ctx);
		const clerk = getClerkClientFromEnv();
		return await listAllUserRows(clerk);
	},
});
