'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';

type Project = Doc<'projects'>;

export default function TaskProjectCombobox({
	id,
	value,
	onChange,
	onBlur,
	placeholder = 'No project',
	invalid,
}: {
	id: string;
	value: string;
	onChange: (next: string) => void;
	onBlur?: () => void;
	placeholder?: string;
	invalid?: boolean;
}) {
	const projects = useQuery(api.projects.list.list, {}) as
		| Project[]
		| undefined;

	const items = useMemo(() => (projects ?? []).map((p) => p._id), [projects]);
	const labelById = useMemo(() => {
		const map = new Map<Id<'projects'>, string>();
		for (const p of projects ?? []) {
			map.set(p._id, p.name);
		}
		return map;
	}, [projects]);

	const selected =
		value !== '' && items.some((item) => item === value)
			? (value as Id<'projects'>)
			: null;

	const busy = projects === undefined;

	return (
		<Combobox<Id<'projects'>>
			disabled={busy || items.length === 0}
			items={items}
			itemToStringLabel={(item) => labelById.get(item) ?? ''}
			onValueChange={(next) => onChange(next ?? '')}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder={placeholder}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No project found.</ComboboxEmpty>
				<ComboboxList>
					{(item: Id<'projects'>) => (
						<ComboboxItem key={item} value={item}>
							{labelById.get(item) ?? item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
