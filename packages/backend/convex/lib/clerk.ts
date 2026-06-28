'use node';

import { randomBytes } from 'node:crypto';
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
 * Creates a Clerk client using CLERK_SECRET_KEY from the Convex environment.
 * Throws a ConvexError-friendly error if the key is not configured.
 */
export function getClerkClientFromEnv(): ClerkClient {
	const secretKey = process.env.CLERK_SECRET_KEY;
	if (!secretKey) {
		throw new Error(
			'User management is not configured (missing Clerk secret key).'
		);
	}
	return getClerkClient(secretKey);
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

function hasAdminRole(user: {
	publicMetadata?: Record<string, unknown> | null;
}): boolean {
	const roles = user.publicMetadata?.roles;
	return Array.isArray(roles) && roles.includes('admin');
}

/**
 * Fetches all Clerk users whose publicMetadata.roles includes 'admin' and
 * returns contact details for each one with an email. Used to sync the
 * `adminUsers` table for the tasks assignee picker.
 */
export async function listAdminUserContacts(
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
			if (!hasAdminRole(user)) {
				continue;
			}
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

// ---------------------------------------------------------------------------
// User management (super-admin only) — full CRUD over Clerk users.
// ---------------------------------------------------------------------------

type ClerkUser = Awaited<ReturnType<ClerkClient['users']['getUser']>>;

export interface ClerkUserRow {
	createdAt: number;
	email: string;
	firstName: string;
	fullName: string;
	imageUrl: string;
	lastActiveAt: number | null;
	lastName: string;
	lastSignInAt: number | null;
	phoneNumber: string;
	roles: string[];
	userId: string;
}

function rolesFromMetadata(metadata: Record<string, unknown> | null): string[] {
	const roles = metadata?.roles;
	return Array.isArray(roles)
		? roles.filter((role): role is string => typeof role === 'string')
		: [];
}

function primaryPhone(user: ClerkUser): string {
	const primary = user.phoneNumbers.find(
		(phone) => phone.id === user.primaryPhoneNumberId
	);
	return (primary ?? user.phoneNumbers[0])?.phoneNumber ?? '';
}

/**
 * Maps a Clerk user resource to the flat row shape consumed by the admin
 * Users table.
 */
export function toUserRow(user: ClerkUser): ClerkUserRow {
	const firstName = user.firstName ?? '';
	const lastName = user.lastName ?? '';
	const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
	return {
		userId: user.id,
		firstName,
		lastName,
		fullName,
		email: toPrimaryEmail(user) ?? '',
		phoneNumber: primaryPhone(user),
		roles: rolesFromMetadata(user.publicMetadata),
		lastActiveAt: user.lastActiveAt,
		lastSignInAt: user.lastSignInAt,
		imageUrl: user.imageUrl,
		createdAt: user.createdAt,
	};
}

/**
 * Fetches every Clerk user (paginated) as flat rows for the admin Users table.
 */
export async function listAllUserRows(
	client: ClerkClient
): Promise<ClerkUserRow[]> {
	const rows: ClerkUserRow[] = [];
	let offset = 0;

	for (;;) {
		const { data } = await client.users.getUserList({
			limit: CLERK_LIST_PAGE_SIZE,
			offset,
			orderBy: '-created_at',
		});

		if (data.length === 0) {
			break;
		}

		for (const user of data) {
			rows.push(toUserRow(user));
		}

		offset += data.length;
		if (data.length < CLERK_LIST_PAGE_SIZE) {
			break;
		}
	}

	return rows;
}

/**
 * Generates a strong random password that satisfies Clerk's default policy
 * (mixed case, digit, symbol, sufficient length).
 */
export function generatePassword(): string {
	const random = randomBytes(18).toString('base64url');
	// Guarantee at least one of each required character class.
	return `${random}Aa1!`;
}

/**
 * Replaces a user's primary phone number with the given value. Passing an
 * empty string removes any existing phone numbers.
 */
async function setUserPhone(
	client: ClerkClient,
	userId: string,
	phoneNumber: string
): Promise<void> {
	const trimmed = phoneNumber.trim();
	const user = await client.users.getUser(userId);
	const existing = user.phoneNumbers;
	const currentPrimary = existing.find(
		(phone) => phone.id === user.primaryPhoneNumberId
	);

	if (!trimmed) {
		await Promise.all(
			existing.map((phone) => client.phoneNumbers.deletePhoneNumber(phone.id))
		);
		return;
	}

	if (currentPrimary?.phoneNumber === trimmed) {
		return;
	}

	const created = await client.phoneNumbers.createPhoneNumber({
		userId,
		phoneNumber: trimmed,
		primary: true,
		verified: true,
	});
	await Promise.all(
		existing
			.filter((phone) => phone.id !== created.id)
			.map((phone) => client.phoneNumbers.deletePhoneNumber(phone.id))
	);
}

export interface CreateClerkUserInput {
	email: string;
	firstName?: string;
	lastName?: string;
	password: string;
	phoneNumber?: string;
	roles: string[];
}

/**
 * Creates a new Clerk user with the given details and roles.
 */
export async function createClerkUser(
	client: ClerkClient,
	input: CreateClerkUserInput
): Promise<ClerkUserRow> {
	const phone = input.phoneNumber?.trim();
	const user = await client.users.createUser({
		emailAddress: [input.email],
		password: input.password,
		firstName: input.firstName?.trim() || undefined,
		lastName: input.lastName?.trim() || undefined,
		phoneNumber: phone ? [phone] : undefined,
		publicMetadata: { roles: input.roles },
		skipPasswordChecks: true,
	});
	return toUserRow(user);
}

export interface UpdateClerkUserInput {
	firstName?: string;
	lastName?: string;
	phoneNumber?: string;
}

/**
 * Updates a Clerk user's name and (optionally) primary phone number.
 */
export async function updateClerkUser(
	client: ClerkClient,
	userId: string,
	input: UpdateClerkUserInput
): Promise<ClerkUserRow> {
	await client.users.updateUser(userId, {
		firstName: input.firstName?.trim() ?? '',
		lastName: input.lastName?.trim() ?? '',
	});
	if (input.phoneNumber !== undefined) {
		await setUserPhone(client, userId, input.phoneNumber);
	}
	const user = await client.users.getUser(userId);
	return toUserRow(user);
}

/**
 * Sets the roles stored in a Clerk user's public metadata.
 */
export async function setClerkUserRoles(
	client: ClerkClient,
	userId: string,
	roles: string[]
): Promise<ClerkUserRow> {
	const user = await client.users.updateUserMetadata(userId, {
		publicMetadata: { roles },
	});
	return toUserRow(user);
}

/**
 * Permanently deletes a Clerk user.
 */
export async function deleteClerkUser(
	client: ClerkClient,
	userId: string
): Promise<void> {
	await client.users.deleteUser(userId);
}
