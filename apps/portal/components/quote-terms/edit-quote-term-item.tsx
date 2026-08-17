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
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { type ReactElement, useEffect } from 'react';
import {
	type ControllableDialogProps,
	useDialogOpen,
} from '@/components/quote-items/use-dialog-open';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteTermItemFormValues,
	quoteTermFormFieldError,
	quoteTermItemFormSchema,
} from './quote-term-form-shared';
import QuoteTermSectionInlineSelect from './quote-term-section-inline-select';
import { useQuoteTermSectionTarget } from './use-quote-term-section-target';

const FORM_ID = 'edit-quote-term-item-form';

export default function EditQuoteTermItem({
	itemId,
	initialText,
	initialSectionId,
	trigger,
	...openProps
}: {
	itemId: Id<'quoteTermItems'>;
	initialText: string;
	initialSectionId: Id<'quoteTermSections'>;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const updateItem = useMutation(api.quoteTermItems.update.update);
	const target = useQuoteTermSectionTarget(initialSectionId);
	const { reset: resetTarget } = target;

	const form = useForm({
		defaultValues: emptyQuoteTermItemFormValues,
		validators: {
			onChange: quoteTermItemFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteTermItemFormSchema.parse(value);
				await updateItem({
					itemId,
					text: parsed.text,
					sectionId: await target.resolveSectionId(),
				});
				toastManager.add({ title: 'Clause updated', type: 'success' });
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update clause. Please try again in a moment.'
					),
					title: 'Could not update clause',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		resetTarget(initialSectionId);
		if (open) {
			form.reset({ text: initialText }, { keepDefaultValues: true });
			return;
		}
		form.reset();
	}, [form, initialSectionId, initialText, open, resetTarget]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Clause</DialogTitle>
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
						<QuoteTermSectionInlineSelect
							idPrefix="edit-quote-term-item"
							newSectionName={target.newSectionName}
							onNewSectionNameChange={target.setNewSectionName}
							onSectionIdChange={target.setSectionId}
							sectionId={target.sectionId}
						/>
						<form.Field name="text">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Clause</FieldLabel>
										<Textarea
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="The sentence that prints as one bullet on the quotation"
											rows={3}
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{quoteTermFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
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
