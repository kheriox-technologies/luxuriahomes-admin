import { api } from '../_generated/api';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';
import { checkIdentity } from './checkIdentity';

type QueryOrMutationCtx =
	| Pick<QueryCtx, 'db' | 'auth'>
	| Pick<MutationCtx, 'db' | 'auth'>;
type ActionAuthCtx = Pick<ActionCtx, 'runQuery' | 'auth'>;
type PermissionCtx = QueryOrMutationCtx | ActionAuthCtx;

export const RESERVED_ROLES = ['admin', 'member'] as const;

export interface PermissionRow {
	actions: string[];
	paths: string[];
	roleName: string;
}

function normalizePath(path: string): string {
	if (!path) {
		return '/';
	}
	return path.startsWith('/') ? path : `/${path}`;
}

export function hasPathMatch(pathname: string, allowedPath: string): boolean {
	const normalizedPathname = normalizePath(pathname);
	const normalizedAllowedPath = normalizePath(allowedPath);
	return (
		normalizedPathname === normalizedAllowedPath ||
		normalizedPathname.startsWith(`${normalizedAllowedPath}/`)
	);
}

export function getUserRolesFromIdentity(
	identity: { public_metadata?: { roles?: string[] } } | null
): string[] {
	const roles =
		Array.isArray(identity?.public_metadata?.roles) &&
		identity.public_metadata.roles.length > 0
			? identity.public_metadata.roles
			: ['member'];
	return [...new Set(roles)];
}

export async function getUserRoles(
	ctx: Pick<PermissionCtx, 'auth'>
): Promise<string[]> {
	const identity = await checkIdentity(ctx);
	return getUserRolesFromIdentity(
		identity as { public_metadata?: { roles?: string[] } }
	);
}

async function getPermissionsForRolesFromDb(
	ctx: Pick<QueryOrMutationCtx, 'db'>,
	roles: string[]
): Promise<PermissionRow[]> {
	const customRoles = roles.filter(
		(role) => !RESERVED_ROLES.includes(role as (typeof RESERVED_ROLES)[number])
	);
	if (customRoles.length === 0) {
		return [];
	}

	const records = await Promise.all(
		customRoles.map((roleName) =>
			ctx.db
				.query('permissions')
				.withIndex('by_role_name', (q) => q.eq('roleName', roleName))
				.first()
		)
	);
	return records
		.filter((r): r is NonNullable<(typeof records)[number]> => r !== null)
		.map((record) => ({
			roleName: record.roleName,
			paths: record.paths,
			actions: record.actions,
		}));
}

async function getEffectivePermissions(
	ctx: PermissionCtx,
	roles: string[]
): Promise<{ allowedPaths: string[]; allowedActions: string[] }> {
	if ('db' in ctx) {
		const permissions = await getPermissionsForRolesFromDb(ctx, roles);
		const pathSet = new Set<string>();
		const actionSet = new Set<string>();
		for (const permission of permissions) {
			for (const path of permission.paths) {
				pathSet.add(path);
			}
			for (const action of permission.actions) {
				actionSet.add(action);
			}
		}
		return {
			allowedPaths: [...pathSet],
			allowedActions: [...actionSet],
		};
	}

	const effective = await ctx.runQuery(
		api.permissions.getEffectiveForRoles.getEffectiveForRoles,
		{
			roles,
		}
	);
	return {
		allowedPaths: effective.allowedPaths,
		allowedActions: effective.allowedActions,
	};
}

export async function canAccessPath(
	ctx: PermissionCtx,
	pathname: string
): Promise<boolean> {
	const roles = await getUserRoles(ctx);
	if (roles.includes('admin')) {
		return true;
	}

	const effective = await getEffectivePermissions(ctx, roles);
	return effective.allowedPaths.some((path) => hasPathMatch(pathname, path));
}

export async function canDoAction(
	ctx: PermissionCtx,
	action: string
): Promise<boolean> {
	const roles = await getUserRoles(ctx);
	if (roles.includes('admin')) {
		return true;
	}

	const effective = await getEffectivePermissions(ctx, roles);
	return effective.allowedActions.includes(action);
}

export async function requireAction(
	ctx: PermissionCtx,
	action: string
): Promise<void> {
	const allowed = await canDoAction(ctx, action);
	if (!allowed) {
		throw new Error(`Forbidden: action "${action}" required`);
	}
}
