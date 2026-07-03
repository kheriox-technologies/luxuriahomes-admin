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

type Task = Doc<'projectTasks'>;

export default function ProjectTaskCombobox({
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
	tasks: Task[] | undefined;
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
				.map((t) => t._id as Id<'projectTasks'>),
		[tasks, excludeId]
	);
	const labelById = useMemo(() => {
		const m = new Map<Id<'projectTasks'>, string>();
		for (const t of tasks ?? []) {
			m.set(t._id, t.name);
		}
		return m;
	}, [tasks]);

	const selected =
		value !== '' && items.some((id) => id === value)
			? (value as Id<'projectTasks'>)
			: null;

	return (
		<Combobox<Id<'projectTasks'>>
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
					{(item: Id<'projectTasks'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
