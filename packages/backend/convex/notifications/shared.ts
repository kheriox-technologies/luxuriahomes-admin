import type { Id } from '../_generated/dataModel';
import type { MutationCtx } from '../_generated/server';

type NotificationType =
	| 'inclusion_approved'
	| 'inclusion_unapproved'
	| 'inclusion_note'
	| 'document_upload'
	| 'quotation_note'
	| 'quotation_approved';

interface CreateNotificationArgs {
	fromEmail?: string;
	fromName: string;
	link?: string;
	message: string;
	projectId?: Id<'projects'>;
	type: NotificationType;
}

/**
 * Inserts a notification record. Called from within client-portal mutations to
 * record an admin-visible event. Not a mutation itself — it relies on the
 * caller having already verified access.
 */
export async function createNotification(
	ctx: Pick<MutationCtx, 'db'>,
	args: CreateNotificationArgs
): Promise<void> {
	await ctx.db.insert('notifications', {
		type: args.type,
		message: args.message,
		fromName: args.fromName,
		fromEmail: args.fromEmail,
		link: args.link,
		projectId: args.projectId,
		read: false,
	});
}

/** Deep-link to a project's inclusions tab in the admin app. */
export function inclusionsLink(projectId: Id<'projects'>): string {
	return `/projects/${projectId}?tab=inclusions`;
}

/** Deep-link to a project's documents tab in the admin app. */
export function documentsLink(projectId: Id<'projects'>): string {
	return `/projects/${projectId}?tab=documents`;
}

/**
 * Link to the admin quotations list. Quotations have no detail route — the list
 * is where every quotation is read, so it is the best landing spot.
 */
export function quotationsLink(): string {
	return '/quotations';
}
