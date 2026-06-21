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
	trades: Doc<'trades'>[] | undefined;
	value: Id<'trades'> | '';
	onChange: (next: Id<'trades'> | '') => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const items = trades ?? [];
	const selected =
		value !== '' ? (items.find((t) => t._id === value) ?? null) : null;
	const busy = trades === undefined;

	return (
		<Combobox<Doc<'trades'>>
			disabled={disabled || busy}
			items={items}
			itemToStringLabel={(item) => item.name}
			onValueChange={(next) => {
				onChange(next?._id ?? '');
			}}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder={busy ? 'Loading trades…' : 'Search trades'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No trade found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Doc<'trades'>) => (
						<ComboboxItem key={item._id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
