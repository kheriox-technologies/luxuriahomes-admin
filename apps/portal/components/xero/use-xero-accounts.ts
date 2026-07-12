'use client';

import { api } from '@workspace/backend/api';
import { useAction } from 'convex/react';
import { useEffect, useState } from 'react';

export interface XeroAccount {
	code: string;
	id: string;
	name: string;
	type: string;
}

/**
 * Fetches the org's active expense accounts once (live, non-reactive) via the
 * `listAccounts` action. Returns the full account list plus a loading flag so a
 * page can fetch the accounts a single time and share them across many
 * `XeroAccountsCombobox` instances instead of each combobox fetching on mount.
 *
 * Pass `enabled: false` to skip the fetch — used by combobox instances that
 * already receive a pre-fetched list from their parent.
 */
export function useXeroAccounts(enabled = true): {
	accounts: XeroAccount[];
	loading: boolean;
} {
	const listAccounts = useAction(api.xero.listAccounts.listAccounts);
	const [accounts, setAccounts] = useState<XeroAccount[]>([]);
	const [loading, setLoading] = useState(enabled);

	useEffect(() => {
		if (!enabled) {
			return;
		}
		let active = true;
		setLoading(true);
		listAccounts({})
			.then((result) => {
				if (active) {
					setAccounts(result.accounts);
				}
			})
			.catch(() => {
				// Leave the list empty on failure; existing chips stay removable.
			})
			.finally(() => {
				if (active) {
					setLoading(false);
				}
			});
		return () => {
			active = false;
		};
	}, [listAccounts, enabled]);

	return { accounts, loading };
}
