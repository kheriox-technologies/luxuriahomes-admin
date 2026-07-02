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

type InclusionCategory = Doc<'inclusionCategories'>;

export default function InclusionCategoryCombobox({
	id,
	disabled,
	categories,
	value,
	onChange,
	onBlur,
	placeholder,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	categories: InclusionCategory[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	placeholder?: string;
	invalid?: boolean;
}) {
	const items = useMemo(
		() => (categories ?? []).map((c) => c._id),
		[categories]
	);
	const labelById = useMemo(() => {
		const m = new Map<Id<'inclusionCategories'>, string>();
		for (const c of categories ?? []) {
			m.set(c._id, c.name);
		}
		return m;
	}, [categories]);

	const selected =
		value !== '' && items.some((idItem) => idItem === value)
			? (value as Id<'inclusionCategories'>)
			: null;

	const busy = categories === undefined;

	return (
		<Combobox<Id<'inclusionCategories'>>
			disabled={disabled || busy || items.length === 0}
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
				placeholder={placeholder}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No category found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'inclusionCategories'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
