'use client';

import { useForm } from '@tanstack/react-form';
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
import {
	Field,
	FieldDescription,
	FieldError,
	FieldLabel,
} from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { XeroAccountCombobox } from '@/components/xero/xero-accounts-combobox';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyTradeFormValues,
	tradeFormFieldError,
	tradeFormSchema,
} from './trade-form-shared';
import TradeStageInlineSelect from './trade-stage-inline-select';

const FORM_ID = 'edit-trade-form';

export default function EditTrade({
	tradeId,
	initialName,
	initialDescription,
	initialStageId,
	trigger,
}: {
	tradeId: Id<'trades'>;
	initialName: string;
	initialDescription?: string;
	initialStageId?: Id<'tradeStages'>;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [stageId, setStageId] = useState<Id<'tradeStages'> | ''>('');
	const [newStageName, setNewStageName] = useState('');
	// Self-fetch the trade's Xero account mapping only while the dialog is open,
	// so the three EditTrade call sites don't have to thread it through as a prop.
	const trade = useQuery(api.trades.get.get, open ? { tradeId } : 'skip');
	const [xeroAccountId, setXeroAccountId] = useState<string | null>(null);
	const updateTrade = useMutation(api.trades.update.update);
	const addStage = useMutation(api.tradeStages.add.add);

	// Resolve the target stage: create one from a typed name, use the selected id,
	// or null to move the trade to Ungrouped.
	const resolveStageId = async (): Promise<Id<'tradeStages'> | null> => {
		const trimmed = newStageName.trim();
		if (trimmed) {
			return await addStage({ name: trimmed });
		}
		return stageId || null;
	};

	const form = useForm({
		defaultValues: emptyTradeFormValues,
		validators: {
			onChange: tradeFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = tradeFormSchema.parse(value);
				await updateTrade({
					tradeId,
					name: parsed.name,
					// Always send a string (empty clears it) so the backend can tell an
					// intentional clear apart from a name-only update that omits it.
					description: parsed.description ?? '',
					stageId: await resolveStageId(),
					// Always send the mapping (null clears it) — same rationale.
					xeroAccountId,
				});
				toastManager.add({
					title: 'Trade updated',
					type: 'success',
				});
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update trade. Please try again in a moment.'
					),
					title: 'Could not update trade',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					name: initialName,
					description: initialDescription ?? '',
				},
				{ keepDefaultValues: true }
			);
			setStageId(initialStageId ?? '');
			setNewStageName('');
			return;
		}
		form.reset();
		setStageId('');
		setNewStageName('');
		setXeroAccountId(null);
	}, [form, initialName, initialDescription, initialStageId, open]);

	// Seed the Xero account mapping once the trade query resolves after opening.
	useEffect(() => {
		if (open && trade) {
			setXeroAccountId(trade.xeroAccountId ?? null);
		}
	}, [open, trade]);

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
			}}
			open={open}
		>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Trade</DialogTitle>
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
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Trade name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{tradeFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
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
						<TradeStageInlineSelect
							idPrefix="edit-trade"
							newStageName={newStageName}
							onNewStageNameChange={setNewStageName}
							onStageIdChange={setStageId}
							stageId={stageId}
						/>
						<Field>
							<FieldLabel htmlFor="edit-trade-xero-accounts">
								Xero account
								<span className="ml-1 text-muted-foreground text-xs">
									(optional)
								</span>
							</FieldLabel>
							<XeroAccountCombobox
								currentTradeId={tradeId}
								id="edit-trade-xero-accounts"
								onChange={setXeroAccountId}
								value={xeroAccountId}
							/>
							<FieldDescription>
								The Budgets tab “Actual” is this account's Xero spend. Each Xero
								code maps to a single trade.
							</FieldDescription>
						</Field>
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
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
						<Check aria-hidden /> Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
