'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import {
	Frame,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from '@workspace/ui/components/frame';
import { Input } from '@workspace/ui/components/input';
import {
	NumberField,
	NumberFieldDecrement,
	NumberFieldGroup,
	NumberFieldIncrement,
	NumberFieldInput,
} from '@workspace/ui/components/number-field';
import { Radio, RadioGroup } from '@workspace/ui/components/radio-group';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Info, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
	emptyTaskFormValues,
	taskFormFieldError,
	taskFormSchema,
} from '@/components/stages/task-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

const FORM_ID = 'edit-task-form';

type Task = Doc<'tasks'>;

export default function EditTask({
	task,
	open,
	onOpenChange,
}: {
	task: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [newDepTaskId, setNewDepTaskId] = useState<string | null>(null);
	const [newDepType, setNewDepType] = useState<'after' | 'alongWith'>('after');

	const updateTask = useMutation(api.tasks.update.update);
	const stageTasks = useQuery(api.tasks.list.list, { stageId: task.stageId });

	const form = useForm({
		defaultValues: emptyTaskFormValues,
		validators: {
			onChange: taskFormSchema as never,
		},
		onSubmit: async ({ value }) => {
			try {
				const parsed = taskFormSchema.parse(value);
				await updateTask({
					taskId: task._id,
					name: parsed.name,
					description: parsed.description || undefined,
					duration: parsed.duration,
					dependsOn: parsed.dependsOn.map((d) => ({
						taskId: d.taskId as never,
						type: d.type,
					})),
				});
				toastManager.add({ title: 'Task updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update task. Please try again in a moment.'
					),
					title: 'Could not update task',
					type: 'error',
				});
				onOpenChange(false);
			}
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: intentionally reinitializes only when open changes
	useEffect(() => {
		if (!open) {
			form.reset();
			return;
		}
		form.reset(
			{
				name: task.name,
				description: task.description ?? '',
				duration: task.duration,
				dependsOn: task.dependsOn.map((d) => ({
					taskId: d.taskId,
					type: d.type,
				})),
			},
			{ keepDefaultValues: true }
		);
		setNewDepTaskId(null);
		setNewDepType('after');
	}, [open]);

	function handleAddDependency() {
		if (!newDepTaskId) {
			return;
		}
		const current = form.getFieldValue('dependsOn') ?? [];
		if (current.some((d) => d.taskId === newDepTaskId)) {
			return;
		}
		form.setFieldValue('dependsOn', [
			...current,
			{ taskId: newDepTaskId, type: newDepType },
		]);
		setNewDepTaskId(null);
		setNewDepType('after');
	}

	function handleRemoveDependency(index: number) {
		const current = form.getFieldValue('dependsOn') ?? [];
		form.setFieldValue(
			'dependsOn',
			current.filter((_, i) => i !== index)
		);
	}

	const currentDepIds =
		form.getFieldValue('dependsOn')?.map((d) => d.taskId) ?? [];
	const availableTasks = (stageTasks ?? []).filter(
		(t) => t._id !== task._id && !currentDepIds.includes(t._id)
	);

	const currentDeps = form.getFieldValue('dependsOn') ?? [];
	const taskNameById = new Map((stageTasks ?? []).map((t) => [t._id, t.name]));

	return (
		<Sheet onOpenChange={onOpenChange} open={open}>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<SheetTitle>Edit Task</SheetTitle>
				</SheetHeader>
				<form
					className="flex min-h-0 min-w-0 flex-1 flex-col"
					id={FORM_ID}
					onSubmit={(event) => {
						event.preventDefault();
						form.handleSubmit().catch(() => {
							/* TanStack Form handles validation */
						});
					}}
				>
					<SheetPanel className="flex flex-col gap-6">
						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Task details
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="space-y-4">
								<form.Field name="name">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>Name</FieldLabel>
												<Input
													aria-invalid={invalid}
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
								<form.Field name="description">
									{(field) => (
										<Field>
											<FieldLabel htmlFor={field.name}>
												Description{' '}
												<span className="text-muted-foreground">
													(optional)
												</span>
											</FieldLabel>
											<Textarea
												id={field.name}
												name={field.name}
												onBlur={field.handleBlur}
												onChange={(e) => field.handleChange(e.target.value)}
												placeholder="Task description"
												value={field.state.value ?? ''}
											/>
										</Field>
									)}
								</form.Field>
								<form.Field name="duration">
									{(field) => {
										const invalid =
											field.state.meta.isTouched && !field.state.meta.isValid;
										return (
											<Field data-invalid={invalid}>
												<FieldLabel htmlFor={field.name}>
													Duration (days)
												</FieldLabel>
												<NumberField
													id={field.name}
													min={0}
													onValueChange={(val) => field.handleChange(val ?? 0)}
													value={field.state.value}
												>
													<NumberFieldGroup>
														<NumberFieldDecrement />
														<NumberFieldInput />
														<NumberFieldIncrement />
													</NumberFieldGroup>
												</NumberField>
												{invalid ? (
													<FieldError>
														{taskFormFieldError(field.state.meta.errors)}
													</FieldError>
												) : null}
											</Field>
										);
									}}
								</form.Field>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Add dependency
								</FrameTitle>
							</FrameHeader>
							<FramePanel>
								<div className="flex w-full flex-col gap-2">
									<Combobox
										itemToStringLabel={(val) =>
											taskNameById.get(val as never) ?? String(val ?? '')
										}
										onValueChange={(val) => setNewDepTaskId(val ?? null)}
										value={newDepTaskId}
									>
										<ComboboxInput placeholder="Select task" />
										<ComboboxPopup>
											<ComboboxList>
												<ComboboxEmpty>No tasks available.</ComboboxEmpty>
												{availableTasks.map((t) => (
													<ComboboxItem key={t._id} value={t._id}>
														{t.name}
													</ComboboxItem>
												))}
											</ComboboxList>
										</ComboboxPopup>
									</Combobox>
									<div className="flex w-full items-center gap-3">
										<RadioGroup
											className="flex flex-row gap-4"
											onValueChange={(val) =>
												setNewDepType(val as 'after' | 'alongWith')
											}
											value={newDepType}
										>
											<label
												className="flex cursor-pointer items-center gap-2 text-sm"
												htmlFor="edit-task-dep-after"
											>
												<Radio id="edit-task-dep-after" value="after" />
												After
											</label>
											<label
												className="flex cursor-pointer items-center gap-2 text-sm"
												htmlFor="edit-task-dep-along"
											>
												<Radio id="edit-task-dep-along" value="alongWith" />
												Along with
											</label>
										</RadioGroup>
										<Button
											aria-label="Add dependency"
											className="ml-auto"
											disabled={!newDepTaskId}
											onClick={handleAddDependency}
											size="icon"
											type="button"
											variant="outline"
										>
											<Plus />
										</Button>
									</div>
								</div>
							</FramePanel>
						</Frame>

						<Frame>
							<FrameHeader className="flex flex-row items-center py-3">
								<FrameTitle className="min-w-0 truncate leading-none">
									Dependencies
								</FrameTitle>
							</FrameHeader>
							<FramePanel className="p-0">
								{currentDeps.length === 0 ? (
									<Alert variant="info">
										<Info />
										<AlertDescription>
											No dependencies added yet.
										</AlertDescription>
									</Alert>
								) : (
									<div className="flex w-full flex-col">
										{currentDeps.map((dep, index) => (
											<div
												className="flex w-full items-center justify-between rounded-lg border px-3 py-2"
												key={`${dep.taskId}-${index}`}
											>
												<span className="font-medium text-sm">
													{taskNameById.get(dep.taskId as never) ?? dep.taskId}
												</span>
												<div className="flex items-center gap-2">
													<Badge size="lg" variant="outline">
														{dep.type === 'after' ? 'after' : 'along with'}
													</Badge>
													<Button
														aria-label="Remove dependency"
														onClick={() => handleRemoveDependency(index)}
														size="icon"
														type="button"
														variant="destructive-outline"
													>
														<X />
													</Button>
												</div>
											</div>
										))}
									</div>
								)}
							</FramePanel>
						</Frame>
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
					>
						Save
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
