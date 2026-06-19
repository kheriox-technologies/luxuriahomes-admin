import {
	clerkClient,
	clerkMiddleware,
	createRouteMatcher,
} from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const CLIENT_ROLE = 'client';

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
		return Array.isArray(roles) && roles.length > 0 ? roles : [];
	} catch {
		return [];
	}
}

const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/error']);

export default clerkMiddleware(async (auth, req) => {
	if (!isPublicRoute(req)) {
		await auth.protect();

		const { sessionClaims, userId } = await auth();
		const roles = await getUserRoles(
			sessionClaims as Record<string, unknown> | null,
			userId
		);

		// Only users with the `client` role may access the portal.
		if (!roles.includes(CLIENT_ROLE)) {
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
