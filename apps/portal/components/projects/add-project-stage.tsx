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
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import DependencyTypeCards from '@/components/schedules/dependency-type-cards';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { addBusinessDays, snapToWeekday } from './project-schedule-date-utils';
import ProjectStageCombobox from './project-stage-combobox';
import {
	emptyProjectStageFormValues,
	projectStageFormSchema,
	stageFormFieldError,
} from './project-stage-form-shared';

const FORM_ID = 'add-project-stage-form';

export default function AddProjectStage({
	open,
	onOpenChange,
	projectId,
	projectStartDate,
	stages,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: Id<'projects'>;
	projectStartDate: number;
	stages: Doc<'projectStages'>[];
}) {
	const addStage = useMutation(api.projectStages.add.add);

	const form = useForm({
		defaultValues: emptyProjectStageFormValues,
		validators: { onChange: projectStageFormSchema as never },
		onSubmit: async ({ value }) => {
			const parsed = projectStageFormSchema.parse(value);

			let startDate: number;
			let endDate: number;

			if (parsed.dependencyStageId) {
				const depStage = stages.find((s) => s._id === parsed.dependencyStageId);
				if (depStage) {
					const offset = parsed.offsetDays ?? 0;
					const rawStart =
						parsed.dependencyType === 'startWith'
							? addBusinessDays(new Date(depStage.startDate), offset)
							: addBusinessDays(new Date(depStage.endDate), offset + 1);
					startDate = snapToWeekday(rawStart).getTime();
				} else {
					startDate = projectStartDate;
				}
			} else {
				startDate = projectStartDate;
			}
			endDate = startDate;

			try {
				await addStage({
					projectId,
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
				});
				toastManager.add({ title: 'Stage added', type: 'success' });
				form.reset();
				onOpenChange(false);
			} catch (error) {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not add stage. Please try again.'
					),
					title: 'Could not add stage',
					type: 'error',
				});
			}
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset();
		}
	}, [open, form]);

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Stage</DialogTitle>
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

							<form.Field name="dependencyStageId">
								{(field) => (
									<Field>
										<FieldLabel htmlFor={field.name}>
											Dependency Stage
										</FieldLabel>
										<ProjectStageCombobox
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
								<Plus aria-hidden />
								{isSubmitting ? 'Adding…' : 'Add Stage'}
							</Button>
						)}
					</form.Subscribe>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
