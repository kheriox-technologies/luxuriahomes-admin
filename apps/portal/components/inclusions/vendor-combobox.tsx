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

export default function VendorCombobox({
	id,
	disabled,
	vendors,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	vendors: Doc<'vendors'>[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const items = useMemo(() => (vendors ?? []).map((v) => v.name), [vendors]);

	const selected =
		value !== '' && items.some((name) => name === value) ? value : null;

	const busy = vendors === undefined;

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
				placeholder={busy ? 'Loading vendors…' : 'Search vendors'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No vendor found.</ComboboxEmpty>
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
