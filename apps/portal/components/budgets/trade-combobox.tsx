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
import {
	groupTradesByStage,
	type TradeStageGroup,
} from '@/components/trades/trade-stage-form-shared';

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
	trades: Doc<'trades'>[] | undefined;
	value: Id<'trades'> | '';
	onChange: (next: Id<'trades'> | '') => void;
	onBlur: () => void;
	invalid?: boolean;
}) {
	const stages = useQuery(api.tradeStages.list.list, {});
	const items = trades ?? [];
	const groups = useMemo(
		() => groupTradesByStage(stages, trades),
		[stages, trades]
	);
	const selected =
		value !== '' ? (items.find((t) => t._id === value) ?? null) : null;
	const busy = trades === undefined;

	return (
		<Combobox<Doc<'trades'>>
			disabled={disabled || busy}
			items={groups}
			itemToStringLabel={(item) => item.name}
			onValueChange={(next) => {
				onChange(next?._id ?? '');
			}}
			value={selected}
		>
			<ComboboxInput
				aria-invalid={invalid}
				id={id}
				onBlur={onBlur}
				placeholder={busy ? 'Loading trades…' : 'Search trades'}
			/>
			<ComboboxPopup>
				<ComboboxEmpty>No trade found.</ComboboxEmpty>
				<ComboboxList>
					{(group: TradeStageGroup) => (
						<ComboboxGroup items={group.items} key={group.key}>
							<ComboboxGroupLabel>{group.value}</ComboboxGroupLabel>
							<ComboboxCollection>
								{(item: Doc<'trades'>) => (
									<ComboboxItem key={item._id} value={item}>
										{item.name}
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
