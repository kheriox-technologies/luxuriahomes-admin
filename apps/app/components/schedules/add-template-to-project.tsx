'use client';

import { useForm } from '@tanstack/react-form';
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
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
import {
	Popover,
	PopoverPopup,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { CalendarIcon, FolderOpen, TriangleAlert, XIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { z } from 'zod';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	computeProjectScheduleDates,
	startOfDay,
} from '../projects/project-schedule-date-utils';

const FORM_ID = 'add-template-to-project-form';

const formSchema = z.object({
	projectId: z.string().min(1, 'Please select a project'),
	startDate: z.date().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const emptyValues: FormValues = {
	projectId: '',
	startDate: undefined,
};

export default function AddTemplateToProject({
	stages,
	tasks,
	orderTasks,
}: {
	scheduleTemplateId: Id<'scheduleTemplates'>;
	stages: Doc<'scheduleStages'>[];
	tasks: Doc<'scheduleTasks'>[];
	orderTasks: Doc<'scheduleOrderTasks'>[];
}) {
	const [open, setOpen] = useState(false);
	const projects = useQuery(api.projects.list.list);
	const updateProject = useMutation(api.projects.update.update);
	const applyToProject = useMutation(
		api.scheduleTemplates.applyToProject.applyToProject
	);

	const projectMap = useMemo(
		() => new Map((projects ?? []).map((p) => [p._id, p])),
		[projects]
	);

	const form = useForm({
		defaultValues: emptyValues,
		validators: { onChange: formSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = formSchema.parse(value);
			const project = projectMap.get(parsed.projectId as Id<'projects'>);
			if (!project) {
				return;
			}

			try {
				let startDateMs = project.startDate;

				if (!startDateMs) {
					if (!parsed.startDate) {
						toastManager.add({
							title: 'Start date required',
							description: 'Please set a start date for this project.',
							type: 'error',
						});
						return;
					}
					const normalized = startOfDay(parsed.startDate);
					startDateMs = normalized.getTime();
					await updateProject({
						projectId: parsed.projectId as Id<'projects'>,
						startDate: startDateMs,
					});
				}

				const projectStartDate = startOfDay(new Date(startDateMs));
				const { stageDates, taskDates } = computeProjectScheduleDates(
					stages,
					tasks,
					projectStartDate
				);

				const stagePayload = stages.map((s) => ({
					templateStageId: s._id,
					name: s.name,
					order: s.order,
					offsetDays: s.offsetDays,
					dependencyTemplateStageId: s.dependencyStageId,
					dependencyType: s.dependencyType,
					startDate: stageDates.get(s._id)?.startDate ?? startDateMs,
					endDate: stageDates.get(s._id)?.endDate ?? startDateMs,
				}));

				const taskPayload = tasks.map((t) => ({
					templateTaskId: t._id,
					templateStageId: t.stageId,
					name: t.name,
					durationDays: t.durationDays,
					order: t.order,
					offsetDays: t.offsetDays,
					dependencyTemplateTaskId: t.dependencyTaskId,
					dependencyType: t.dependencyType,
					startDate: taskDates.get(t._id)?.startDate ?? startDateMs,
					endDate: taskDates.get(t._id)?.endDate ?? startDateMs,
				}));

				const orderTaskPayload = orderTasks.map((ot) => ({
					templateOrderTaskId: ot._id,
					templateTaskId: ot.parentTaskId,
					name: ot.name,
					durationDays: ot.durationDays,
				}));

				await applyToProject({
					projectId: parsed.projectId as Id<'projects'>,
					stages: stagePayload,
					tasks: taskPayload,
					orderTasks: orderTaskPayload,
				});

				toastManager.add({
					title: 'Schedule applied',
					description: `Template applied to ${project.name}.`,
					type: 'success',
				});
				form.reset();
				setOpen(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not apply template. Please try again.'
					),
					title: 'Could not apply template',
					type: 'error',
				});
			}
		},
	});

	return (
		<Dialog onOpenChange={setOpen} open={open}>
			<DialogTrigger render={<Button type="button" variant="outline" />}>
				<FolderOpen />
				Add to Project
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Template to Project</DialogTitle>
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
							<form.Field name="projectId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>Project</FieldLabel>
										<Combobox<string>
											items={(projects ?? []).map((p) => p._id)}
											itemToStringLabel={(id) =>
												projectMap.get(id as Id<'projects'>)?.name ?? id
											}
											onValueChange={(val) => field.handleChange(val ?? '')}
											value={field.state.value || undefined}
										>
											<ComboboxInput
												id={field.name}
												placeholder="Select a project…"
												showClear
											/>
											<ComboboxPopup>
												<ComboboxEmpty>No projects found.</ComboboxEmpty>
												<ComboboxList>
													{(id: string) => (
														<ComboboxItem key={id} value={id}>
															{projectMap.get(id as Id<'projects'>)?.name ?? id}
														</ComboboxItem>
													)}
												</ComboboxList>
											</ComboboxPopup>
										</Combobox>
										<FieldError>
											{(field.state.meta.errors as unknown[])
												.map((e) => String(e ?? ''))
												.filter(Boolean)
												.join(' ')}
										</FieldError>
									</Field>
								)}
							</form.Field>

							<form.Subscribe selector={(s) => s.values.projectId}>
								{(projectId) => {
									const project = projectMap.get(projectId as Id<'projects'>);
									if (!project) {
										return null;
									}
									if (project.startDate) {
										return null;
									}
									return (
										<div className="flex flex-col gap-3">
											<Alert variant="warning">
												<TriangleAlert />
												<AlertTitle>No start date</AlertTitle>
												<AlertDescription>
													This project has no start date. Please set one to
													calculate schedule dates.
												</AlertDescription>
											</Alert>
											<form.Field name="startDate">
												{(field) => {
													const value = field.state.value;
													const label = value
														? value.toLocaleDateString('en-AU', {
																day: 'numeric',
																month: 'long',
																year: 'numeric',
															})
														: 'Select start date';
													return (
														<Field>
															<FieldLabel htmlFor="start-date-picker">
																Start Date
															</FieldLabel>
															<Popover>
																<PopoverTrigger
																	render={
																		<Button
																			className="w-full justify-start font-normal"
																			id="start-date-picker"
																			type="button"
																			variant="outline"
																		/>
																	}
																>
																	<CalendarIcon
																		aria-hidden
																		className="mr-2 size-4 opacity-60"
																	/>
																	<span
																		className={
																			value ? '' : 'text-muted-foreground'
																		}
																	>
																		{label}
																	</span>
																	{value ? (
																		<span className="ml-auto">
																			<XIcon
																				aria-label="Clear date"
																				className="size-4 opacity-60 hover:opacity-100"
																				onClick={(e) => {
																					e.stopPropagation();
																					field.handleChange(undefined);
																				}}
																			/>
																		</span>
																	) : null}
																</PopoverTrigger>
																<PopoverPopup align="start" side="bottom">
																	<Calendar
																		captionLayout="dropdown"
																		mode="single"
																		onSelect={(date) =>
																			field.handleChange(date ?? undefined)
																		}
																		selected={value}
																	/>
																</PopoverPopup>
															</Popover>
														</Field>
													);
												}}
											</form.Field>
										</div>
									);
								}}
							</form.Subscribe>
						</div>
					</DialogPanel>
				</form>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<form.Subscribe selector={(s) => s.isSubmitting}>
						{(isSubmitting) => (
							<Button disabled={isSubmitting} form={FORM_ID} type="submit">
								{isSubmitting ? 'Applying…' : 'Apply Template'}
							</Button>
						)}
					</form.Subscribe>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
