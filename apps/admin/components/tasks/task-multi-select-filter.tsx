'use client';

import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
	useComboboxFilter,
} from '@workspace/ui/components/combobox';
import { useMemo, useState } from 'react';

export interface FilterOption {
	label: string;
	value: string;
}

export default function TaskMultiSelectFilter({
	id,
	placeholder,
	options,
	value,
	onChange,
}: {
	id: string;
	placeholder: string;
	options: FilterOption[];
	value: string[];
	onChange: (next: string[]) => void;
}) {
	const [query, setQuery] = useState('');
	const filter = useComboboxFilter();

	const labelByValue = useMemo(() => {
		const map = new Map<string, string>();
		for (const option of options) {
			map.set(option.value, option.label);
		}
		return map;
	}, [options]);

	const selectedSet = new Set(value);
	const unselected = options
		.filter((option) => !selectedSet.has(option.value))
		.map((option) => option.value);
	const filteredValues = unselected.filter((optionValue) =>
		filter.contains(
			optionValue,
			query,
			(candidate) => labelByValue.get(candidate) ?? candidate
		)
	);

	return (
		<Combobox
			filteredItems={filteredValues}
			items={unselected}
			itemToStringLabel={(optionValue) =>
				labelByValue.get(String(optionValue ?? '')) ?? String(optionValue ?? '')
			}
			multiple
			onInputValueChange={(next) => setQuery(next)}
			onValueChange={(next) => {
				onChange(next as string[]);
				setQuery('');
			}}
			value={value}
		>
			<ComboboxChips>
				{value.map((optionValue) => (
					<ComboboxChip key={optionValue}>
						{labelByValue.get(optionValue) ?? optionValue}
					</ComboboxChip>
				))}
				<ComboboxChipsInput
					aria-label={placeholder}
					id={id}
					placeholder={value.length === 0 ? placeholder : undefined}
				/>
			</ComboboxChips>
			<ComboboxPopup>
				<ComboboxEmpty>No matches.</ComboboxEmpty>
				<ComboboxList>
					{(optionValue: string) => (
						<ComboboxItem key={optionValue} value={optionValue}>
							{labelByValue.get(optionValue) ?? optionValue}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
