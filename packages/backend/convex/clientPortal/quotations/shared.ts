import { ConvexError } from 'convex/values';
import type { Doc, Id } from '../../_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../../_generated/server';
import { INITIAL_QUOTATION_STATUS } from '../../clientQuotations/shared';
import { checkIdentity } from '../../lib/checkIdentity';

type ReadCtx = Pick<QueryCtx, 'db' | 'auth'> | Pick<MutationCtx, 'db' | 'auth'>;

/**
 * Quotations carry their clients as name/email/phone and are not tied to a
 * project, so — unlike `requireProjectClient`, which matches on `portalUserId` —
 * a portal user is matched to a quotation by email address. That also means a
 * client invited through a project sees any quotation addressed to them without
 * needing to be linked again.
 */
export function isQuotationClient(
	quotation: Doc<'clientQuotations'>,
	email: string | undefined
): boolean {
	const normalized = email?.trim().toLowerCase();
	if (!normalized) {
		return false;
	}
	return quotation.clients.some(
		(client) => client.email.trim().toLowerCase() === normalized
	);
}

/** Drafts are internal working copies and are never shown to a client. */
export function isVisibleToClients(
	quotation: Doc<'clientQuotations'>
): boolean {
	return quotation.status !== INITIAL_QUOTATION_STATUS;
}

/**
 * Ensures the caller is a client named on the given quotation, and that the
 * quotation has actually been issued. Returns the identity and the quotation so
 * callers don't load it twice.
 */
export async function requireQuotationClient(
	ctx: ReadCtx,
	quotationId: Id<'clientQuotations'>
): Promise<{
	identity: Awaited<ReturnType<typeof checkIdentity>>;
	quotation: Doc<'clientQuotations'>;
}> {
	const identity = await checkIdentity(ctx);
	const quotation = await ctx.db.get(quotationId);
	if (!quotation) {
		throw new ConvexError({
			code: 'NOT_FOUND',
			message: 'Quotation not found',
		});
	}
	if (
		!(
			isQuotationClient(quotation, identity.email) &&
			isVisibleToClients(quotation)
		)
	) {
		throw new ConvexError({
			code: 'FORBIDDEN',
			message: 'You do not have access to this quotation',
		});
	}
	return { identity, quotation };
}
