import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server';
import { api } from '@workspace/backend/api';
import { fetchQuery } from 'convex/nextjs';
import { NextResponse } from 'next/server';
import {
	ADMIN_ROLE,
	getLandingPath,
	hasPathMatch,
	hasSurfaceAccess,
	type PermissionData,
	resolveSurface,
} from '@/config/roles';

async function getUserRoles(
	sessionClaims: Record<string, unknown> | null,
	userId: string | null
): Promise<string[]> {
	const metadataRoles = sessionClaims?.metadata as
		| { roles?: string[] }
		| undefined;
	if (Array.isArray(metadataRoles?.roles) && metadataRoles.roles.length > 0) {
		return metadataRoles.roles;
	}
	if (!userId) {
		return [];
	}
	try {
		const client = await clerkClient();
		const user = await client.users.getUser(userId);
		const roles = (user.publicMetadata as { roles?: string[] } | undefined)
			?.roles;
		return Array.isArray(roles) && roles.length > 0 ? roles : ['member'];
	} catch {
		return ['member'];
	}
}

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/error']);

let permissionsCache: (PermissionData & { timestamp: number }) | null = null;
const CACHE_TTL_MS = 60_000;

async function getPermissionData(): Promise<PermissionData> {
	if (
		permissionsCache &&
		Date.now() - permissionsCache.timestamp < CACHE_TTL_MS
	) {
		return {
			permissions: permissionsCache.permissions,
			customRoleNames: permissionsCache.customRoleNames,
		};
	}
	try {
		const permissions = await fetchQuery(api.permissions.list.list, {});
		const customRoleNames = Object.keys(permissions).sort();
		permissionsCache = {
			permissions,
			customRoleNames,
			timestamp: Date.now(),
		};
		return { permissions, customRoleNames };
	} catch (err) {
		console.log('[proxy] getPermissionData: Convex fetch failed', {
			error: err instanceof Error ? err.message : String(err),
		});
		// Don't cache failures - retry on next request
		return {
			permissions: {},
			customRoleNames: [],
		};
	}
}

export default clerkMiddleware(async (auth, req) => {
	if (isPublicRoute(req)) {
		return NextResponse.next();
	}
	await auth.protect();

	const { sessionClaims, userId } = await auth();
	const roles = await getUserRoles(
		sessionClaims as Record<string, unknown> | null,
		userId
	);
	const permissionData = await getPermissionData();
	const pathname = req.nextUrl.pathname;
	const errorUrl = new URL('/error?error=arbitrary_octopus', req.url);

	// Root: send the user to the home of their highest-priority surface.
	if (pathname === '/') {
		const landing = getLandingPath(roles, permissionData);
		return NextResponse.redirect(
			landing ? new URL(landing, req.url) : errorUrl
		);
	}

	// Surface gate: the path must belong to a surface the user's roles allow.
	// A legitimate user on the wrong surface is sent to their own home; only
	// users with no surface at all see the error page.
	const surface = resolveSurface(pathname);
	if (!hasSurfaceAccess(surface.surface, roles, permissionData)) {
		const landing = getLandingPath(roles, permissionData);
		return NextResponse.redirect(
			landing ? new URL(landing, req.url) : errorUrl
		);
	}

	// Admin surface, non-admin custom roles: path must be granted explicitly.
	if (surface.surface === 'admin' && !roles.includes(ADMIN_ROLE)) {
		const allowedPaths = new Set<string>();
		for (const role of roles) {
			const permission = permissionData.permissions[role];
			if (!permission) {
				continue;
			}
			for (const path of permission.paths) {
				allowedPaths.add(path);
			}
		}
		const hasPathAccess = [...allowedPaths].some((p) =>
			hasPathMatch(pathname, p)
		);
		if (!hasPathAccess) {
			return NextResponse.redirect(errorUrl);
		}
	}

	return NextResponse.next();
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|mjs|pdf|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
