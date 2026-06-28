'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import {
	type ClerkUserRow,
	getClerkClientFromEnv,
	updateClerkUser,
} from '../lib/clerk';

/**
 * Updates a Clerk user's name and phone number. Super-admin only.
 */
export const update = action({
	args: {
		userId: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		phoneNumber: v.optional(v.string()),
	},
	handler: async (ctx, args): Promise<ClerkUserRow> => {
		await requireSuperAdmin(ctx);
		const clerk = getClerkClientFromEnv();
		return await updateClerkUser(clerk, args.userId, {
			firstName: args.firstName,
			lastName: args.lastName,
			phoneNumber: args.phoneNumber,
		});
	},
});
