'use node';

import { ConvexError, v } from 'convex/values';
import { internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClerkClient } from '../lib/clerk';

function getClerkSecretKey(): string {
	const secretKey = process.env.CLERK_SECRET_KEY;
	if (!secretKey) {
		throw new ConvexError({
			code: 'CONFIG_ERROR',
			message: 'Client portal is not configured (missing Clerk secret key).',
		});
	}
	return secretKey;
}

export const revokeAccess = action({
	args: {
		projectId: v.id('projects'),
		email: v.string(),
	},
	returns: v.object({ clerkUserDeleted: v.boolean() }),
	handler: async (ctx, args): Promise<{ clerkUserDeleted: boolean }> => {
		await requireAdmin(ctx);

		const client = await ctx.runQuery(
			internal.clientPortal.internal.getClientForPortal,
			{ projectId: args.projectId, email: args.email }
		);
		if (!client) {
			throw new ConvexError({
				code: 'NOT_FOUND',
				message: 'Client not found on this project.',
			});
		}
		const { portalUserId } = client;
		if (!portalUserId) {
			throw new ConvexError({
				code: 'NOT_GRANTED',
				message: 'This client does not have portal access.',
			});
		}

		// Unlink this project client first, then delete the Clerk user only if no
		// other project client still references it.
		await ctx.runMutation(
			internal.clientPortal.internal.unlinkClientPortalUser,
			{
				projectId: args.projectId,
				email: client.email,
			}
		);

		const references = await ctx.runQuery(
			internal.clientPortal.internal.countPortalUserReferences,
			{ portalUserId }
		);

		if (references > 0) {
			return { clerkUserDeleted: false };
		}

		const clerk = getClerkClient(getClerkSecretKey());
		await clerk.users.deleteUser(portalUserId);
		return { clerkUserDeleted: true };
	},
});
