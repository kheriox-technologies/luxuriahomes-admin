'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
} from '@workspace/ui/components/sheet';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { formatFieldErrors } from '@/components/projects/project-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'investment-transaction-form';

type Transaction = Doc<'investmentTransactions'>;
type TransactionKind = Transaction['kind'];

/** Seeds the picker; anything already used on the ledger is offered too. */
export const TRANSACTION_CATEGORIES = [
	'Deposit',
	'Settlement',
	'Loan Repayment',
	'Styling',
	'Council Rates',
	'Utilities',
	'Electricity',
	'Legal',
	'Other',
] as const;

const transactionSchema = z.object({
	date: z.string().min(1, 'Date is required'),
	description: z.string().trim().min(1, 'Description is required'),
	category: z.string().trim().min(1, 'Category is required'),
	amount: z.number().positive('Amount must be greater than zero'),
	notes: z.string().trim().optional(),
});

/** Defaults, the ledger's existing categories and the current value, de-duped. */
function categoryOptions(
	existing: string[] | undefined,
	current: string
): string[] {
	const seen = new Set<string>();
	const options: string[] = [];
	for (const category of [
		...TRANSACTION_CATEGORIES,
		...(existing ?? []),
		current,
	]) {
		const trimmed = category.trim();
		if (trimmed && !seen.has(trimmed)) {
			seen.add(trimmed);
			options.push(trimmed);
		}
	}
	return options;
}

/** `<input type="date">` works in `yyyy-mm-dd`; the ledger stores UTC midnight. */
function toDateInput(ms: number): string {
	return new Date(ms).toISOString().slice(0, 10);
}

function fromDateInput(value: string): number {
	return new Date(`${value}T00:00:00.000Z`).getTime();
}

export default function InvestmentTransactionSheet({
	categories,
	investmentId,
	kind,
	onOpenChange,
	open,
	transaction,
}: {
	/** Categories already used on this investment, offered alongside the defaults. */
	categories?: string[];
	investmentId: Id<'investments'>;
	/** Which ledger a newly created row lands in. */
	kind: TransactionKind;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	/** Present when editing an existing row. */
	transaction: Transaction | null;
}) {
	const addTransaction = useMutation(
		api.investments.addTransaction.addTransaction
	);
	const updateTransaction = useMutation(
		api.investments.updateTransaction.updateTransaction
	);

	const isEdit = transaction !== null;
	const activeKind = transaction?.kind ?? kind;

	const [creatingCategory, setCreatingCategory] = useState(false);
	const [newCategory, setNewCategory] = useState('');
	const resetNewCategory = () => {
		setCreatingCategory(false);
		setNewCategory('');
	};

	const form = useForm({
		defaultValues: {
			date: toDateInput(transaction?.date ?? Date.now()),
			description: transaction?.description ?? '',
			category: transaction?.category ?? 'Other',
			amount: transaction?.amount ?? 0,
			notes: transaction?.notes ?? '',
		},
		validators: { onChange: transactionSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = transactionSchema.parse(value);
			const payload = {
				kind: activeKind,
				date: fromDateInput(parsed.date),
				description: parsed.description,
				category: parsed.category,
				amount: parsed.amount,
				notes: parsed.notes ? parsed.notes : undefined,
			};
			try {
				if (transaction) {
					await updateTransaction({
						transactionId: transaction._id,
						...payload,
					});
				} else {
					await addTransaction({ investmentId, ...payload });
				}
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					title: isEdit ? 'Could not save changes' : 'Could not add entry',
					description: getConvexErrorMessage(error, 'Please try again.'),
					type: 'error',
				});
			}
		},
	});

	const ledgerLabel = activeKind === 'capital' ? 'capital' : 'holding cost';

	return (
		<Sheet
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					form.reset();
					resetNewCategory();
				}
			}}
			open={open}
		>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>
						{isEdit ? 'Edit entry' : `Add ${ledgerLabel}`}
					</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-4">
						<form.Field name="date">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Date</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="date"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="description">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Description</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Loan Repayment"
											type="text"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="category">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								const options = categoryOptions(categories, field.state.value);
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Category</FieldLabel>
										<Combobox<string>
											items={options}
											itemToStringLabel={(item) => item}
											onValueChange={(next) => {
												if (next) {
													field.handleChange(next);
												}
											}}
											value={field.state.value}
										>
											<ComboboxInput
												aria-invalid={invalid}
												className="w-full"
												id={field.name}
												onBlur={field.handleBlur}
												placeholder="Select a category"
											/>
											<ComboboxPopup>
												<ComboboxEmpty>No category found.</ComboboxEmpty>
												<ComboboxList>
													{(item: string) => (
														<ComboboxItem key={item} value={item}>
															{item}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxPopup>
										</Combobox>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
										{creatingCategory ? (
											<div className="flex flex-col gap-3 rounded-md border p-3">
												<Field>
													<FieldLabel htmlFor="new-category">
														Category name
													</FieldLabel>
													<Input
														id="new-category"
														nativeInput
														onChange={(e) => setNewCategory(e.target.value)}
														placeholder="e.g. Insurance"
														value={newCategory}
													/>
												</Field>
												<div className="flex justify-end gap-2">
													<Button
														onClick={resetNewCategory}
														size="sm"
														type="button"
														variant="outline"
													>
														<X aria-hidden /> Cancel
													</Button>
													<Button
														onClick={() => {
															const name = newCategory.trim();
															if (!name) {
																return;
															}
															field.handleChange(name);
															resetNewCategory();
														}}
														size="sm"
														type="button"
														variant="outline"
													>
														<Plus aria-hidden /> Use category
													</Button>
												</div>
											</div>
										) : (
											<div>
												<Button
													onClick={() => setCreatingCategory(true)}
													size="sm"
													type="button"
													variant="ghost"
												>
													<Plus aria-hidden /> New category
												</Button>
											</div>
										)}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="amount">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Amount</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											inputMode="decimal"
											min={0}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(Number(e.target.value))
											}
											placeholder="0.00"
											step="0.01"
											type="number"
											value={field.state.value === 0 ? '' : field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{formatFieldErrors(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>

						<form.Field name="notes">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Notes</FieldLabel>
									<Input
										id={field.name}
										name={field.name}
										nativeInput
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Optional"
										type="text"
										value={field.state.value}
									/>
								</Field>
							)}
						</form.Field>
					</SheetPanel>
					<SheetFooter>
						<SheetClose render={<Button variant="outline">Cancel</Button>} />
						<form.Subscribe selector={(state) => state.isSubmitting}>
							{(isSubmitting) => (
								<Button
									disabled={isSubmitting}
									form={FORM_ID}
									type="submit"
									variant="outline"
								>
									<Check aria-hidden /> {isEdit ? 'Save' : 'Add'}
								</Button>
							)}
						</form.Subscribe>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
