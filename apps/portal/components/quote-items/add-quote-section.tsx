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
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	emptyQuoteSectionFormValues,
	quoteFormFieldError,
	quoteSectionFormSchema,
} from './quote-form-shared';
import QuoteStageInlineSelect from './quote-stage-inline-select';
import { type ControllableDialogProps, useDialogOpen } from './use-dialog-open';

const FORM_ID = 'add-quote-section-form';

export default function AddQuoteSection({
	initialStageId,
	trigger,
	...openProps
}: {
	// Prefilled when opened from a stage header; the picker still allows changing it.
	initialStageId?: Id<'quoteStages'>;
	trigger?: ReactElement;
} & ControllableDialogProps = {}) {
	const { open, setOpen } = useDialogOpen(openProps);
	const [stageId, setStageId] = useState<Id<'quoteStages'> | ''>(
		initialStageId ?? ''
	);
	const [newStageName, setNewStageName] = useState('');
	const addSection = useMutation(api.quoteSections.add.add);
	const addStage = useMutation(api.quoteStages.add.add);

	const resetStage = () => {
		setStageId(initialStageId ?? '');
		setNewStageName('');
	};

	// Create the stage when a new name is typed, otherwise use the selected one.
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
				await addSection({
					name: parsed.name,
					stageId: await resolveStageId(),
				});
				toastManager.add({ title: 'Section added', type: 'success' });
				form.reset();
				resetStage();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add section. Please try again in a moment.'
					),
					title: 'Could not add section',
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
					resetStage();
				}
			}}
			open={open}
		>
			{openProps.open === undefined ? (
				<DialogTrigger
					render={
						trigger ?? (
							<Button variant="outline">
								<Plus aria-hidden /> Add Section
							</Button>
						)
					}
				/>
			) : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Section</DialogTitle>
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
							idPrefix="add-quote-section"
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
											placeholder="e.g. Excavation"
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
						<Plus aria-hidden /> Add Section
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
