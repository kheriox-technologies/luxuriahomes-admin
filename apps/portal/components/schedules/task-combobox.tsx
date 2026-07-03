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

type ScheduleTask = Doc<'scheduleTasks'>;

export default function TaskCombobox({
	id,
	disabled,
	tasks,
	value,
	onChange,
	onBlur,
	invalid,
	excludeId,
}: {
	id: string;
	disabled?: boolean;
	tasks: ScheduleTask[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
	excludeId?: string;
}) {
	const items = useMemo(
		() =>
			(tasks ?? [])
				.filter((t) => t._id !== excludeId)
				.map((t) => t._id as Id<'scheduleTasks'>),
		[tasks, excludeId]
	);
	const labelById = useMemo(() => {
		const m = new Map<Id<'scheduleTasks'>, string>();
		for (const t of tasks ?? []) {
			m.set(t._id, t.name);
		}
		return m;
	}, [tasks]);

	const selected =
		value !== '' && items.some((id) => id === value)
			? (value as Id<'scheduleTasks'>)
			: null;

	return (
		<Combobox<Id<'scheduleTasks'>>
			disabled={disabled || tasks === undefined}
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
				<ComboboxEmpty>No tasks available.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'scheduleTasks'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
