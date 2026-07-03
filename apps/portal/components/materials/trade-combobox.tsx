'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Combobox,
	ComboboxCollection,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { useQuery } from 'convex/react';
import { useMemo } from 'react';
import { groupTradesByStage } from '@/components/trades/trade-stage-form-shared';

type Trade = Doc<'trades'>;

interface TradeIdGroup {
	items: Id<'trades'>[];
	key: string;
	value: string;
}

export default function TradeCombobox({
	id,
	disabled,
	trades,
	value,
	onChange,
	onBlur,
	invalid,
}: {
	id: string;
	disabled?: boolean;
	trades: Trade[] | undefined;
	value: string;
	onChange: (next: string) => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const stages = useQuery(api.tradeStages.list.list, {});
	const labelById = useMemo(() => {
		const m = new Map<Id<'trades'>, string>();
		for (const t of trades ?? []) {
			m.set(t._id, t.name);
		}
		return m;
	}, [trades]);

	const groups = useMemo<TradeIdGroup[]>(
		() =>
			groupTradesByStage(stages, trades).map((group) => ({
				key: group.key,
				value: group.value,
				items: group.items.map((t) => t._id),
			})),
		[stages, trades]
	);

	const selected =
		value !== '' && labelById.has(value as Id<'trades'>)
			? (value as Id<'trades'>)
			: null;

	const busy = trades === undefined;

	return (
		<Combobox<Id<'trades'>>
			disabled={disabled || busy}
			items={groups}
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
				placeholder={busy ? 'Loading trades…' : 'Select a trade'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No trade found.</ComboboxEmpty>
				<ComboboxList>
					{(group: TradeIdGroup) => (
						<ComboboxGroup items={group.items} key={group.key}>
							<ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
							<ComboboxCollection>
								{(item: Id<'trades'>) => (
									<ComboboxItem key={item} value={item}>
										{labelById.get(item) ?? item}
									</ComboboxItem>
								)}
							</ComboboxCollection>
						</ComboboxGroup>
					)}
				</ComboboxList>
			</ComboboxPopup>
		</Combobox>
	);
}
