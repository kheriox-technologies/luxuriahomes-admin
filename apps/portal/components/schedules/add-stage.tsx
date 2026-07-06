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
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import DependencyTypeCards from './dependency-type-cards';
import {
	emptyScheduleStageFormValues,
	scheduleStageFormSchema,
	stageFormFieldError,
} from './schedule-stage-form-shared';
import StageCombobox from './stage-combobox';

const FORM_ID = 'add-stage-form';

export default function AddStage({
	scheduleTemplateId,
	stages,
}: {
	scheduleTemplateId: Id<'scheduleTemplates'>;
	stages: Doc<'scheduleStages'>[];
}) {
	const [open, setOpen] = useState(false);
	const addStage = useMutation(api.scheduleStages.add.add);

	const form = useForm({
		defaultValues: emptyScheduleStageFormValues,
		validators: {
			onChange: scheduleStageFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = scheduleStageFormSchema.parse(value);
				await addStage({
					scheduleTemplateId,
					name: parsed.name,
					offsetDays: parsed.offsetDays,
					dependencyStageId: parsed.dependencyStageId
						? (parsed.dependencyStageId as Id<'scheduleStages'>)
						: undefined,
					dependencyType: parsed.dependencyStageId
						? (parsed.dependencyType ?? 'startAfter')
						: undefined,
				});
				toastManager.add({ title: 'Stage added', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add stage. Please try again in a moment.'
					),
					title: 'Could not add stage',
					type: 'error',
				});
				form.reset();
				setOpen(false);
			}
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					form.reset();
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={
					<Button variant="outline">
						<Plus />
						Add Stage
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Stage</DialogTitle>
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
						{stages.length > 0 ? (
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
						<form.Field name="offsetDays">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Offset (days)</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											min="0"
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value === '' ? 0 : Number(e.target.value)
												)
											}
											placeholder="0"
											type="number"
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
						<Plus aria-hidden /> Add Stage
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
