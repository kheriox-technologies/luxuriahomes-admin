'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useMemo } from 'react';

type Trade = Doc<'trades'>;

export default function TradeCombobox({
	id,
	disabled,
	trades,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	trades: Trade[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const items = useMemo(() => (trades ?? []).map((t) => t._id), [trades]);
	const labelById = useMemo(() => {
		const m = new Map<Id<'trades'>, string>();
		for (const t of trades ?? []) {
			m.set(t._id, t.name);
		}
		return m;
	}, [trades]);

	const selected =
		value !== '' && items.some((idItem) => idItem === value)
			? (value as Id<'trades'>)
			: null;

	const busy = trades === undefined;

	return (
		<Combobox<Id<'trades'>>
			disabled={disabled || busy}
			items={items}
			itemToStringLabel={(item) => labelById.get(item) ?? ''}
			onValueChange={(next) => {
				onChange(next ?? '');
			}}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder={busy ? 'Loading trades…' : 'Select a trade'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No trade found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'trades'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
