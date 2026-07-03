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

type Stage = Doc<'scheduleStages'>;

export default function StageCombobox({
	id,
	disabled,
	stages,
	value,
	onChange,
	onBlur,
	invalid,
	excludeId,
}: {
	id: string;
	disabled?: boolean;
	stages: Stage[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
	excludeId?: string;
}) {
	const items = useMemo(
		() =>
			(stages ?? [])
				.filter((s) => s._id !== excludeId)
				.map((s) => s._id as Id<'scheduleStages'>),
		[stages, excludeId]
	);
	const labelById = useMemo(() => {
		const m = new Map<Id<'scheduleStages'>, string>();
		for (const s of stages ?? []) {
			m.set(s._id, s.name);
		}
		return m;
	}, [stages]);

	const selected =
		value !== '' && items.some((id) => id === value)
			? (value as Id<'scheduleStages'>)
			: null;

	return (
		<Combobox<Id<'scheduleStages'>>
			disabled={disabled || stages === undefined}
			items={items}
			itemToStringLabel={(item) => labelById.get(item) ?? ''}
			onValueChange={(next) => onChange(next ?? '')}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder="No dependency"
				showClear
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No stages available.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'scheduleStages'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
