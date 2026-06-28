'use node';

import { v } from 'convex/values';
import { action } from '../_generated/server';
import { requireSuperAdmin } from '../lib/checkIdentity';
import {
	type ClerkUserRow,
	createClerkUser,
	generatePassword,
	getClerkClientFromEnv,
} from '../lib/clerk';

/**
 * Creates a new Clerk user with a generated password. Returns the created user
 * row along with the generated password so it can be shared once. Super-admin
 * only.
 */
export const create = action({
	args: {
		email: v.string(),
		firstName: v.optional(v.string()),
		lastName: v.optional(v.string()),
		phoneNumber: v.optional(v.string()),
		roles: v.array(v.string()),
	},
	handler: async (
		ctx,
		args
	): Promise<{ user: ClerkUserRow; generatedPassword: string }> => {
		await requireSuperAdmin(ctx);
		const clerk = getClerkClientFromEnv();
		const generatedPassword = generatePassword();
		const user = await createClerkUser(clerk, {
			email: args.email,
			password: generatedPassword,
			firstName: args.firstName,
			lastName: args.lastName,
			phoneNumber: args.phoneNumber,
			roles: args.roles,
		});
		return { user, generatedPassword };
	},
});
