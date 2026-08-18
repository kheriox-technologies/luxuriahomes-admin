'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import type { FunctionReturnType } from 'convex/server';
import type { QuotationSurface } from '@/components/client-quotations/quotation-surface';

export type SigningContext = FunctionReturnType<
	typeof api.clientPortal.quotations.signingContext.signingContext
>;

/** The portal's one access-denied screen. */
export const UNAUTHORIZED_HREF = '/error?error=arbitrary_octopus';

/**
 * The signing session for whichever surface is asking.
 *
 * Paired `'skip'` calls rather than a lookup table, for the reason set out in
 * `quotation-surface.ts`: a union of function references defeats Convex's
 * return-type inference, and the skipped query costs nothing.
 *
 * Live rather than one-shot on purpose — when another signer finishes, this
 * updates, which is what lets the signing page recover from a stale submission
 * without a reload.
 */
export function useSigningContext(
	quotationId: Id<'clientQuotations'>,
	surface: QuotationSurface
): SigningContext | undefined {
	const isClient = surface === 'client';

	const clientContext = useQuery(
		api.clientPortal.quotations.signingContext.signingContext,
		isClient ? { quotationId } : 'skip'
	);
	const adminContext = useQuery(
		api.clientQuotations.signingContext.signingContext,
		isClient ? 'skip' : { quotationId }
	);

	return isClient ? clientContext : adminContext;
}
