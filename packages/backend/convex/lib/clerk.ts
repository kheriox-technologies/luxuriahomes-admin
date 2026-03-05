'use node';

import { type ClerkClient, createClerkClient } from '@clerk/backend';

const DEFAULT_FALLBACK_NAME = 'Subscriber';
const CLERK_LIST_PAGE_SIZE = 100;

export interface ClerkUserContact {
	email: string;
	fullName: string;
	userId: string;
}

function toFullName(user: {
	fullName?: string | null;
	firstName?: string | null;
	lastName?: string | null;
}): string {
	const full =
		user.fullName ??
		[user.firstName, user.lastName].filter(Boolean).join(' ').trim();
	return full || DEFAULT_FALLBACK_NAME;
}

function toPrimaryEmail(user: {
	primaryEmailAddress?: { emailAddress?: string | null } | null;
	emailAddresses?: Array<{ emailAddress?: string | null }>;
}): string | null {
	const email =
		user.primaryEmailAddress?.emailAddress ??
		user.emailAddresses?.[0]?.emailAddress;
	const normalized = email?.trim();
	return normalized || null;
}

/**
 * Creates a Clerk client for use in Convex actions.
 * Pass CLERK_SECRET_KEY from Convex environment variables.
 */
export function getClerkClient(secretKey: string): ClerkClient {
	return createClerkClient({ secretKey });
}

/**
 * Fetches a user's contact details from Clerk by userId.
 * Uses the provided client (create once and reuse for multiple lookups).
 * @returns null if user not found or no email is available
 */
export async function getUserContact(
	client: ClerkClient,
	userId: string
): Promise<ClerkUserContact | null> {
	try {
		const user = await client.users.getUser(userId);
		const email = toPrimaryEmail(user);
		if (!email) {
			return null;
		}
		return {
			userId: user.id,
			fullName: toFullName(user),
			email,
		};
	} catch {
		return null;
	}
}

/**
 * Fetches user contacts for a list of user IDs.
 * Silently skips users that cannot be resolved or do not have an email.
 */
export async function getUserContactsByIds(
	client: ClerkClient,
	userIds: string[]
): Promise<ClerkUserContact[]> {
	const uniqueUserIds = [
		...new Set(userIds.map((id) => id.trim()).filter(Boolean)),
	];
	if (uniqueUserIds.length === 0) {
		return [];
	}

	const contacts = await Promise.all(
		uniqueUserIds.map((userId) => getUserContact(client, userId))
	);
	return contacts.filter(
		(contact): contact is ClerkUserContact => contact !== null
	);
}

/**
 * Fetches all users from Clerk and returns contact details for each user with an email.
 */
export async function listAllUserContacts(
	client: ClerkClient
): Promise<ClerkUserContact[]> {
	const contacts: ClerkUserContact[] = [];
	let offset = 0;

	for (;;) {
		const { data } = await client.users.getUserList({
			limit: CLERK_LIST_PAGE_SIZE,
			offset,
		});

		if (data.length === 0) {
			break;
		}

		for (const user of data) {
			const email = toPrimaryEmail(user);
			if (!email) {
				continue;
			}
			contacts.push({
				userId: user.id,
				fullName: toFullName(user),
				email,
			});
		}

		offset += data.length;
		if (data.length < CLERK_LIST_PAGE_SIZE) {
			break;
		}
	}

	return contacts;
}

/**
 * Backward-compatible helper for existing callers that only need full name.
 */
export async function getUserFullName(
	client: ClerkClient,
	userId: string
): Promise<string> {
	const contact = await getUserContact(client, userId);
	return contact?.fullName ?? DEFAULT_FALLBACK_NAME;
}
