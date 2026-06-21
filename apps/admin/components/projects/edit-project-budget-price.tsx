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
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import {
	isValidMoneyString,
	parseMoneyString,
} from '@/components/budgets/budget-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function EditProjectBudgetPrice({
	projectBudgetId,
	tradeName,
	initialPrice,
	open,
	onOpenChange,
}: {
	projectBudgetId: Id<'projectBudgets'>;
	tradeName: string;
	initialPrice: number;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [price, setPrice] = useState(String(initialPrice));
	const [isSaving, setIsSaving] = useState(false);
	const updatePrice = useMutation(api.projectBudgets.updatePrice.updatePrice);

	useEffect(() => {
		if (open) {
			setPrice(String(initialPrice));
		}
	}, [open, initialPrice]);

	const handleSubmit = async () => {
		const trimmed = price.trim();
		if (!isValidMoneyString(trimmed)) {
			toastManager.add({ title: 'Enter a valid price', type: 'error' });
			return;
		}
		setIsSaving(true);
		try {
			await updatePrice({
				projectBudgetId,
				price: parseMoneyString(trimmed),
			});
			toastManager.add({ title: 'Budget price updated', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update price. Please try again in a moment.'
				),
				title: 'Could not update price',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Budget Price</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel htmlFor="edit-project-budget-price">
							{tradeName} price
						</FieldLabel>
						<InputGroup>
							<InputGroupAddon align="inline-start">
								<InputGroupText>$</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								autoFocus
								id="edit-project-budget-price"
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
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
