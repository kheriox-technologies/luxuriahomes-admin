'use client';

import { api } from '@workspace/backend/api';
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
import { useAction } from 'convex/react';
import { useEffect, useMemo, useState } from 'react';

interface XeroAccount {
	code: string;
	id: string;
	name: string;
	type: string;
}

/**
 * Multi-select chips picker for the Xero Chart-of-Accounts entries a trade maps
 * to. Accounts (active, expense-class only) are fetched live from Xero via the
 * `listAccounts` action (non-reactive). Stores account GUIDs; each chip shows
 * `"{code} — {name}"`, falling back to the raw GUID for accounts that no longer
 * exist so the mapping stays removable.
 */
export function XeroAccountsCombobox({
	id,
	disabled,
	value,
	onChange,
}: {
	id?: string;
	disabled?: boolean;
	value: string[];
	onChange: (next: string[]) => void;
}) {
	const listAccounts = useAction(api.xero.listAccounts.listAccounts);
	const [accounts, setAccounts] = useState<XeroAccount[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
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
	}, [listAccounts]);

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
