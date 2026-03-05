import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server';
import { api } from '@workspace/backend/api';
import { fetchQuery } from 'convex/nextjs';
import { NextResponse } from 'next/server';

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

const isPublicRoute = createRouteMatcher([
	'/sign-in(.*)',
	'/error',
	'/api/send-email',
]);

let permissionsCache: {
	permissions: Record<string, { paths: string[]; actions: string[] }>;
	customRoleNames: string[];
	timestamp: number;
} | null = null;
const CACHE_TTL_MS = 60_000;

function hasPathMatch(pathname: string, allowedPath: string): boolean {
	const normalizedPathname = pathname === '/' ? '/dashboard' : pathname;
	return (
		normalizedPathname === allowedPath ||
		normalizedPathname.startsWith(`${allowedPath}/`)
	);
}

async function getPermissionData(): Promise<{
	permissions: Record<string, { paths: string[]; actions: string[] }>;
	customRoleNames: string[];
}> {
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
		return {
			permissions: permissionsCache.permissions,
			customRoleNames: permissionsCache.customRoleNames,
		};
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
	if (!isPublicRoute(req)) {
		await auth.protect();

		const { sessionClaims, userId } = await auth();
		const roles = await getUserRoles(
			sessionClaims as Record<string, unknown> | null,
			userId
		);

		const { permissions, customRoleNames } = await getPermissionData();
		const allowedAppRoles = ['admin', ...customRoleNames];

		const pathname = req.nextUrl.pathname;
		const hasAppAccess = allowedAppRoles.some((r) => roles.includes(r));
		const allowedPaths = new Set<string>();
		for (const role of roles) {
			const permission = permissions[role];
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

		// App-level check: user must have at least one allowed role
		if (!hasAppAccess) {
			return NextResponse.redirect(
				new URL('/error?error=arbitrary_octopus', req.url)
			);
		}

		// Admin short-circuit: admin has access to all paths
		if (roles.includes('admin')) {
			return NextResponse.next();
		}

		// Route-level check for non-admins: path must be allowed for one custom role.
		if (!hasPathAccess) {
			return NextResponse.redirect(
				new URL('/error?error=arbitrary_octopus', req.url)
			);
		}
	}
	return NextResponse.next();
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
