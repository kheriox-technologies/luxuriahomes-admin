'use client';

import { api } from '@workspace/backend/api';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { useCallback } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

/**
 * Opens a stored quotation PDF in a new tab. Shared by the row menu and the
 * version history, both of which sign the S3 key on demand rather than holding a
 * URL that would expire while the page is open.
 */
export function useOpenQuotationPdf(): (
	s3Key: string | undefined
) => Promise<void> {
	const signUrl = useAction(api.cdn.signUrl.signUrl);

	return useCallback(
		async (s3Key: string | undefined) => {
			if (!s3Key) {
				return;
			}
			try {
				const url = await signUrl({ s3Key });
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
		[signUrl]
	);
}
