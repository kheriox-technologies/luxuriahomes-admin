'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { useXeroAccounts, type XeroAccount } from './use-xero-accounts';

/**
 * Single-select picker for the one Xero Chart-of-Accounts entry a trade maps to
 * (1:1). Accounts (active, expense-class only) are fetched live from Xero via the
 * `listAccounts` action; the option label is `"{code} — {name}"`.
 *
 * To enforce no duplicates, codes already mapped to another trade are shown but
 * disabled and labelled with the trade they belong to. `currentTradeId` excludes
 * the trade being edited so its own code stays selectable.
 *
 * By default the account list is fetched internally (Edit/Add Trade dialogs).
 * Callers rendering many comboboxes (the inline trades-list editor) pass a
 * pre-fetched `accounts`/`loading` so the page fetches the list once.
 */
export function XeroAccountCombobox({
	id,
	disabled,
	value,
	onChange,
	currentTradeId,
	accounts: accountsProp,
	loading: loadingProp,
}: {
	id?: string;
	disabled?: boolean;
	value: string | null;
	onChange: (next: string | null) => void;
	currentTradeId?: Id<'trades'>;
	accounts?: XeroAccount[];
	loading?: boolean;
}) {
	// Only self-fetch when the caller doesn't provide the accounts. The hook is
	// still called unconditionally (rules of hooks); `enabled: false` skips its
	// fetch when the parent already supplies the list.
	const fetched = useXeroAccounts(accountsProp === undefined);
	const accounts = accountsProp ?? fetched.accounts;
	const loading = loadingProp ?? fetched.loading;

	const assignments = useQuery(
		api.trades.listXeroAssignments.listXeroAssignments,
		{}
	);

	const labelById = useMemo(() => {
		const map = new Map<string, string>();
		for (const account of accounts) {
			map.set(account.id, `${account.code} — ${account.name}`);
		}
		return map;
	}, [accounts]);

	// Codes taken by *other* trades → the name they're mapped to (for disabling).
	const takenByOther = useMemo(() => {
		const map = new Map<string, string>();
		for (const assignment of assignments ?? []) {
			if (assignment.tradeId !== currentTradeId) {
				map.set(assignment.accountId, assignment.tradeName);
			}
		}
		return map;
	}, [assignments, currentTradeId]);

	const accountIds = useMemo(() => accounts.map((a) => a.id), [accounts]);

	return (
		<Combobox<string, false>
			disabled={disabled || loading}
			items={accountIds}
			itemToStringLabel={(item) => labelById.get(item) ?? item}
			onValueChange={(next) => onChange(next ?? null)}
			value={value}
		>
			<ComboboxInput
				id={id}
				placeholder={loading ? 'Loading Xero accounts…' : 'Search accounts…'}
				showClear={value != null}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No Xero account found.</ComboboxEmpty>
				<ComboboxList>
					{(item: string) => {
						const takenBy = takenByOther.get(item);
						return (
							<ComboboxItem
								disabled={takenBy !== undefined}
								key={item}
								value={item}
							>
								<div className="flex flex-col">
									<span>{labelById.get(item) ?? item}</span>
									{takenBy ? (
										<span className="text-muted-foreground text-xs">
											Already mapped to {takenBy}
										</span>
									) : null}
								</div>
							</ComboboxItem>
						);
					}}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
