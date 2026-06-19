'use server';
import { auth } from '@clerk/nextjs/server';

interface SessionMetadata {
	roles?: string[];
}

function getSessionRoles(sessionClaims: unknown): string[] {
	const claims = sessionClaims as { metadata?: unknown } | null | undefined;
	const metadata = claims?.metadata as SessionMetadata | undefined;
	return Array.isArray(metadata?.roles) ? metadata.roles : [];
}

export const hasRole = async (role: string): Promise<boolean> => {
	const { sessionClaims } = await auth();
	const roles = getSessionRoles(sessionClaims);
	return roles.includes(role);
};
