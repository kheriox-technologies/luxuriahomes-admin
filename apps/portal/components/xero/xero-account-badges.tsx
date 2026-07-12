'use client';

import { Badge } from '@workspace/ui/components/badge';
import type { XeroAccountLabel } from './use-xero-account-codes';

/**
 * Renders one outline badge per Xero account a trade is mapped to, showing the
 * account code (falling back to its name, or a generic "Xero" marker while codes
 * are still loading or for accounts no longer in Xero). Pass the resolved
 * `labelsById` map from `useXeroAccountCodes` so the parent page fetches once.
 */
export function XeroAccountBadges({
	accountIds,
	labelsById,
}: {
	accountIds: string[] | undefined;
	labelsById: Map<string, XeroAccountLabel>;
}) {
	if (!accountIds || accountIds.length === 0) {
		return null;
	}
	return (
		<>
			{accountIds.map((id) => {
				const label = labelsById.get(id);
				const text = label ? label.code || label.name : 'Xero';
				return (
					<Badge
						key={id}
						size="lg"
						title={label ? `${label.code} — ${label.name}` : undefined}
						variant="outline"
					>
						{text}
					</Badge>
				);
			})}
		</>
	);
}
