'use client';

import {
	Combobox,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
	useComboboxFilter,
} from '@workspace/ui/components/combobox';
import { XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { RoleOption } from './use-role-options';

const CHIP_CLASS =
	'inline-flex shrink-0 items-center rounded-[calc(var(--radius-md)-1px)] bg-accent ps-2 font-medium text-accent-foreground text-sm outline-none';

export default function UserRolesMultiSelect({
	id,
	options,
	value,
	onChange,
	disabled,
	placeholder = 'Select roles…',
}: {
	id: string;
	options: RoleOption[];
	value: string[];
	onChange: (next: string[]) => void;
	disabled?: boolean;
	placeholder?: string;
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

	const labelFor = (optionValue: string) =>
		labelByValue.get(optionValue) ?? optionValue;

	const selectedSet = new Set(value);
	const unselected = options
		.filter((option) => !selectedSet.has(option.value))
		.map((option) => option.value);
	const filteredValues = unselected.filter((optionValue) =>
		filter.contains(optionValue, query, (candidate) => labelFor(candidate))
	);

	const removeValue = (optionValue: string) => {
		onChange(value.filter((current) => current !== optionValue));
	};

	return (
		<Combobox
			disabled={disabled}
			filteredItems={filteredValues}
			items={unselected}
			itemToStringLabel={(optionValue) => labelFor(String(optionValue ?? ''))}
			multiple
			onInputValueChange={(next) => setQuery(next)}
			onValueChange={(next) => {
				onChange(next as string[]);
				setQuery('');
			}}
			value={value}
		>
			<ComboboxChips className="flex-wrap">
				{value.map((optionValue) => (
					<span className={CHIP_CLASS} key={optionValue}>
						<span className="max-w-[160px] truncate">
							{labelFor(optionValue)}
						</span>
						<button
							aria-label={`Remove ${labelFor(optionValue)}`}
							className="flex h-full shrink-0 cursor-pointer items-center px-1.5 opacity-80 hover:opacity-100"
							onClick={() => removeValue(optionValue)}
							type="button"
						>
							<XIcon className="size-3.5" />
						</button>
					</span>
				))}
				<ComboboxChipsInput
					aria-label={placeholder}
					id={id}
					placeholder={value.length === 0 ? placeholder : undefined}
				/>
			</ComboboxChips>
			<ComboboxPopup>
				<ComboboxEmpty>No roles found.</ComboboxEmpty>
				<ComboboxList>
					{(optionValue: string) => (
						<ComboboxItem key={optionValue} value={optionValue}>
							{labelFor(optionValue)}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
