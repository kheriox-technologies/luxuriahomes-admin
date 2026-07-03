'use client';

import { api } from '@workspace/backend/api';
import { Avatar, AvatarFallback } from '@workspace/ui/components/avatar';
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
import { initialsFromName } from '@/components/tasks/task-form-shared';

export default function TaskAssigneeCombobox({
	id,
	value,
	onChange,
	onBlur,
	placeholder = 'Unassigned',
	invalid,
}: {
	id: string;
	value: string;
	onChange: (next: string) => void;
	onBlur?: () => void;
	placeholder?: string;
	invalid?: boolean;
}) {
	const admins = useQuery(api.adminUsers.list.list, {});

	const items = useMemo(() => (admins ?? []).map((a) => a.userId), [admins]);
	const nameByUserId = useMemo(() => {
		const map = new Map<string, string>();
		for (const a of admins ?? []) {
			map.set(a.userId, a.fullName);
		}
		return map;
	}, [admins]);

	const selected = value !== '' && items.includes(value) ? value : null;

	const busy = admins === undefined;

	return (
		<Combobox<string>
			disabled={busy || items.length === 0}
			items={items}
			itemToStringLabel={(item) => nameByUserId.get(item) ?? ''}
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
				<ComboboxEmpty>No admin users found.</ComboboxEmpty>
				<ComboboxList>
					{(item: string) => {
						const name = nameByUserId.get(item) ?? item;
						return (
							<ComboboxItem key={item} value={item}>
								<span className="flex items-center gap-2">
									<Avatar className="size-6">
										<AvatarFallback className="text-[10px]">
											{initialsFromName(name)}
										</AvatarFallback>
									</Avatar>
									<span className="truncate">{name}</span>
								</span>
							</ComboboxItem>
						);
					}}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
