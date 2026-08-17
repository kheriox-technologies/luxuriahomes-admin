'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { useCallback } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import type { QuotationSurface } from './quotation-surface';

/**
 * Opens a stored quotation PDF in a new tab. Shared by the row menu and the
 * version history, both of which sign the S3 key on demand rather than holding a
 * URL that would expire while the page is open.
 *
 * The admin signer takes the key alone; the client one is scoped to a quotation
 * and only signs keys belonging to it, so the quotation id rides along.
 */
export function useOpenQuotationPdf(
	surface: QuotationSurface = 'admin'
): (
	s3Key: string | undefined,
	quotationId: Id<'clientQuotations'>
) => Promise<void> {
	const signUrl = useAction(api.cdn.signUrl.signUrl);
	const signClientUrl = useAction(api.clientPortal.quotations.signUrl.signUrl);

	return useCallback(
		async (s3Key: string | undefined, quotationId: Id<'clientQuotations'>) => {
			if (!s3Key) {
				return;
			}
			try {
				const url =
					surface === 'client'
						? await signClientUrl({ quotationId, s3Key })
						: await signUrl({ s3Key });
				window.open(url, '_blank', 'noopener');
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not open the quotation PDF.'
					),
					title: 'Could not open PDF',
					type: 'error',
				});
			}
		},
		[signClientUrl, signUrl, surface]
	);
}
