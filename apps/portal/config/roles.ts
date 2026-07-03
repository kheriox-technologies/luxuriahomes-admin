/**
 * Single source of truth for role-based surfaces.
 *
 * A "surface" is a URL space owned by a set of roles (admin portal, client
 * portal, ...). Middleware gating, the root landing redirect, and the surface
 * switcher all derive from this registry. Adding a role later means adding a
 * registry entry plus its route folder — nothing else.
 *
 * This module must stay pure/isomorphic (no server-only imports): it is
 * consumed by the edge middleware (proxy.ts), server actions, and client
 * components alike.
 */

export type Surface = 'admin' | 'client';

export interface SurfaceConfig {
	/** Default landing page for users of this surface. */
	home: string;
	/** Display name for the surface switcher. */
	label: string;
	/** URL prefix owned by this surface. '/' owns everything not claimed by a longer prefix. */
	prefix: string;
	/** Lower number wins when a multi-role user lands on '/'. */
	priority: number;
	surface: Surface;
}

export const SURFACES: SurfaceConfig[] = [
	{
		surface: 'admin',
		prefix: '/',
		home: '/dashboard',
		priority: 0,
		label: 'Admin Portal',
	},
	{
		surface: 'client',
		prefix: '/client',
		home: '/client/projects',
		priority: 1,
		label: 'Client Portal',
	},
	// future: { surface: 'sp', prefix: '/sp', home: '/sp/jobs', priority: 2, label: 'Service Provider Portal' },
];

export const SUPER_ADMIN_ROLE = 'super-admin';
export const ADMIN_ROLE = 'admin';
export const CLIENT_ROLE = 'client';
/** Fallback role for users with no roles assigned. Grants no surface. */
export const MEMBER_ROLE = 'member';

/**
 * Roles that map directly to a surface (or are reserved) and therefore must
 * never be treated as custom admin-surface roles, even if a row with the same
 * name ends up in the permissions table.
 */
const NON_CUSTOM_ROLES = new Set<string>([
	SUPER_ADMIN_ROLE,
	ADMIN_ROLE,
	CLIENT_ROLE,
	MEMBER_ROLE,
]);

export interface PermissionData {
	customRoleNames: string[];
	permissions: Record<string, { paths: string[]; actions: string[] }>;
}

export const EMPTY_PERMISSION_DATA: PermissionData = {
	permissions: {},
	customRoleNames: [],
};

function matchesPrefix(pathname: string, prefix: string): boolean {
	if (prefix === '/') {
		return true;
	}
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

/**
 * Resolve which surface owns a pathname via longest-prefix match, so
 * '/client/projects' hits the client surface while '/clients' falls through
 * to the admin surface at '/'.
 */
export function resolveSurface(pathname: string): SurfaceConfig {
	const byPrefixLength = [...SURFACES].sort(
		(a, b) => b.prefix.length - a.prefix.length
	);
	const match = byPrefixLength.find((s) => matchesPrefix(pathname, s.prefix));
	if (!match) {
		throw new Error('No surface registered for the root prefix');
	}
	return match;
}

function customRoles(roles: string[], perm: PermissionData): string[] {
	return roles.filter(
		(role) => !NON_CUSTOM_ROLES.has(role) && perm.customRoleNames.includes(role)
	);
}

/**
 * Admin surface: 'admin' role or any custom role from the permissions table
 * (custom roles are additionally path-checked by the middleware).
 * Client surface: 'client' role. 'member' grants nothing.
 */
export function hasSurfaceAccess(
	surface: Surface,
	roles: string[],
	perm: PermissionData
): boolean {
	switch (surface) {
		case 'admin':
			return roles.includes(ADMIN_ROLE) || customRoles(roles, perm).length > 0;
		case 'client':
			return roles.includes(CLIENT_ROLE);
		default:
			return false;
	}
}

/** Surfaces the user may enter, sorted by priority. */
export function accessibleSurfaces(
	roles: string[],
	perm: PermissionData
): SurfaceConfig[] {
	return SURFACES.filter((s) => hasSurfaceAccess(s.surface, roles, perm)).sort(
		(a, b) => a.priority - b.priority
	);
}

/** First path granted to the user's custom roles, for landing purposes. */
function firstGrantedPath(
	roles: string[],
	perm: PermissionData
): string | null {
	const paths = new Set<string>();
	for (const role of customRoles(roles, perm)) {
		for (const path of perm.permissions[role]?.paths ?? []) {
			paths.add(path);
		}
	}
	return [...paths].sort()[0] ?? null;
}

/**
 * Landing path for '/': the home of the user's highest-priority surface.
 * Custom-role-only users land on their first granted path instead of the
 * surface home (which they may not be allowed to see). Returns null when the
 * user has no surface at all.
 */
export function getLandingPath(
	roles: string[],
	perm: PermissionData
): string | null {
	for (const surface of accessibleSurfaces(roles, perm)) {
		if (surface.surface === 'admin' && !roles.includes(ADMIN_ROLE)) {
			const granted = firstGrantedPath(roles, perm);
			if (granted) {
				return granted;
			}
			// Custom role with no granted paths — try the next surface.
			continue;
		}
		return surface.home;
	}
	return null;
}

/** Exact match or prefix match on a path segment boundary. */
export function hasPathMatch(pathname: string, allowedPath: string): boolean {
	return pathname === allowedPath || pathname.startsWith(`${allowedPath}/`);
}
