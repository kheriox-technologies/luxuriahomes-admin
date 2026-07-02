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
import { getConvexErrorMessage } from '@/lib/convex-errors';
import DependencyTypeCards from './dependency-type-cards';
import {
	emptyScheduleTaskFormValues,
	scheduleTaskFormSchema,
	taskFormFieldError,
} from './schedule-task-form-shared';
import TaskCombobox from './task-combobox';

const FORM_ID = 'add-task-form';

export default function AddTask({
	open,
	onOpenChange,
	stageId,
	scheduleTemplateId,
	existingTasks,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stageId: Id<'scheduleStages'>;
	scheduleTemplateId: Id<'scheduleTemplates'>;
	existingTasks: Doc<'scheduleTasks'>[];
}) {
	const addTask = useMutation(api.scheduleTasks.add.add);

	const form = useForm({
		defaultValues: emptyScheduleTaskFormValues,
		validators: {
			onChange: scheduleTaskFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = scheduleTaskFormSchema.parse(value);
				await addTask({
					scheduleTemplateId,
					stageId,
					name: parsed.name,
					durationDays: parsed.durationDays,
					offsetDays: parsed.offsetDays,
					dependencyTaskId: parsed.dependencyTaskId
						? (parsed.dependencyTaskId as Id<'scheduleTasks'>)
						: undefined,
					dependencyType: parsed.dependencyTaskId
						? (parsed.dependencyType ?? 'startAfter')
						: undefined,
				});
				toastManager.add({ title: 'Task added', type: 'success' });
				form.reset();
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add task. Please try again in a moment.'
					),
					title: 'Could not add task',
					type: 'error',
				});
				form.reset();
				onOpenChange(false);
			}
		},
	});

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				onOpenChange(nextOpen);
				if (!nextOpen) {
					form.reset();
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Task</DialogTitle>
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
											placeholder="Task name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{taskFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						<form.Field name="durationDays">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>
											Duration (days)
										</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											min="1"
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(
													e.target.value === '' ? 1 : Number(e.target.value)
												)
											}
											placeholder="1"
											type="number"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{taskFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
						{existingTasks.length > 0 ? (
							<form.Field name="dependencyTaskId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Depends on
											<span className="ml-1 text-muted-foreground text-xs">
												(optional)
											</span>
										</FieldLabel>
										<TaskCombobox
											id={field.name}
											onBlur={field.handleBlur}
											onChange={field.handleChange}
											tasks={existingTasks}
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>
						) : null}
						<form.Subscribe selector={(s) => s.values.dependencyTaskId}>
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
												{taskFormFieldError(field.state.meta.errors)}
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
					>
						Add Task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
