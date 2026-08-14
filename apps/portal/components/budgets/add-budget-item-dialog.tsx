'use client';

import type { Id } from '@workspace/backend/dataModel';
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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import { Check, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import TradeSelect from '@/components/trades/trade-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	isValidMoneyString,
	isValidPercentString,
	parseMoneyString,
	parsePercentString,
} from './budget-form-shared';

export interface AddBudgetItemArgs {
	contingencyPercent: number;
	price: number;
	tradeId: Id<'trades'>;
}

export default function AddBudgetItemDialog({
	excludedTradeIds,
	onSubmit,
	triggerLabel = 'Add Trade',
}: {
	excludedTradeIds: Id<'trades'>[];
	onSubmit: (args: AddBudgetItemArgs) => Promise<void>;
	triggerLabel?: string;
}) {
	const [open, setOpen] = useState(false);
	const [tradeId, setTradeId] = useState<Id<'trades'> | ''>('');
	const [price, setPrice] = useState('0');
	const [contingency, setContingency] = useState('0');
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (open) {
			setTradeId('');
			setPrice('0');
			setContingency('0');
		}
	}, [open]);

	const handleSubmit = async () => {
		const trimmedPrice = price.trim();
		if (!isValidMoneyString(trimmedPrice)) {
			toastManager.add({ title: 'Enter a valid price', type: 'error' });
			return;
		}
		const trimmedContingency = contingency.trim();
		if (
			trimmedContingency !== '' &&
			!isValidPercentString(trimmedContingency)
		) {
			toastManager.add({
				title: 'Enter a contingency between 0 and 100',
				type: 'error',
			});
			return;
		}
		if (!tradeId) {
			toastManager.add({ title: 'Select a trade', type: 'error' });
			return;
		}

		setIsSaving(true);
		try {
			await onSubmit({
				price: parseMoneyString(trimmedPrice),
				contingencyPercent:
					trimmedContingency === ''
						? 0
						: parsePercentString(trimmedContingency),
				tradeId: tradeId as Id<'trades'>,
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
					<Field>
						<FieldLabel htmlFor="add-budget-item-trade">Trade</FieldLabel>
						<TradeSelect
							allowCreate
							excludeTradeIds={excludedTradeIds}
							id="add-budget-item-trade"
							onValueChange={setTradeId}
							value={tradeId}
						/>
					</Field>

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

					<Field>
						<FieldLabel htmlFor="add-budget-item-contingency">
							Contingency
						</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="add-budget-item-contingency"
								inputMode="decimal"
								nativeInput
								onChange={(e) => setContingency(e.target.value)}
								placeholder="0"
								type="text"
								value={contingency}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>%</InputGroupText>
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
						variant="outline"
					>
						<Check aria-hidden />
						{triggerLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
