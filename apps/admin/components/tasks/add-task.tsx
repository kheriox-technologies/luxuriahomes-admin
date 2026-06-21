'use client';

import { useUser } from '@clerk/nextjs';
import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import TaskAssigneeCombobox from '@/components/tasks/task-assignee-combobox';
import TaskDueDatePicker from '@/components/tasks/task-due-date-picker';
import {
	emptyTaskFormValues,
	type TaskStatus,
	taskFormFieldError,
	taskFormSchema,
} from '@/components/tasks/task-form-shared';
import TaskProjectCombobox from '@/components/tasks/task-project-combobox';
import TaskStatusSelect from '@/components/tasks/task-status-select';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'add-task-form';

export default function AddTask() {
	const [open, setOpen] = useState(false);
	const { user } = useUser();
	const addTask = useMutation(api.tasks.add.add);

	const form = useForm({
		defaultValues: emptyTaskFormValues,
		validators: {
			onChange: taskFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			const parsed = taskFormSchema.parse(value);
			try {
				await addTask({
					title: parsed.title,
					description: parsed.description?.trim() || undefined,
					status: parsed.status,
					dueDate: parsed.dueDate ? parsed.dueDate.getTime() : undefined,
					projectId: parsed.projectId
						? (parsed.projectId as Id<'projects'>)
						: undefined,
					assigneeUserId: parsed.assigneeUserId || undefined,
				});
				toastManager.add({ title: 'Task created', type: 'success' });
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not create task. Please try again in a moment.'
					),
					title: 'Could not create task',
					type: 'error',
				});
			}
		},
	});

	return (
		<Sheet
			onOpenChange={(next) => {
				setOpen(next);
				if (next) {
					// Default the assignee to the current admin user.
					form.reset(
						{ ...emptyTaskFormValues, assigneeUserId: user?.id ?? '' },
						{ keepDefaultValues: true }
					);
				} else {
					form.reset();
				}
			}}
			open={open}
		>
			<SheetTrigger
				render={
					<Button variant="default">
						<Plus />
						Add task
					</Button>
				}
			/>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Add task</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation errors */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-4">
						<form.Field name="title">
							{(field) => {
								const invalid =
									field.state.meta.isTouched && !field.state.meta.isValid;
								return (
									<Field data-invalid={invalid}>
										<FieldLabel htmlFor={field.name}>Title</FieldLabel>
										<Input
											aria-invalid={invalid}
											id={field.name}
											name={field.name}
											nativeInput
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Task title"
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

						<form.Field name="description">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Description</FieldLabel>
									<Textarea
										className="min-h-[90px] resize-y"
										id={field.name}
										name={field.name}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										placeholder="Optional description"
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="status">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Status</FieldLabel>
									<TaskStatusSelect
										id={field.name}
										onChange={(next) => field.handleChange(next)}
										value={field.state.value as TaskStatus}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="dueDate">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Due date</FieldLabel>
									<TaskDueDatePicker
										onBlur={field.handleBlur}
										onChange={(date) => field.handleChange(date as never)}
										value={field.state.value as Date | undefined}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="projectId">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Project</FieldLabel>
									<TaskProjectCombobox
										id={field.name}
										onBlur={field.handleBlur}
										onChange={(next) => field.handleChange(next)}
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>

						<form.Field name="assigneeUserId">
							{(field) => (
								<Field>
									<FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
									<TaskAssigneeCombobox
										id={field.name}
										onBlur={field.handleBlur}
										onChange={(next) => field.handleChange(next)}
										value={field.state.value ?? ''}
									/>
								</Field>
							)}
						</form.Field>
					</SheetPanel>
				</form>
				<SheetFooter>
					<SheetClose render={<Button type="button" variant="outline" />}>
						Cancel
					</SheetClose>
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
						variant="default"
					>
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
