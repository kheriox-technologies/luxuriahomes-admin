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
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteItemFormValues,
	quoteFormFieldError,
	quoteItemFormSchema,
} from './quote-form-shared';
import QuoteSectionInlineSelect from './quote-section-inline-select';
import QuoteStageInlineSelect from './quote-stage-inline-select';
import { useQuoteTarget } from './use-quote-target';

const FORM_ID = 'add-quote-item-form';

export default function AddQuoteItem({
	initialStageId,
	initialSectionId,
	trigger,
}: {
	// Prefilled when opened from a section header; both pickers stay editable.
	initialSectionId?: Id<'quoteSections'>;
	initialStageId?: Id<'quoteStages'>;
	trigger?: ReactElement;
} = {}) {
	const [open, setOpen] = useState(false);
	// Items are default-included on new quotations unless explicitly unticked.
	const [isDefault, setIsDefault] = useState(true);
	const addItem = useMutation(api.quoteItems.add.add);
	const target = useQuoteTarget({
		sectionId: initialSectionId,
		stageId: initialStageId,
	});

	const resetAll = () => {
		target.reset({ sectionId: initialSectionId, stageId: initialStageId });
		setIsDefault(true);
	};

	const form = useForm({
		defaultValues: emptyQuoteItemFormValues,
		validators: {
			onChange: quoteItemFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteItemFormSchema.parse(value);
				await addItem({
					name: parsed.name,
					description: parsed.description?.trim() || undefined,
					sectionId: await target.resolveSectionId(),
					isDefault,
				});
				toastManager.add({ title: 'Item added', type: 'success' });
				form.reset();
				resetAll();
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
			}
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
					resetAll();
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={
					trigger ?? (
						<Button variant="outline">
							<Plus aria-hidden /> Add Item
						</Button>
					)
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Item</DialogTitle>
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
						<QuoteStageInlineSelect
							idPrefix="add-quote-item"
							newStageName={target.newStageName}
							onNewStageNameChange={target.changeNewStageName}
							onStageIdChange={target.changeStageId}
							stageId={target.stageId}
						/>
						<QuoteSectionInlineSelect
							creatingNewStage={target.creatingNewStage}
							idPrefix="add-quote-item"
							newSectionName={target.newSectionName}
							onNewSectionNameChange={target.setNewSectionName}
							onSectionIdChange={target.setSectionId}
							sectionId={target.sectionId}
							stageId={target.stageId}
						/>
						<form.Field name="name">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Item name</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="e.g. Site survey and set out"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{quoteFormFieldError(field.state.meta.errors)}
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
										placeholder="Wording that appears under this item on the quote"
										rows={3}
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>
						<CheckboxCard
							checked={isDefault}
							description="Pre-select this item whenever a new quotation is built from the catalogue."
							onCheckedChange={setIsDefault}
							title="Default item"
						/>
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={
							!(
								target.isComplete &&
								form.state.isValid &&
								!form.state.isValidating &&
								!form.state.isSubmitting
							)
						}
						form={FORM_ID}
						type="submit"
						variant="outline"
					>
						<Plus aria-hidden /> Add Item
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
