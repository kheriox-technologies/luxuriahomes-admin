'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxCollection,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxGroupLabel,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	groupTradeIdsByStage,
	type TradeIdStageGroup,
} from './trade-stage-form-shared';
import TradeStageInlineSelect from './trade-stage-inline-select';

interface TradeSelectBaseProps {
	/** Show the inline "New trade" affordance (with stage selection). */
	allowCreate?: boolean;
	disabled?: boolean;
	/** Trades to hide from the list (e.g. ones already added). */
	excludeTradeIds?: Id<'trades'>[];
	id?: string;
	invalid?: boolean;
	onBlur?: () => void;
	placeholder?: string;
}

interface TradeSelectSingleProps extends TradeSelectBaseProps {
	multiple?: false;
	onValueChange: (next: Id<'trades'> | '') => void;
	value: Id<'trades'> | '';
}

interface TradeSelectMultiProps extends TradeSelectBaseProps {
	multiple: true;
	onValueChange: (next: Id<'trades'>[]) => void;
	value: Id<'trades'>[];
}

export type TradeSelectProps = TradeSelectSingleProps | TradeSelectMultiProps;

/**
 * The single source of truth for picking trades anywhere in the app. Works as a
 * single- or multi-select (via `multiple`), always groups options by trade stage
 * (with an "Ungrouped" group last), and — when `allowCreate` is set — offers an
 * inline "New trade" flow that lets the user pick an existing stage or create a
 * new one. Creating a trade saves it to the shared catalog immediately and
 * selects it.
 */
export default function TradeSelect(props: TradeSelectProps) {
	const {
		id,
		disabled,
		invalid,
		onBlur,
		placeholder,
		excludeTradeIds,
		allowCreate,
	} = props;

	const trades = useQuery(api.trades.list.list, {});
	const stages = useQuery(api.tradeStages.list.list, {});
	const addTrade = useMutation(api.trades.add.add);
	const addStage = useMutation(api.tradeStages.add.add);

	const [creating, setCreating] = useState(false);
	const [newTradeName, setNewTradeName] = useState('');
	const [newStageId, setNewStageId] = useState<Id<'tradeStages'> | ''>('');
	const [newStageName, setNewStageName] = useState('');
	const [isCreating, setIsCreating] = useState(false);

	const excludeSet = useMemo(
		() => new Set(excludeTradeIds ?? []),
		[excludeTradeIds]
	);
	const availableTrades = useMemo(
		() => (trades ?? []).filter((trade) => !excludeSet.has(trade._id)),
		[trades, excludeSet]
	);
	const labelById = useMemo(() => {
		const map = new Map<Id<'trades'>, string>();
		for (const trade of trades ?? []) {
			map.set(trade._id, trade.name);
		}
		return map;
	}, [trades]);
	const groups = useMemo(
		() => groupTradeIdsByStage(stages, availableTrades),
		[stages, availableTrades]
	);

	const busy = trades === undefined;
	const idPrefix = id ?? 'trade-select';

	const resetCreate = () => {
		setCreating(false);
		setNewTradeName('');
		setNewStageId('');
		setNewStageName('');
	};

	const handleCreate = async () => {
		const name = newTradeName.trim();
		if (!name) {
			toastManager.add({ title: 'Enter a trade name', type: 'error' });
			return;
		}
		setIsCreating(true);
		try {
			const stageName = newStageName.trim();
			const stageId = stageName
				? await addStage({ name: stageName })
				: newStageId || undefined;
			const tradeId = await addTrade({ name, stageId });
			if (props.multiple) {
				props.onValueChange([...props.value, tradeId]);
			} else {
				props.onValueChange(tradeId);
			}
			toastManager.add({ title: 'Trade created', type: 'success' });
			resetCreate();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not create trade. Please try again in a moment.'
				),
				title: 'Could not create trade',
				type: 'error',
			});
		} finally {
			setIsCreating(false);
		}
	};

	const optionGroups = (
		<ComboboxList>
			{(group: TradeIdStageGroup) => (
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
	);

	return (
		<div className="flex w-full flex-col gap-2">
			{props.multiple ? (
				<Combobox<Id<'trades'>, true>
					disabled={disabled || busy}
					items={groups}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					multiple
					onValueChange={(next) =>
						props.onValueChange((next as Id<'trades'>[] | null) ?? [])
					}
					value={props.value}
				>
					<ComboboxChips>
						{props.value.map((tradeId) => (
							<ComboboxChip key={tradeId}>
								{labelById.get(tradeId) ?? tradeId}
							</ComboboxChip>
						))}
						<ComboboxChipsInput
							placeholder={
								busy ? 'Loading trades…' : (placeholder ?? 'Search trades…')
							}
						/>
					</ComboboxChips>
					<ComboboxPopup>
						<ComboboxEmpty>No trade found.</ComboboxEmpty>
						{optionGroups}
					</ComboboxPopup>
				</Combobox>
			) : (
				<Combobox<Id<'trades'>>
					disabled={disabled || busy}
					items={groups}
					itemToStringLabel={(item) => labelById.get(item) ?? ''}
					onValueChange={(next) => props.onValueChange(next ?? '')}
					value={props.value === '' ? null : props.value}
				>
					<ComboboxInput
						aria-invalid={invalid}
						id={id}
						onBlur={onBlur}
						placeholder={
							busy ? 'Loading trades…' : (placeholder ?? 'Search trades')
						}
					/>
					<ComboboxPopup>
						<ComboboxEmpty>No trade found.</ComboboxEmpty>
						{optionGroups}
					</ComboboxPopup>
				</Combobox>
			)}

			{allowCreate && !creating ? (
				<div>
					<Button
						disabled={disabled}
						onClick={() => setCreating(true)}
						size="sm"
						type="button"
						variant="ghost"
					>
						<Plus /> New trade
					</Button>
				</div>
			) : null}

			{allowCreate && creating ? (
				<div className="flex flex-col gap-3 rounded-md border p-3">
					<Field>
						<FieldLabel htmlFor={`${idPrefix}-new-name`}>Trade name</FieldLabel>
						<Input
							id={`${idPrefix}-new-name`}
							nativeInput
							onChange={(e) => setNewTradeName(e.target.value)}
							placeholder="e.g. Electrical"
							value={newTradeName}
						/>
					</Field>
					<TradeStageInlineSelect
						disabled={isCreating}
						idPrefix={`${idPrefix}-new`}
						newStageName={newStageName}
						onNewStageNameChange={setNewStageName}
						onStageIdChange={setNewStageId}
						stageId={newStageId}
					/>
					<div className="flex justify-end gap-2">
						<Button
							disabled={isCreating}
							onClick={resetCreate}
							size="sm"
							type="button"
							variant="outline"
						>
							Cancel
						</Button>
						<Button
							loading={isCreating}
							onClick={() => {
								handleCreate().catch(() => {
									/* Error handled in handleCreate */
								});
							}}
							size="sm"
							type="button"
						>
							Create trade
						</Button>
					</div>
				</div>
			) : null}
		</div>
	);
}
