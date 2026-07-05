// Mirrors the role model in apps/portal/config/roles.ts.
// Backend enforcement lives in packages/backend/convex/lib/checkIdentity.ts —
// this is a UX-level guard only.

export const ADMIN_ROLE = 'admin';
export const SUPER_ADMIN_ROLE = 'super-admin';
export const CLIENT_ROLE = 'client';

export function getRoles(publicMetadata: unknown): string[] {
	if (
		publicMetadata &&
		typeof publicMetadata === 'object' &&
		'roles' in publicMetadata &&
		Array.isArray((publicMetadata as { roles: unknown }).roles)
	) {
		return (publicMetadata as { roles: string[] }).roles;
	}
	return [];
}

export function isAdmin(roles: string[]): boolean {
	return roles.includes(ADMIN_ROLE) || roles.includes(SUPER_ADMIN_ROLE);
}

export function isSuperAdmin(roles: string[]): boolean {
	return roles.includes(SUPER_ADMIN_ROLE);
}

export function isClient(roles: string[]): boolean {
	return roles.includes(CLIENT_ROLE);
}

// Converts a role slug (e.g. "super-admin") into a human label ("Super Admin").
// Mirrors formatRoleLabel in apps/portal/components/users/use-role-options.ts.
export function formatRoleLabel(role: string): string {
	return role
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}
