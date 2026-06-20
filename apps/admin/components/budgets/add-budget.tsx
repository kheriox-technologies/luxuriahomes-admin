'use client';

import { api } from '@workspace/backend/api';
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
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	type BudgetDraftValues,
	budgetDraftErrorMessage,
	budgetDraftSchema,
	emptyBudgetDraft,
	parseMoneyString,
} from './budget-form-shared';
import TradeCombobox from './trade-combobox';

export default function AddBudget({
	trigger,
}: {
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	const [draft, setDraft] = useState<BudgetDraftValues>(emptyBudgetDraft);

	const trades = useQuery(api.trades.list.list, {});
	const addBudget = useMutation(api.budgets.add.add);
	const addTrade = useMutation(api.trades.add.add);

	const handleSubmit = async () => {
		const parsed = budgetDraftSchema.safeParse(draft);
		if (!parsed.success) {
			toastManager.add({
				description: budgetDraftErrorMessage(parsed.error),
				title: 'Budget details invalid',
				type: 'error',
			});
			return;
		}
		try {
			const { data } = parsed;
			const newTradeTrimmed = data.newTradeName?.trim();
			const tradeId = newTradeTrimmed
				? await addTrade({ name: newTradeTrimmed })
				: (data.tradeId as Id<'trades'>);
			await addBudget({
				title: data.title,
				description: data.description?.trim() || undefined,
				price: parseMoneyString(data.price),
				tradeId,
			});
			toastManager.add({ title: 'Budget added', type: 'success' });
			setDraft(emptyBudgetDraft);
			setOpen(false);
		} catch (error) {
			setOpen(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add budget. Please try again in a moment.'
				),
				title: 'Could not add budget',
				type: 'error',
			});
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					setDraft(emptyBudgetDraft);
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={
					trigger ?? (
						<Button>
							<Plus />
							Add Budget
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Budget</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="add-budget-title">Title</FieldLabel>
						<Input
							autoFocus
							id="add-budget-title"
							nativeInput
							onChange={(e) =>
								setDraft((p) => ({ ...p, title: e.target.value }))
							}
							placeholder="Budget title"
							value={draft.title}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-budget-description">
							Description{' '}
							<span className="text-muted-foreground text-xs">(optional)</span>
						</FieldLabel>
						<Textarea
							id="add-budget-description"
							onChange={(e) =>
								setDraft((p) => ({ ...p, description: e.target.value }))
							}
							placeholder="Short description"
							rows={3}
							value={draft.description ?? ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-budget-price">Price</FieldLabel>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<InputGroupText>$</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								id="add-budget-price"
								inputMode="decimal"
								nativeInput
								onChange={(e) =>
									setDraft((p) => ({ ...p, price: e.target.value }))
								}
								placeholder="0.00"
								type="text"
								value={draft.price}
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>AUD</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-budget-trade">Trade</FieldLabel>
						<TradeCombobox
							id="add-budget-trade"
							onBlur={() => undefined}
							onChange={(next) => {
								setDraft((p) => ({
									...p,
									tradeId: next,
									newTradeName: next ? '' : p.newTradeName,
								}));
							}}
							trades={trades}
							value={draft.tradeId as Id<'trades'> | ''}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="add-budget-new-trade">
							Or add new trade
						</FieldLabel>
						<Input
							id="add-budget-new-trade"
							nativeInput
							onChange={(e) => {
								setDraft((p) => ({
									...p,
									newTradeName: e.target.value,
									tradeId: e.target.value.trim() ? '' : p.tradeId,
								}));
							}}
							placeholder="New trade name"
							value={draft.newTradeName ?? ''}
						/>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
					>
						Add Budget
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
