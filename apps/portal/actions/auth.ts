'use server';
import { auth } from '@clerk/nextjs/server';
import { api } from '@workspace/backend/api';
import { fetchQuery } from 'convex/nextjs';
import {
	ADMIN_ROLE,
	accessibleSurfaces,
	CLIENT_ROLE,
	EMPTY_PERMISSION_DATA,
	type PermissionData,
	getLandingPath as resolveLandingPath,
	hasSurfaceAccess as resolveSurfaceAccess,
	SUPER_ADMIN_ROLE,
	type Surface,
	type SurfaceConfig,
} from '@/config/roles';

interface SessionMetadata {
	roles?: string[];
}

function getSessionRoles(sessionClaims: unknown): string[] {
	const claims = sessionClaims as { metadata?: unknown } | null | undefined;
	const metadata = claims?.metadata as SessionMetadata | undefined;
	return Array.isArray(metadata?.roles) ? metadata.roles : [];
}

async function getPermissionData(): Promise<PermissionData> {
	const permissions = await fetchQuery(api.permissions.list.list, {});
	return { permissions, customRoleNames: Object.keys(permissions).sort() };
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
 * Returns true if the user has the super-admin role. Used to guard the
 * User Management route. Unlike admin checks, this grants no implicit access
 * to plain admins.
 */
export const hasSuperAdminRole = async (): Promise<boolean> => {
	const { sessionClaims } = await auth();
	return getSessionRoles(sessionClaims).includes(SUPER_ADMIN_ROLE);
};

/**
 * Returns true if the user may enter the given surface (see config/roles.ts).
 * Must match the middleware logic in proxy.ts.
 */
export const hasSurfaceAccess = async (surface: Surface): Promise<boolean> => {
	const { sessionClaims, userId } = await auth();
	if (!userId) {
		return false;
	}
	const roles = getSessionRoles(sessionClaims);

	// Short-circuits that need no permission data
	if (surface === 'admin' && roles.includes(ADMIN_ROLE)) {
		return true;
	}
	if (surface === 'client') {
		return roles.includes(CLIENT_ROLE);
	}

	// Custom roles need the permissions table
	const permissionData = await getPermissionData();
	return resolveSurfaceAccess(surface, roles, permissionData);
};

/**
 * Landing path for the current user (home of their highest-priority surface,
 * or first granted path for custom-role-only users). Null when the user has
 * no surface.
 */
export const getLandingPath = async (): Promise<string | null> => {
	const { sessionClaims, userId } = await auth();
	if (!userId) {
		return null;
	}
	const roles = getSessionRoles(sessionClaims);
	// Admins win the priority order regardless of permission data
	const permissionData = roles.includes(ADMIN_ROLE)
		? EMPTY_PERMISSION_DATA
		: await getPermissionData();
	return resolveLandingPath(roles, permissionData);
};

/** Surfaces the current user may enter, sorted by priority. */
export const getAccessibleSurfaces = async (): Promise<SurfaceConfig[]> => {
	const { sessionClaims, userId } = await auth();
	if (!userId) {
		return [];
	}
	const roles = getSessionRoles(sessionClaims);
	const permissionData = await getPermissionData();
	return accessibleSurfaces(roles, permissionData);
};
