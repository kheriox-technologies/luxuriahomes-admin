'use client';

import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';

export interface RoleOption {
	label: string;
	value: string;
}

// Built-in roles that are always available regardless of custom permissions.
const RESERVED_ROLES = ['super-admin', 'admin', 'member'];

/**
 * Converts a role slug (e.g. "super-admin") into a human label ("Super Admin").
 */
export function formatRoleLabel(role: string): string {
	return role
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');
}

/**
 * Returns the selectable role options: the reserved roles plus any custom
 * roles defined in the permissions table.
 */
export function useRoleOptions(): RoleOption[] {
	const customRoles =
		useQuery(api.permissions.listRoleNames.listRoleNames, {}) ?? [];

	return useMemo(() => {
		const all = [...new Set([...RESERVED_ROLES, ...customRoles])];
		return all.map((role) => ({ value: role, label: formatRoleLabel(role) }));
	}, [customRoles]);
}
