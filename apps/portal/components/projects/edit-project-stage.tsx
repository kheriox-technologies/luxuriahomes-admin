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
import ProjectStageCombobox from './project-stage-combobox';
import {
	type ProjectStageFormValues,
	projectStageFormSchema,
	stageFormFieldError,
} from './project-stage-form-shared';

const FORM_ID = 'edit-project-stage-form';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Complete'] as const;

export default function EditProjectStage({
	open,
	onOpenChange,
	stage,
	stages,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	stage: Doc<'projectStages'>;
	stages: Doc<'projectStages'>[];
}) {
	const updateStage = useMutation(api.projectStages.update.update);

	const defaultValues: ProjectStageFormValues = {
		name: stage.name,
		offsetDays: stage.offsetDays ?? 0,
		dependencyStageId: stage.dependencyStageId,
		dependencyType: stage.dependencyType ?? 'startAfter',
		status: stage.status,
	};

	const form = useForm({
		defaultValues,
		validators: { onChange: projectStageFormSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = projectStageFormSchema.parse(value);

			let startDate = stage.startDate;
			let endDate = stage.endDate;

			if (parsed.dependencyStageId) {
				const depStage = stages.find((s) => s._id === parsed.dependencyStageId);
				if (depStage) {
					const offset = parsed.offsetDays ?? 0;
					const rawStart =
						parsed.dependencyType === 'startWith'
							? addBusinessDays(new Date(depStage.startDate), offset)
							: addBusinessDays(new Date(depStage.endDate), offset + 1);
					startDate = snapToWeekday(rawStart).getTime();
					endDate = Math.max(startDate, endDate);
				}
			}

			try {
				await updateStage({
					stageId: stage._id,
					name: parsed.name,
					dependencyStageId: parsed.dependencyStageId
						? (parsed.dependencyStageId as Id<'projectStages'>)
						: undefined,
					dependencyType: parsed.dependencyStageId
						? (parsed.dependencyType ?? 'startAfter')
						: undefined,
					offsetDays: parsed.offsetDays,
					startDate,
					endDate,
					status: parsed.status ?? stage.status,
				});
				toastManager.add({ title: 'Stage updated', type: 'success' });
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not update stage. Please try again.'
					),
					title: 'Could not update stage',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (open) {
			form.reset({
				name: stage.name,
				offsetDays: stage.offsetDays ?? 0,
				dependencyStageId: stage.dependencyStageId,
				dependencyType: stage.dependencyType ?? 'startAfter',
				status: stage.status,
			});
		}
	}, [open, stage, form]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit Stage</DialogTitle>
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
											placeholder="Stage name"
											value={field.state.value}
										/>
										<FieldError>
											{stageFormFieldError(field.state.meta.errors)}
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
												field.handleChange(
													val as Doc<'projectStages'>['status']
												)
											}
											value={field.state.value ?? stage.status}
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

							<form.Field name="dependencyStageId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Dependency Stage
										</FieldLabel>
										<ProjectStageCombobox
											excludeId={stage._id}
											id={field.name}
											onBlur={field.handleBlur}
											onChange={(next) => field.handleChange(next || undefined)}
											stages={stages}
											value={field.state.value ?? ''}
										/>
									</Field>
								)}
							</form.Field>

							<form.Subscribe selector={(s) => s.values.dependencyStageId}>
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
											{stageFormFieldError(field.state.meta.errors)}
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
