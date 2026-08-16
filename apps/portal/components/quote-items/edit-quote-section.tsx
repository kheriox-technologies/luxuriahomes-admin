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
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { type ReactElement, useEffect, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteSectionFormValues,
	quoteFormFieldError,
	quoteSectionFormSchema,
} from './quote-form-shared';
import QuoteStageInlineSelect from './quote-stage-inline-select';
import { type ControllableDialogProps, useDialogOpen } from './use-dialog-open';

const FORM_ID = 'edit-quote-section-form';

export default function EditQuoteSection({
	sectionId,
	initialName,
	initialStageId,
	trigger,
	...openProps
}: {
	sectionId: Id<'quoteSections'>;
	initialName: string;
	initialStageId: Id<'quoteStages'>;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const [stageId, setStageId] = useState<Id<'quoteStages'> | ''>(
		initialStageId
	);
	const [newStageName, setNewStageName] = useState('');
	const updateSection = useMutation(api.quoteSections.update.update);
	const addStage = useMutation(api.quoteStages.add.add);

	const resolveStageId = async (): Promise<Id<'quoteStages'>> => {
		const trimmed = newStageName.trim();
		if (trimmed) {
			return await addStage({ name: trimmed });
		}
		if (stageId === '') {
			throw new Error('Select a stage or enter a new stage name');
		}
		return stageId;
	};

	const hasStage = stageId !== '' || newStageName.trim().length > 0;

	const form = useForm({
		defaultValues: emptyQuoteSectionFormValues,
		validators: {
			onChange: quoteSectionFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = quoteSectionFormSchema.parse(value);
				await updateSection({
					sectionId,
					name: parsed.name,
					stageId: await resolveStageId(),
				});
				toastManager.add({ title: 'Section updated', type: 'success' });
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update section. Please try again in a moment.'
					),
					title: 'Could not update section',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		setNewStageName('');
		setStageId(initialStageId);
		if (open) {
			form.reset({ name: initialName }, { keepDefaultValues: true });
			return;
		}
		form.reset();
	}, [form, initialName, initialStageId, open]);

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Section</DialogTitle>
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
							idPrefix="edit-quote-section"
							newStageName={newStageName}
							onNewStageNameChange={setNewStageName}
							onStageIdChange={setStageId}
							stageId={stageId}
						/>
						<form.Field name="name">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Section name</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Section name"
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
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={
							!(
								hasStage &&
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
