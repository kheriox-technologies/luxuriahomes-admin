'use server';
import { auth } from '@clerk/nextjs/server';
import { api } from '@workspace/backend/api';
import { fetchQuery } from 'convex/nextjs';

interface SessionMetadata {
	roles?: string[];
}

function getSessionRoles(sessionClaims: unknown): string[] {
	const claims = sessionClaims as { metadata?: unknown } | null | undefined;
	const metadata = claims?.metadata as SessionMetadata | undefined;
	return Array.isArray(metadata?.roles) ? metadata.roles : [];
}

export const hasRole = async (role: string): Promise<boolean> => {
	const { sessionClaims } = await auth();
	const roles = getSessionRoles(sessionClaims);
	return roles.includes(role);
};

export const hasAnyRole = async (roles: string[]): Promise<boolean> => {
	const { sessionClaims } = await auth();
	const userRoles = getSessionRoles(sessionClaims);
	return roles.some((r) => userRoles.includes(r));
};

/**
 * Returns true if the user has admin or any custom role with app access.
 * Must match middleware logic in proxy.ts.
 */
export const hasAppAccess = async (): Promise<boolean> => {
	const { sessionClaims, userId } = await auth();
	if (!userId) {
		return false;
	}

	const userRoles = getSessionRoles(sessionClaims);
	if (userRoles.includes('admin')) {
		return true;
	}

	const customRoleNames = await fetchQuery(
		api.permissions.listRoleNames.listRoleNames,
		{}
	);
	const allowedAppRoles = ['admin', ...customRoleNames];
	return allowedAppRoles.some((r) => userRoles.includes(r));
};
