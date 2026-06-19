import { ConvexError } from 'convex/values';
import type { Doc, Id } from '../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../_generated/server';
import { checkIdentity } from './checkIdentity';

type ReadCtx = Pick<QueryCtx, 'db' | 'auth'> | Pick<MutationCtx, 'db' | 'auth'>;

/**
 * Ensures the current user is a client on the given project and returns the
 * identity, the project, and the matched client.
 *
 * A user is a client of a project when one of the project's `clients` has a
 * `portalUserId` equal to the caller's Clerk user id (`identity.subject`). The
 * portal link is established by `clientPortal/grantAccess`.
 */
export async function requireProjectClient(
	ctx: ReadCtx,
	projectId: Id<'projects'>
): Promise<{
	identity: Awaited<ReturnType<typeof checkIdentity>>;
	project: Doc<'projects'>;
	client: Doc<'projects'>['clients'][number];
}> {
	const identity = await checkIdentity(ctx);
	const project = await ctx.db.get(projectId);
	if (!project) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Project not found',
		});
	}
	const client = project.clients.find(
		(c) => c.portalUserId && c.portalUserId === identity.subject
	);
	if (!client) {
		throw new ConvexError({
			code: 'FORBIDDEN',
			message: 'You do not have access to this project',
		});
	}
	return { identity, project, client };
}

/** Returns a display name for the current client, preferring name then email. */
export function clientDisplayName(identity: {
	name?: string;
	email?: string;
}): string {
	const name = identity.name?.trim();
	if (name) {
		return name;
	}
	const email = identity.email?.trim();
	if (email) {
		return email;
	}
	return 'Client';
}
