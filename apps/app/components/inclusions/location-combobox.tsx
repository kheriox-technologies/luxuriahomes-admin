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

type Location = Doc<'locations'>;

export default function LocationCombobox({
	id,
	disabled,
	locations,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	locations: Location[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const items = useMemo(() => (locations ?? []).map((l) => l._id), [locations]);
	const labelById = useMemo(() => {
		const m = new Map<Id<'locations'>, string>();
		for (const l of locations ?? []) {
			m.set(l._id, l.name);
		}
		return m;
	}, [locations]);

	const selected =
		value !== '' && items.some((idItem) => idItem === value)
			? (value as Id<'locations'>)
			: null;

	const busy = locations === undefined;

	return (
		<Combobox<Id<'locations'>>
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
				className="w-full"
				id={id}
				onBlur={onBlur}
				placeholder="Select a location"
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No location found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'locations'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
