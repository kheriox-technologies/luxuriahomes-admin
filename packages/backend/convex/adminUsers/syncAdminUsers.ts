'use node';

import { ConvexError } from 'convex/values';
import { internal } from '../_generated/api';
import { internalAction } from '../_generated/server';
import { getClerkClient, listAdminUserContacts } from '../lib/clerk';

function getClerkSecretKey(): string {
	const secretKey = process.env.CLERK_SECRET_KEY;
	if (!secretKey) {
		throw new ConvexError({
			code: 'CONFIG_ERROR',
			message: 'Admin user sync is not configured (missing Clerk secret key).',
		});
	}
	return secretKey;
}

/**
 * Fetches all Clerk users with the admin role and replaces the cached
 * adminUsers snapshot. Scheduled daily (convex/crons.ts) and invokable on
 * demand via the syncNow action.
 */
export const syncAdminUsers = internalAction({
	args: {},
	handler: async (ctx) => {
		const clerk = getClerkClient(getClerkSecretKey());
		const users = await listAdminUserContacts(clerk);
		await ctx.runMutation(internal.adminUsers.replaceAll.replaceAll, {
			users: users.map(({ userId, fullName, email }) => ({
				userId,
				fullName,
				email,
			})),
		});
		return { synced: users.length };
	},
});
