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

export default function QuoteStageCombobox({
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
	stages: Doc<'quoteStages'>[] | undefined;
	value: Id<'quoteStages'> | '';
	onChange: (next: Id<'quoteStages'> | '') => void;
	onBlur?: () => void;
	invalid?: boolean;
}) {
	const items = stages ?? [];
	const selected =
		value !== '' ? (items.find((s) => s._id === value) ?? null) : null;
	const busy = stages === undefined;

	return (
		<Combobox<Doc<'quoteStages'>>
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
					{(item: Doc<'quoteStages'>) => (
						<ComboboxItem key={item._id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
