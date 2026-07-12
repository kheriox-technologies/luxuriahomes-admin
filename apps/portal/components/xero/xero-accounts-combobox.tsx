'use client';

import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useMemo } from 'react';
import { useXeroAccounts, type XeroAccount } from './use-xero-accounts';

/**
 * Multi-select chips picker for the Xero Chart-of-Accounts entries a trade maps
 * to. Accounts (active, expense-class only) are fetched live from Xero via the
 * `listAccounts` action (non-reactive). Stores account GUIDs; each chip shows
 * `"{code} — {name}"`, falling back to the raw GUID for accounts that no longer
 * exist so the mapping stays removable.
 *
 * By default the account list is fetched internally (used by the Edit Trade
 * dialog). Callers that render many comboboxes at once — e.g. the inline Xero
 * editor on the trades list — pass a pre-fetched `accounts`/`loading` so the
 * page fetches the list a single time instead of once per instance.
 */
export function XeroAccountsCombobox({
	id,
	disabled,
	value,
	onChange,
	accounts: accountsProp,
	loading: loadingProp,
}: {
	id?: string;
	disabled?: boolean;
	value: string[];
	onChange: (next: string[]) => void;
	accounts?: XeroAccount[];
	loading?: boolean;
}) {
	// Only self-fetch when the caller doesn't provide the accounts. The hook is
	// still called unconditionally (rules of hooks); passing `enabled: false`
	// skips its fetch when the parent already supplies the list.
	const fetched = useXeroAccounts(accountsProp === undefined);
	const accounts = accountsProp ?? fetched.accounts;
	const loading = loadingProp ?? fetched.loading;

	const labelById = useMemo(() => {
		const map = new Map<string, string>();
		for (const account of accounts) {
			map.set(account.id, `${account.code} — ${account.name}`);
		}
		return map;
	}, [accounts]);

	const accountIds = useMemo(() => accounts.map((a) => a.id), [accounts]);

	return (
		<Combobox<string, true>
			disabled={disabled || loading}
			items={accountIds}
			itemToStringLabel={(item) => labelById.get(item) ?? item}
			multiple
			onValueChange={(next) => onChange((next as string[] | null) ?? [])}
			value={value}
		>
			<ComboboxChips>
				{value.map((accountId) => (
					<ComboboxChip key={accountId}>
						{labelById.get(accountId) ?? accountId}
					</ComboboxChip>
				))}
				<ComboboxChipsInput
					id={id}
					placeholder={loading ? 'Loading Xero accounts…' : 'Search accounts…'}
				/>
			</ComboboxChips>
			<ComboboxPopup>
				<ComboboxEmpty>No Xero account found.</ComboboxEmpty>
				<ComboboxList>
					{(item: string) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
