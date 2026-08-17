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

export default function QuoteTermSectionCombobox({
	id,
	disabled,
	sections,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	sections: Doc<'quoteTermSections'>[] | undefined;
	value: Id<'quoteTermSections'> | '';
	onChange: (next: Id<'quoteTermSections'> | '') => void;
	onBlur?: () => void;
	invalid?: boolean;
}) {
	const items = sections ?? [];
	const selected =
		value !== '' ? (items.find((s) => s._id === value) ?? null) : null;
	const busy = sections === undefined;

	return (
		<Combobox<Doc<'quoteTermSections'>>
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
				placeholder={busy ? 'Loading sections…' : 'Search sections'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No section found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Doc<'quoteTermSections'>) => (
						<ComboboxItem key={item._id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
