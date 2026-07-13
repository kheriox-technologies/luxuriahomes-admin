'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { CheckboxCard } from '@workspace/ui/components/checkbox-card';
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useMutation } from 'convex/react';
import { Plus, PlusIcon } from 'lucide-react';
import { type ReactElement, useRef, useState } from 'react';
import { PendingItemsList } from '@/components/lists/pending-items-list';
import { useMultiAdd } from '@/components/lists/use-multi-add';
import { XeroAccountCombobox } from '@/components/xero/xero-accounts-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyTradeFormValues,
	tradeFormFieldError,
	tradeFormSchema,
} from './trade-form-shared';
import TradeStageInlineSelect from './trade-stage-inline-select';

const FORM_ID = 'add-trade-form';

// Xero expense-class account Types offered when creating a new account for a
// trade. The chosen value is sent to the `createAccount` action as `type`.
const XERO_ACCOUNT_TYPES = [
	{ label: 'Direct Costs', value: 'DIRECTCOSTS' },
	{ label: 'Expense', value: 'EXPENSE' },
	{ label: 'Overhead', value: 'OVERHEADS' },
] as const;

type XeroAccountType = (typeof XERO_ACCOUNT_TYPES)[number]['value'];

export default function AddTrade({ trigger }: { trigger?: ReactElement } = {}) {
	const [open, setOpen] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [stageId, setStageId] = useState<Id<'tradeStages'> | ''>('');
	const [newStageName, setNewStageName] = useState('');
	const [xeroAccountId, setXeroAccountId] = useState<string | null>(null);
	// When on, create a matching Xero account (named after the trade) and map to
	// it instead of picking an existing one from the combobox.
	const [createNewXeroAccount, setCreateNewXeroAccount] = useState(false);
	const [xeroAccountType, setXeroAccountType] =
		useState<XeroAccountType>('DIRECTCOSTS');
	const multi = useMultiAdd();
	const nameInputRef = useRef<HTMLInputElement>(null);
	const addTrade = useMutation(api.trades.add.add);
	const addManyTrades = useMutation(api.trades.addMany.addMany);
	const addStage = useMutation(api.tradeStages.add.add);
	const createXeroAccount = useAction(api.xero.createAccount.createAccount);

	// Resolve the chosen stage: create one when a new name is typed, otherwise use
	// the selected stage id (or none, leaving the trade Ungrouped).
	const resolveStageId = async (): Promise<Id<'tradeStages'> | undefined> => {
		const trimmed = newStageName.trim();
		if (trimmed) {
			return await addStage({ name: trimmed });
		}
		return stageId || undefined;
	};

	const resetStage = () => {
		setStageId('');
		setNewStageName('');
		setXeroAccountId(null);
		setCreateNewXeroAccount(false);
		setXeroAccountType('DIRECTCOSTS');
	};

	const form = useForm({
		defaultValues: emptyTradeFormValues,
		validators: {
			onChange: tradeFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = tradeFormSchema.parse(value);
				// Create the Xero account first (when requested) so the trade maps to
				// the freshly created account's id; otherwise use the picked account.
				const resolvedXeroAccountId = createNewXeroAccount
					? (
							await createXeroAccount({
								name: parsed.name,
								type: xeroAccountType,
							})
						).id
					: (xeroAccountId ?? undefined);
				await addTrade({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					stageId: await resolveStageId(),
					xeroAccountId: resolvedXeroAccountId,
				});
				toastManager.add({
					title: 'Trade added',
					type: 'success',
				});
				form.reset();
				multi.reset();
				resetStage();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add trade. Please try again in a moment.'
					),
					title: 'Could not add trade',
					type: 'error',
				});
				form.reset();
				multi.reset();
				resetStage();
				setOpen(false);
			}
		},
	});

	const addCurrentName = (value: string) => {
		if (multi.addItem(value)) {
			form.resetField('name');
			nameInputRef.current?.focus();
		}
	};

	const saveMultiple = async () => {
		if (isSaving) {
			return;
		}
		const names = [...multi.items];
		const trailing = form.state.values.name.trim();
		if (trailing) {
			names.push(trailing);
		}
		if (names.length === 0) {
			return;
		}
		setIsSaving(true);
		try {
			await addManyTrades({ names, stageId: await resolveStageId() });
			toastManager.add({
				title: `${names.length} trades added`,
				type: 'success',
			});
			form.reset();
			multi.reset();
			resetStage();
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add trades. Please try again in a moment.'
				),
				title: 'Could not add trades',
				type: 'error',
			});
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
					multi.reset();
					resetStage();
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<Plus aria-hidden /> Add Trade
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Trade</DialogTitle>
				</DialogHeader>
				<form
					id={FORM_ID}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<DialogPanel className="flex flex-col gap-4">
						<form.Field name="name">
							{(field) => {
								const invalid =
									!multi.isMultiAdd &&
									field.state.meta.isTouched &&
									!field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<div className="flex w-full items-center gap-2">
											<div className="flex-1">
												<Input
													aria-invalid={invalid}
													autoFocus
													id={field.name}
													name={field.name}
													nativeInput
													onBlur={field.handleBlur}
													onChange={(e) => field.handleChange(e.target.value)}
													onKeyDown={(e) => {
														if (e.key === 'Enter') {
															e.preventDefault();
															addCurrentName(field.state.value);
														}
													}}
													placeholder="Trade name"
													ref={nameInputRef}
													value={field.state.value}
												/>
											</div>
											<Button
												aria-label="Add to list"
												onClick={() => addCurrentName(field.state.value)}
												size="icon"
												type="button"
												variant="outline"
											>
												<PlusIcon />
											</Button>
										</div>
										{invalid ? (
											<FieldError>
												{tradeFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						<PendingItemsList items={multi.items} onRemove={multi.removeItem} />
						<TradeStageInlineSelect
							idPrefix="add-trade"
							newStageName={newStageName}
							onNewStageNameChange={setNewStageName}
							onStageIdChange={setStageId}
							stageId={stageId}
						/>
						{multi.isMultiAdd ? null : (
							<>
								<form.Field name="description">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Description
												<span className="ml-1 text-muted-foreground text-xs">
													(optional)
												</span>
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Brief description of this trade"
												rows={3}
												value={field.state.value ?? ''}
											/>
										</Field>
									)}
								</form.Field>
								<Field>
									<FieldLabel htmlFor="add-trade-xero-accounts">
										Xero account
										<span className="ml-1 text-muted-foreground text-xs">
											(optional)
										</span>
									</FieldLabel>
									<CheckboxCard
										checked={createNewXeroAccount}
										description="Create a matching Chart of Accounts entry in Xero, named after this trade, and map the trade to it. Leave off to map to an existing account below."
										onCheckedChange={(checked) => {
											setCreateNewXeroAccount(checked);
											if (checked) {
												setXeroAccountId(null);
											}
										}}
										title="Create a new Xero account"
									/>
									{createNewXeroAccount ? (
										<div className="flex flex-col gap-2">
											<Label htmlFor="add-trade-xero-type">Account type</Label>
											<Select
												onValueChange={(next) =>
													setXeroAccountType(next as XeroAccountType)
												}
												value={xeroAccountType}
											>
												<SelectTrigger id="add-trade-xero-type">
													<SelectValue />
												</SelectTrigger>
												<SelectPopup>
													{XERO_ACCOUNT_TYPES.map((type) => (
														<SelectItem key={type.value} value={type.value}>
															{type.label}
														</SelectItem>
													))}
												</SelectPopup>
											</Select>
											<FieldDescription>
												A new Xero account named after this trade will be
												created with an auto-assigned code and mapped to this
												trade.
											</FieldDescription>
										</div>
									) : (
										<>
											<XeroAccountCombobox
												id="add-trade-xero-accounts"
												onChange={setXeroAccountId}
												value={xeroAccountId}
											/>
											<FieldDescription>
												The Budgets tab “Actual” is this account's Xero spend.
												Each Xero code maps to a single trade.
											</FieldDescription>
										</>
									)}
								</Field>
							</>
						)}
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					{multi.isMultiAdd ? (
						<Button
							disabled={isSaving}
							onClick={saveMultiple}
							type="button"
							variant="outline"
						>
							<Plus aria-hidden /> {`Add ${multi.items.length} Trades`}
						</Button>
					) : (
						<Button
							disabled={
								!(
									form.state.isValid &&
									!form.state.isValidating &&
									!form.state.isSubmitting
								)
							}
							form={FORM_ID}
							type="submit"
							variant="outline"
						>
							<Plus aria-hidden /> Add Trade
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
