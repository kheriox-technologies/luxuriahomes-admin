'use client';

import type { Doc } from '@workspace/backend/dataModel';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useMemo } from 'react';

export default function MaterialColorCombobox({
	id,
	disabled,
	colors,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	colors: Doc<'materialColors'>[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const items = useMemo(() => (colors ?? []).map((c) => c.name), [colors]);

	const selected =
		value !== '' && items.some((name) => name === value) ? value : null;

	const busy = colors === undefined;

	return (
		<Combobox<string>
			disabled={disabled || busy}
			items={items}
			itemToStringLabel={(item) => item}
			onValueChange={(next) => {
				onChange(next ?? '');
			}}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder={busy ? 'Loading colors…' : 'Search colors'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No color found.</ComboboxEmpty>
				<ComboboxList>
					{(item: string) => (
						<ComboboxItem key={item} value={item}>
							{item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
