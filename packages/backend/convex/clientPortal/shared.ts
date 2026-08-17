'use node';

import { randomInt } from 'node:crypto';
import type { ClerkClient } from '@clerk/backend';
import { ConvexError } from 'convex/values';

/**
 * Clerk account plumbing shared by every flow that provisions a client-portal
 * login — the per-project invite (`grantAccess`) and sending a quotation to its
 * clients (`clientQuotations/sendToClients`). Keeping it here means both flows
 * mint identical accounts: same roles, same password policy.
 */

/** Roles every portal account carries. `client` is what grants the surface. */
export const PORTAL_ROLES = ['member', 'client'] as const;

const PASSWORD_LENGTH = 20;
// Ambiguous characters (0/O, 1/l/I) omitted so the emailed password is easy to read.
const UPPERCASE = 'ABCDEFGHJKMNPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijkmnpqrstuvwxyz';
const DIGITS = '23456789';
const SYMBOLS = '!@#$%^&*-_';
const ALL_CHARS = UPPERCASE + LOWERCASE + DIGITS + SYMBOLS;

function randomChar(charset: string): string {
	return charset.charAt(randomInt(charset.length));
}

/** Generates a strong random password that satisfies Clerk's complexity checks. */
export function generatePortalPassword(): string {
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
		const swapped = chars[i] as string;
		chars[i] = chars[j] as string;
		chars[j] = swapped;
	}
	return chars.join('');
}

/** Adds the portal roles to whatever roles the account already carries. */
export function mergePortalRoles(existing: unknown): string[] {
	const current = Array.isArray(existing)
		? existing.filter((role): role is string => typeof role === 'string')
		: [];
	return [...new Set([...current, ...PORTAL_ROLES])];
}

export function getClerkSecretKey(): string {
	const secretKey = process.env.CLERK_SECRET_KEY;
	if (!secretKey) {
		throw new ConvexError({
			code: 'CONFIG_ERROR',
			message: 'Client portal is not configured (missing Clerk secret key).',
		});
	}
	return secretKey;
}

export async function findExistingClerkUserId(
	client: ClerkClient,
	email: string
): Promise<string | null> {
	const { data } = await client.users.getUserList({
		emailAddress: [email],
		limit: 1,
	});
	return data[0]?.id ?? null;
}

const TRAILING_SLASHES = /\/+$/;

/** The portal origin used to link clients back into the app, without a trailing slash. */
export function getPortalUrl(): string {
	return (
		process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL?.trim().replace(
			TRAILING_SLASHES,
			''
		) ?? ''
	);
}
