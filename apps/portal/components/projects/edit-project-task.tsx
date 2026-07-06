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
import {
	Select,
	SelectItem,
	SelectPopup,
	SelectTrigger,
	SelectValue,
} from '@workspace/ui/components/select';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Check } from 'lucide-react';
import { useEffect } from 'react';
import DependencyTypeCards from '@/components/schedules/dependency-type-cards';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { addBusinessDays, snapToWeekday } from './project-schedule-date-utils';
import ProjectTaskCombobox from './project-task-combobox';
import {
	type ProjectTaskFormValues,
	projectTaskFormSchema,
	taskFormFieldError,
} from './project-task-form-shared';

const FORM_ID = 'edit-project-task-form';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Complete'] as const;

export default function EditProjectTask({
	open,
	onOpenChange,
	task,
	stageTasks,
	stageStartDate,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task: Doc<'projectTasks'>;
	stageTasks: Doc<'projectTasks'>[];
	stageStartDate: number;
}) {
	const updateTask = useMutation(api.projectTasks.update.update);

	const defaultValues: ProjectTaskFormValues = {
		name: task.name,
		durationDays: task.durationDays,
		offsetDays: task.offsetDays ?? 0,
		dependencyTaskId: task.dependencyTaskId,
		dependencyType: task.dependencyType ?? 'startAfter',
		status: task.status,
	};

	const form = useForm({
		defaultValues,
		validators: { onChange: projectTaskFormSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = projectTaskFormSchema.parse(value);
			const offset = parsed.offsetDays ?? 0;

			let startDate: Date;
			if (parsed.dependencyTaskId) {
				const depTask = stageTasks.find(
					(t) => t._id === parsed.dependencyTaskId
				);
				if (depTask) {
					startDate =
						parsed.dependencyType === 'startWith'
							? addBusinessDays(new Date(depTask.startDate), offset)
							: addBusinessDays(
									new Date(depTask.startDate),
									depTask.durationDays + offset
								);
				} else {
					startDate = new Date(stageStartDate);
				}
			} else {
				startDate = new Date(stageStartDate);
			}

			startDate = snapToWeekday(startDate);
			const endDate = addBusinessDays(startDate, parsed.durationDays - 1);

			try {
				await updateTask({
					taskId: task._id,
					name: parsed.name,
					durationDays: parsed.durationDays,
					dependencyTaskId: parsed.dependencyTaskId
						? (parsed.dependencyTaskId as Id<'projectTasks'>)
						: undefined,
					dependencyType: parsed.dependencyTaskId
						? (parsed.dependencyType ?? 'startAfter')
						: undefined,
					offsetDays: offset,
					startDate: startDate.getTime(),
					endDate: endDate.getTime(),
					status: parsed.status ?? task.status,
				});
				toastManager.add({ title: 'Task updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update task. Please try again.'
					),
					title: 'Could not update task',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				name: task.name,
				durationDays: task.durationDays,
				offsetDays: task.offsetDays ?? 0,
				dependencyTaskId: task.dependencyTaskId,
				dependencyType: task.dependencyType ?? 'startAfter',
				status: task.status,
			});
		}
	}, [open, task, form]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Task</DialogTitle>
				</DialogHeader>
				<form
					id={FORM_ID}
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<DialogPanel>
						<div className="flex flex-col gap-4">
							<form.Field name="name">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>Name</FieldLabel>
										<Input
											id={field.name}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="Task name"
											value={field.state.value}
										/>
										<FieldError>
											{taskFormFieldError(field.state.meta.errors)}
										</FieldError>
									</Field>
								)}
							</form.Field>

							<form.Field name="durationDays">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Duration (business days)
										</FieldLabel>
										<Input
											id={field.name}
											min={1}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(Number(e.target.value))
											}
											type="number"
											value={field.state.value}
										/>
										<FieldError>
											{taskFormFieldError(field.state.meta.errors)}
										</FieldError>
									</Field>
								)}
							</form.Field>

							<form.Field name="status">
								{(field) => (
									<Field>
										<FieldLabel>Status</FieldLabel>
										<Select
											onValueChange={(val) =>
												field.handleChange(val as Doc<'projectTasks'>['status'])
											}
											value={field.state.value ?? task.status}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectPopup>
												{STATUS_OPTIONS.map((s) => (
													<SelectItem key={s} value={s}>
														{s}
													</SelectItem>
												))}
											</SelectPopup>
										</Select>
									</Field>
								)}
							</form.Field>

							<form.Field name="dependencyTaskId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Dependency Task
										</FieldLabel>
										<ProjectTaskCombobox
											excludeId={task._id}
											id={field.name}
											onBlur={field.handleBlur}
											onChange={(next) => field.handleChange(next || undefined)}
											tasks={stageTasks}
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>

							<form.Subscribe selector={(s) => s.values.dependencyTaskId}>
								{(depId) =>
									depId ? (
										<form.Field name="dependencyType">
											{(field) => (
												<DependencyTypeCards
													onChange={(next) => field.handleChange(next)}
													value={field.state.value ?? 'startAfter'}
												/>
											)}
										</form.Field>
									) : null
								}
							</form.Subscribe>

							<form.Field name="offsetDays">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Offset (business days)
										</FieldLabel>
										<Input
											id={field.name}
											min={0}
											onBlur={field.handleBlur}
											onChange={(e) =>
												field.handleChange(Number(e.target.value))
											}
											type="number"
											value={field.state.value}
										/>
										<FieldError>
											{taskFormFieldError(field.state.meta.errors)}
										</FieldError>
									</Field>
								)}
							</form.Field>
						</div>
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<form.Subscribe selector={(s) => s.isSubmitting}>
						{(isSubmitting) => (
							<Button
								disabled={isSubmitting}
								form={FORM_ID}
								type="submit"
								variant="outline"
							>
								<Check aria-hidden />
								{isSubmitting ? 'Saving…' : 'Save Changes'}
							</Button>
						)}
					</form.Subscribe>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
