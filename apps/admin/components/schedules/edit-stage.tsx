'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useEffect } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import DependencyTypeCards from './dependency-type-cards';
import {
	emptyScheduleStageFormValues,
	scheduleStageFormSchema,
	stageFormFieldError,
} from './schedule-stage-form-shared';
import StageCombobox from './stage-combobox';

const FORM_ID = 'edit-stage-form';

export default function EditStage({
	open,
	onOpenChange,
	stage,
	stages,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stage: Doc<'scheduleStages'>;
	stages: Doc<'scheduleStages'>[];
}) {
	const updateStage = useMutation(api.scheduleStages.update.update);

	const form = useForm({
		defaultValues: emptyScheduleStageFormValues,
		validators: {
			onChange: scheduleStageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = scheduleStageFormSchema.parse(value);
				await updateStage({
					stageId: stage._id,
					name: parsed.name,
					dependencyStageId: parsed.dependencyStageId
						? (parsed.dependencyStageId as Id<'scheduleStages'>)
						: undefined,
					dependencyType: parsed.dependencyStageId
						? (parsed.dependencyType ?? 'startAfter')
						: undefined,
				});
				toastManager.add({ title: 'Stage updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update stage. Please try again in a moment.'
					),
					title: 'Could not update stage',
					type: 'error',
				});
				form.reset();
				onOpenChange(false);
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset(
				{
					name: stage.name,
					dependencyStageId: stage.dependencyStageId ?? '',
					dependencyType: stage.dependencyType ?? 'startAfter',
				},
				{ keepDefaultValues: true }
			);
			return;
		}
		form.reset();
	}, [form, open, stage]);

	const otherStages = stages.filter((s) => s._id !== stage._id);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Stage</DialogTitle>
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
											autoFocus
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Stage name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{stageFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						{otherStages.length > 0 ? (
							<form.Field name="dependencyStageId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Depends on
											<span className="ml-1 text-muted-foreground text-xs">
												(optional)
											</span>
										</FieldLabel>
										<StageCombobox
											excludeId={stage._id}
											id={field.name}
											onBlur={field.handleBlur}
											onChange={field.handleChange}
											stages={stages}
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>
						) : null}
						<form.Subscribe selector={(s) => s.values.dependencyStageId}>
							{(depId) =>
								depId ? (
									<form.Field name="dependencyType">
										{(field) => (
											<DependencyTypeCards
												label="Dependency type"
												onChange={(next) => field.handleChange(next)}
												value={field.state.value ?? 'startAfter'}
											/>
										)}
									</form.Field>
								) : null
							}
						</form.Subscribe>
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
					>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
