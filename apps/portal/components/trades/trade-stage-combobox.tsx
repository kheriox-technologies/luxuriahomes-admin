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

export default function TradeStageCombobox({
	id,
	disabled,
	stages,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	stages: Doc<'tradeStages'>[] | undefined;
	value: Id<'tradeStages'> | '';
	onChange: (next: Id<'tradeStages'> | '') => void;
	onBlur?: () => void;
	invalid?: boolean;
}) {
	const items = stages ?? [];
	const selected =
		value !== '' ? (items.find((s) => s._id === value) ?? null) : null;
	const busy = stages === undefined;

	return (
		<Combobox<Doc<'tradeStages'>>
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
				placeholder={busy ? 'Loading stages…' : 'Search stages'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No stage found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Doc<'tradeStages'>) => (
						<ComboboxItem key={item._id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
