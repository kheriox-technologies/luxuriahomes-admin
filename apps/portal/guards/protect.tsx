'use client';

import { useUser } from '@clerk/nextjs';
import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';

interface ProtectProps {
	actions?: string[];
	children: React.ReactNode;
	roles?: string[];
}

function normalize(values: string[] | undefined): string[] {
	return [
		...new Set(
			(values ?? []).map((v) => v.trim().toLowerCase()).filter(Boolean)
		),
	];
}

export default function Protect({
	roles = [],
	actions = [],
	children,
}: ProtectProps) {
	const userRoles = (useUser().user?.publicMetadata?.roles as
		| string[]
		| undefined) ?? ['member'];
	const normalizedUserRoles = normalize(userRoles);
	const roleChecks = normalize(roles);
	const actionChecks = normalize(actions);
	const permissionsByRole = useQuery(api.permissions.list.list, {}) ?? {};

	if (normalizedUserRoles.includes('admin')) {
		return children;
	}

	const allowedActions = new Set<string>();
	for (const role of normalizedUserRoles) {
		if (role === 'member') {
			continue;
		}
		const permission = permissionsByRole[role];
		if (!permission) {
			continue;
		}
		for (const action of permission.actions) {
			allowedActions.add(action.toLowerCase());
		}
	}

	const hasRole = roleChecks.some((role) => normalizedUserRoles.includes(role));
	const hasAction = actionChecks.some((action) => allowedActions.has(action));
	const showChildren =
		(roleChecks.length === 0 && actionChecks.length === 0) ||
		hasRole ||
		hasAction;

	return showChildren ? children : null;
}
