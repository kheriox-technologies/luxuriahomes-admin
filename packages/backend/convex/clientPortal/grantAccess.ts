'use node';

import { randomInt } from 'node:crypto';
import type { ClerkClient } from '@clerk/backend';
import { ConvexError, v } from 'convex/values';
import { api, internal } from '../_generated/api';
import { action } from '../_generated/server';
import { requireAdmin } from '../lib/checkIdentity';
import { getClerkClient } from '../lib/clerk';

const PORTAL_ROLES = ['member', 'client'] as const;

const PASSWORD_LENGTH = 20;
// Ambiguous characters (0/O, 1/l/I) omitted so the emailed password is easy to read.
const UPPERCASE = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijkmnpqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%^&*-_';
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;

function randomChar(charset: string): string {
	return charset[randomInt(charset.length)];
}

/** Generates a strong random password that satisfies Clerk's complexity checks. */
function generatePassword(): string {
	const chars = [
		randomChar(UPPERCASE),
		randomChar(LOWERCASE),
		randomChar(DIGITS),
		randomChar(SYMBOLS),
	];
	while (chars.length < PASSWORD_LENGTH) {
		chars.push(randomChar(ALL_CHARS));
	}
	// Fisher-Yates shuffle so the required characters are not always in front.
	for (let i = chars.length - 1; i > 0; i -= 1) {
		const j = randomInt(i + 1);
		[chars[i], chars[j]] = [chars[j], chars[i]];
	}
	return chars.join('');
}

function mergePortalRoles(existing: unknown): string[] {
	const current = Array.isArray(existing)
		? existing.filter((role): role is string => typeof role === 'string')
		: [];
	return [...new Set([...current, ...PORTAL_ROLES])];
}

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

async function findExistingClerkUserId(
	client: ClerkClient,
	email: string
): Promise<string | null> {
	const { data } = await client.users.getUserList({
		emailAddress: [email],
		limit: 1,
	});
	return data[0]?.id ?? null;
}

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
			const password = generatePassword();
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
