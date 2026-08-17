'use node';

import { ConvexError, v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClerkClient } from '../lib/clerk';
import {
	findExistingClerkUserId,
	generatePortalPassword,
	getClerkSecretKey,
	mergePortalRoles,
	PORTAL_ROLES,
} from './shared';

function buildPasswordEmail(
	firstName: string,
	email: string,
	password: string,
	portalUrl: string
): { html: string; text: string } {
	const greetingName = firstName.trim() || 'there';
	const htmlButton = portalUrl
		? `<p><a href="${portalUrl}" rel="noopener" style="display:inline-block;background:#111;color:#fff;font-weight:bold;text-decoration:none;padding:12px 20px;border-radius:6px;">Sign in to client portal</a></p>`
		: '';
	const html = `<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#111;line-height:1.5;">
<p>Hi ${greetingName},</p>
<p>You now have access to the Luxuria Homes client portal. Use the credentials below to sign in:</p>
<p><strong>Email:</strong> ${email}<br><strong>Temporary password:</strong> ${password}</p>
${htmlButton}
<p>You can also sign in with <strong>Google</strong> using this same email address (${email}) &mdash; no password needed.</p>
<p>For your security, please change your password after signing in.</p>
<p>If you did not expect this email, you can ignore it.</p>
</div>`;
	const textLink = portalUrl ? `\nSign in here: ${portalUrl}\n` : '';
	const text = `Hi ${greetingName},

You now have access to the Luxuria Homes client portal. Use the credentials below to sign in:

Email: ${email}
Temporary password: ${password}
${textLink}
You can also sign in with Google using this same email address (${email}) — no password needed.

For your security, please change your password after signing in.

If you did not expect this email, you can ignore it.`;
	return { html, text };
}

export const grantAccess = action({
	args: {
		projectId: v.id('projects'),
		email: v.string(),
	},
	returns: v.object({ emailSent: v.boolean() }),
	handler: async (ctx, args): Promise<{ emailSent: boolean }> => {
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
		if (client.portalUserId) {
			throw new ConvexError({
				code: 'ALREADY_GRANTED',
				message: 'This client already has portal access.',
			});
		}

		const clerk = getClerkClient(getClerkSecretKey());

		const existingUserId = await findExistingClerkUserId(clerk, client.email);

		let portalUserId: string;
		let emailSent = false;
		let createdUserId: string | null = null;

		if (existingUserId) {
			// Reuse the existing Clerk account; just ensure the portal roles are set.
			const existingUser = await clerk.users.getUser(existingUserId);
			await clerk.users.updateUser(existingUserId, {
				publicMetadata: {
					...existingUser.publicMetadata,
					roles: mergePortalRoles(existingUser.publicMetadata?.roles),
				},
			});
			portalUserId = existingUserId;
		} else {
			const password = generatePortalPassword();
			const newUser = await clerk.users.createUser({
				emailAddress: [client.email],
				password,
				firstName: client.firstName,
				lastName: client.lastName,
				publicMetadata: { roles: [...PORTAL_ROLES] },
			});
			portalUserId = newUser.id;
			createdUserId = newUser.id;

			const portalUrl = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL?.trim() ?? '';
			const { html, text } = buildPasswordEmail(
				client.firstName,
				client.email,
				password,
				portalUrl
			);
			await ctx.runAction(api.email.send.send, {
				to: [client.email],
				subject: 'Your Luxuria Homes client portal access',
				html,
				text,
				projectId: args.projectId,
				relatedTable: 'clients',
				relatedId: client.email,
			});
			emailSent = true;
		}

		try {
			await ctx.runMutation(
				internal.clientPortal.internal.linkClientPortalUser,
				{
					projectId: args.projectId,
					email: client.email,
					portalUserId,
					grantedAt: Date.now(),
				}
			);
		} catch (error) {
			// Roll back a freshly created user so we do not orphan it in Clerk.
			if (createdUserId) {
				await clerk.users.deleteUser(createdUserId);
			}
			throw error;
		}

		return { emailSent };
	},
});
