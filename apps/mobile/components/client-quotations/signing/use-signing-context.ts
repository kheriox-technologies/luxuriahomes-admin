import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useQuery } from 'convex/react';
import type { QuotationSurface } from '../quotation-surface';

/**
 * The signing session for whichever party is signing.
 *
 * Paired admin/client queries selected with `'skip'`, as everywhere else. Both
 * return `{ authorized: false }` rather than throwing when the caller has no
 * business here, so the screen can redirect instead of erroring.
 */
export function useSigningContext(
	quotationId: Id<'clientQuotations'>,
	surface: QuotationSurface
) {
	const isClient = surface === 'client';
	const adminContext = useQuery(
		api.clientQuotations.signingContext.signingContext,
		isClient ? 'skip' : { quotationId }
	);
	const clientContext = useQuery(
		api.clientPortal.quotations.signingContext.signingContext,
		isClient ? { quotationId } : 'skip'
	);
	return isClient ? clientContext : adminContext;
}
