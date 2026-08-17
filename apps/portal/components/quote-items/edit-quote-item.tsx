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
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteItemFormValues,
	quoteFormFieldError,
	quoteItemFormSchema,
} from './quote-form-shared';
import QuoteSectionInlineSelect from './quote-section-inline-select';
import QuoteStageInlineSelect from './quote-stage-inline-select';
import { type ControllableDialogProps, useDialogOpen } from './use-dialog-open';
import { useQuoteTarget } from './use-quote-target';

const FORM_ID = 'edit-quote-item-form';

export default function EditQuoteItem({
	itemId,
	initialName,
	initialIsDefault,
	initialSectionId,
	initialStageId,
	trigger,
	...openProps
}: {
	itemId: Id<'quoteItems'>;
	initialName: string;
	initialIsDefault: boolean;
	initialSectionId: Id<'quoteSections'>;
	initialStageId: Id<'quoteStages'>;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const [isDefault, setIsDefault] = useState(initialIsDefault);
	const updateItem = useMutation(api.quoteItems.update.update);
	const target = useQuoteTarget({
		sectionId: initialSectionId,
		stageId: initialStageId,
	});
	const { reset: resetTarget } = target;

	const form = useForm({
		defaultValues: emptyQuoteItemFormValues,
		validators: {
			onChange: quoteItemFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteItemFormSchema.parse(value);
				await updateItem({
					itemId,
					name: parsed.name,
					isDefault,
					sectionId: await target.resolveSectionId(),
				});
				toastManager.add({ title: 'Item updated', type: 'success' });
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update item. Please try again in a moment.'
					),
					title: 'Could not update item',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		resetTarget({ sectionId: initialSectionId, stageId: initialStageId });
		setIsDefault(initialIsDefault);
		if (open) {
			form.reset({ name: initialName }, { keepDefaultValues: true });
			return;
		}
		form.reset();
	}, [
		form,
		initialIsDefault,
		initialName,
		initialSectionId,
		initialStageId,
		open,
		resetTarget,
	]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Item</DialogTitle>
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
							idPrefix="edit-quote-item"
							newStageName={target.newStageName}
							onNewStageNameChange={target.changeNewStageName}
							onStageIdChange={target.changeStageId}
							stageId={target.stageId}
						/>
						<QuoteSectionInlineSelect
							creatingNewStage={target.creatingNewStage}
							idPrefix="edit-quote-item"
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
										<FieldLabel htmlFor={field.name}>Item text</FieldLabel>
										<Textarea
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Wording that appears on the quote"
											rows={3}
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
						<Check aria-hidden /> Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
