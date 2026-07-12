import { api } from '@workspace/backend/api';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';

export interface XeroAccountLabel {
	code: string;
	name: string;
}

/**
 * Fetches the org's expense accounts once (live, non-reactive) and returns a
 * `Map<accountGUID, { code, name }>` for resolving a trade's stored account
 * GUIDs to their Xero code/name. Used by the Budgets tab to show code badges.
 * Returns an empty map while loading or if the fetch fails.
 */
export function useXeroAccountCodes(): Map<string, XeroAccountLabel> {
	const listAccounts = useAction(api.xero.listAccounts.listAccounts);
	const [labels, setLabels] = useState<Map<string, XeroAccountLabel>>(
		new Map()
	);

	useEffect(() => {
		let active = true;
		listAccounts({})
			.then((result) => {
				if (!active) {
					return;
				}
				const map = new Map<string, XeroAccountLabel>();
				for (const account of result.accounts) {
					map.set(account.id, { code: account.code, name: account.name });
				}
				setLabels(map);
			})
			.catch(() => {
				// Leave the map empty on failure; badges fall back to a generic label.
			});
		return () => {
			active = false;
		};
	}, [listAccounts]);

	return labels;
}
