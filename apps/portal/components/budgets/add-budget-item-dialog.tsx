'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import TradeStageInlineSelect from '@/components/trades/trade-stage-inline-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { isValidMoneyString, parseMoneyString } from './budget-form-shared';
import TradeCombobox from './trade-combobox';

type AddMode = 'existing' | 'new';

export interface AddBudgetItemArgs {
	newTradeName?: string;
	newTradeStageId?: Id<'tradeStages'>;
	newTradeStageName?: string;
	price: number;
	tradeId?: Id<'trades'>;
}

export default function AddBudgetItemDialog({
	excludedTradeIds,
	onSubmit,
	triggerLabel = 'Add Item',
}: {
	excludedTradeIds: Id<'trades'>[];
	onSubmit: (args: AddBudgetItemArgs) => Promise<void>;
	triggerLabel?: string;
}) {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<AddMode>('existing');
	const [tradeId, setTradeId] = useState<Id<'trades'> | ''>('');
	const [newTradeName, setNewTradeName] = useState('');
	const [newTradeStageId, setNewTradeStageId] = useState<
		Id<'tradeStages'> | ''
	>('');
	const [newTradeStageName, setNewTradeStageName] = useState('');
	const [price, setPrice] = useState('0');
	const [isSaving, setIsSaving] = useState(false);

	const trades = useQuery(api.trades.list.list, {}) as
		| Doc<'trades'>[]
		| undefined;

	const excludedTradeIdSet = useMemo(
		() => new Set(excludedTradeIds),
		[excludedTradeIds]
	);
	const availableTrades = useMemo(
		() => trades?.filter((trade) => !excludedTradeIdSet.has(trade._id)),
		[trades, excludedTradeIdSet]
	);

	useEffect(() => {
		if (open) {
			setMode('existing');
			setTradeId('');
			setNewTradeName('');
			setNewTradeStageId('');
			setNewTradeStageName('');
			setPrice('0');
		}
	}, [open]);

	const handleSubmit = async () => {
		const trimmedPrice = price.trim();
		if (!isValidMoneyString(trimmedPrice)) {
			toastManager.add({ title: 'Enter a valid price', type: 'error' });
			return;
		}
		const parsedPrice = parseMoneyString(trimmedPrice);

		if (mode === 'existing' && !tradeId) {
			toastManager.add({ title: 'Select a trade', type: 'error' });
			return;
		}
		if (mode === 'new' && newTradeName.trim().length === 0) {
			toastManager.add({ title: 'Enter a trade name', type: 'error' });
			return;
		}

		setIsSaving(true);
		try {
			await onSubmit({
				price: parsedPrice,
				...(mode === 'new'
					? {
							newTradeName: newTradeName.trim(),
							newTradeStageId: newTradeStageName.trim()
								? undefined
								: newTradeStageId || undefined,
							newTradeStageName: newTradeStageName.trim() || undefined,
						}
					: { tradeId: tradeId as Id<'trades'> }),
			});
			toastManager.add({ title: 'Item added', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add item. Please try again in a moment.'
				),
				title: 'Could not add item',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger
				render={
					<Button variant="outline">
						<Plus />
						{triggerLabel}
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{triggerLabel}</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<ToggleGroup
						aria-label="Add item by"
						onValueChange={(value) => {
							const next = value[0];
							if (next === 'existing' || next === 'new') {
								setMode(next);
							}
						}}
						value={[mode]}
						variant="outline"
					>
						<ToggleGroupItem value="existing">Existing trade</ToggleGroupItem>
						<ToggleGroupItem value="new">New trade</ToggleGroupItem>
					</ToggleGroup>

					{mode === 'existing' ? (
						<Field>
							<FieldLabel htmlFor="add-budget-item-trade">Trade</FieldLabel>
							<TradeCombobox
								id="add-budget-item-trade"
								onBlur={() => {
									/* no-op */
								}}
								onChange={setTradeId}
								trades={availableTrades}
								value={tradeId}
							/>
						</Field>
					) : (
						<>
							<Field>
								<FieldLabel htmlFor="add-budget-item-name">
									Trade name
								</FieldLabel>
								<Input
									id="add-budget-item-name"
									onChange={(e) => setNewTradeName(e.target.value)}
									placeholder="e.g. Electrical"
									value={newTradeName}
								/>
							</Field>
							<TradeStageInlineSelect
								idPrefix="add-budget-item"
								newStageName={newTradeStageName}
								onNewStageNameChange={setNewTradeStageName}
								onStageIdChange={setNewTradeStageId}
								stageId={newTradeStageId}
							/>
						</>
					)}

					<Field>
						<FieldLabel htmlFor="add-budget-item-price">Price</FieldLabel>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<InputGroupText>$</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								id="add-budget-item-price"
								inputMode="decimal"
								nativeInput
								onChange={(e) => setPrice(e.target.value)}
								placeholder="0.00"
								type="text"
								value={price}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>AUD</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						loading={isSaving}
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
					>
						{triggerLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
