import { ConvexError } from 'convex/values';
import type { ActionCtx, MutationCtx, QueryCtx } from '../_generated/server';

type AuthContext =
	| Pick<QueryCtx, 'auth'>
	| Pick<MutationCtx, 'auth'>
	| Pick<ActionCtx, 'auth'>;

/**
 * Ensures the user is authenticated. Throws if not.
 * @returns The user identity (never null).
 */
export async function checkIdentity(ctx: AuthContext) {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		throw new Error('Unauthorized');
	}
	return identity;
}

interface IdentityWithRole {
	public_metadata?: { roles?: string[] };
}

/**
 * Returns true if the current user has the given role.
 * Returns false if unauthenticated or role is not in user's roles.
 * Users with no roles are treated as ['member'].
 */
export async function hasRole(
	ctx: AuthContext,
	role: string
): Promise<boolean> {
	const identity = await ctx.auth.getUserIdentity();
	if (!identity) {
		return false;
	}
	const withRole = identity as IdentityWithRole;
	const roles =
		Array.isArray(withRole.public_metadata?.roles) &&
		withRole.public_metadata.roles.length > 0
			? withRole.public_metadata.roles
			: ['member'];
	return roles.includes(role);
}

/**
 * Returns true if the current user's identity has 'admin' in public_metadata.roles.
 * Returns false if unauthenticated or role is not admin.
 */
export async function isAdmin(ctx: AuthContext): Promise<boolean> {
	return await hasRole(ctx, 'admin');
}

/**
 * Throws ConvexError if the current user is not an admin.
 */
export async function requireAdmin(ctx: AuthContext): Promise<void> {
	if (!(await isAdmin(ctx))) {
		throw new ConvexError({
			code: 'FORBIDDEN',
			message: 'Admin role required',
		});
	}
}
