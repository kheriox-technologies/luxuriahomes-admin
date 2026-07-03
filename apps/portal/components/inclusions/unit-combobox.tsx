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

type Unit = Doc<'units'>;

export default function UnitCombobox({
	id,
	disabled,
	units,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	units: Unit[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const items = useMemo(() => (units ?? []).map((u) => u._id), [units]);
	const labelById = useMemo(() => {
		const m = new Map<Id<'units'>, string>();
		for (const u of units ?? []) {
			m.set(u._id, `${u.label} (${u.abbr})`);
		}
		return m;
	}, [units]);

	const selected =
		value !== '' && items.some((idItem) => idItem === value)
			? (value as Id<'units'>)
			: null;

	const busy = units === undefined;

	return (
		<Combobox<Id<'units'>>
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
				placeholder="Select a unit"
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No unit found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'units'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
