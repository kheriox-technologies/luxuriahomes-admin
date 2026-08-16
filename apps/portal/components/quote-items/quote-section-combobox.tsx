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

export default function QuoteSectionCombobox({
	id,
	disabled,
	sections,
	value,
	onChange,
	onBlur,
	invalid,
	hasStage,
}: {
	id: string;
	disabled?: boolean;
	sections: Doc<'quoteSections'>[] | undefined;
	value: Id<'quoteSections'> | '';
	onChange: (next: Id<'quoteSections'> | '') => void;
	onBlur?: () => void;
	invalid?: boolean;
	// False until a stage is picked; the list can't be loaded before then.
	hasStage: boolean;
}) {
	const items = sections ?? [];
	const selected =
		value !== '' ? (items.find((s) => s._id === value) ?? null) : null;
	const busy = hasStage && sections === undefined;

	const placeholder = (() => {
		if (!hasStage) {
			return 'Select a stage first';
		}
		return busy ? 'Loading sections…' : 'Search sections';
	})();

	return (
		<Combobox<Doc<'quoteSections'>>
			disabled={disabled || busy || !hasStage}
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
				placeholder={placeholder}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No section found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Doc<'quoteSections'>) => (
						<ComboboxItem key={item._id} value={item}>
							{item.name}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
