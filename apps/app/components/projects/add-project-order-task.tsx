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
import {
	emptyOrderTaskFormValues,
	orderTaskFormFieldError,
	orderTaskFormSchema,
} from '@/components/schedules/order-task-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import ProjectTaskCombobox from './project-task-combobox';

const FORM_ID = 'add-project-order-task-form';

export default function AddProjectOrderTask({
	open,
	onOpenChange,
	stageId,
	projectId,
	stageTasks,
	preselectedTaskId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stageId: Id<'projectStages'>;
	projectId: Id<'projects'>;
	stageTasks: Doc<'projectTasks'>[];
	preselectedTaskId?: string;
}) {
	const addOrderTask = useMutation(api.projectOrderTasks.add.add);

	const form = useForm({
		defaultValues: {
			...emptyOrderTaskFormValues,
			parentTaskId: preselectedTaskId ?? '',
		},
		validators: {
			onChange: orderTaskFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = orderTaskFormSchema.parse(value);
				await addOrderTask({
					projectId,
					stageId,
					parentTaskId: parsed.parentTaskId as Id<'projectTasks'>,
					name: parsed.name,
					durationDays: parsed.durationDays,
				});
				toastManager.add({ title: 'Order task added', type: 'success' });
				form.reset();
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add order task. Please try again in a moment.'
					),
					title: 'Could not add order task',
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
					<DialogTitle>Add Order Task</DialogTitle>
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
						<form.Field name="parentTaskId">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Task</FieldLabel>
										<ProjectTaskCombobox
											id={field.name}
											invalid={invalid}
											onBlur={field.handleBlur}
											onChange={field.handleChange}
											tasks={stageTasks}
											value={field.state.value ?? ''}
										/>
										{invalid ? (
											<FieldError>
												{orderTaskFormFieldError(field.state.meta.errors)}
											</FieldError>
										) : null}
									</Field>
								);
							}}
						</form.Field>
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
											placeholder="Order task name"
											value={field.state.value}
										/>
										{invalid ? (
											<FieldError>
												{orderTaskFormFieldError(field.state.meta.errors)}
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
												{orderTaskFormFieldError(field.state.meta.errors)}
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
						Add Order Task
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
