'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { type ReactElement, useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type Project = Doc<'projects'>;

const ELIGIBLE_PROJECT_STATUSES: readonly Project['status'][] = [
	'not_started',
	'in_progress',
];

function statusLabel(status: Project['status']): string {
	if (status === 'not_started') {
		return 'Not started';
	}
	if (status === 'in_progress') {
		return 'In progress';
	}
	return 'Completed';
}

export default function AddVariantToProjectDialog({
	inclusionVariantId,
	variantLabel,
	trigger,
}: {
	inclusionVariantId: Id<'inclusionVariants'>;
	variantLabel: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [showProjectError, setShowProjectError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const projects = useQuery(api.projects.list.list, {});
	const addProjectInclusion = useMutation(api.projectInclusions.add.add);

	const eligibleProjects = useMemo(
		() =>
			(projects ?? []).filter((project) =>
				ELIGIBLE_PROJECT_STATUSES.includes(project.status)
			),
		[projects]
	);
	const projectIds = useMemo(
		() => eligibleProjects.map((project) => project._id),
		[eligibleProjects]
	);
	const projectNameById = useMemo(() => {
		const map = new Map<Id<'projects'>, string>();
		for (const project of eligibleProjects) {
			map.set(project._id, project.name);
		}
		return map;
	}, [eligibleProjects]);

	const selectedProject =
		selectedProjectId !== '' &&
		projectIds.some((projectId) => projectId === selectedProjectId)
			? (selectedProjectId as Id<'projects'>)
			: null;

	const canSubmit = selectedProject !== null && !isSubmitting;
	const isLoadingProjects = projects === undefined;

	const addToProject = async () => {
		if (!selectedProject) {
			setShowProjectError(true);
			return;
		}

		setShowProjectError(false);
		setIsSubmitting(true);
		try {
			await addProjectInclusion({
				projectId: selectedProject,
				inclusionVariantId,
			});
			toastManager.add({
				description: `${variantLabel} was added to ${projectNameById.get(selectedProject) ?? 'the selected project'}.`,
				title: 'Added to project',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			setOpen(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add this variant to the selected project. Please try again.'
				),
				title: 'Could not add to project',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					setSelectedProjectId('');
					setShowProjectError(false);
					setIsSubmitting(false);
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger} />
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add To Project</DialogTitle>
					<DialogDescription>
						Choose an in-progress or not-started project for this inclusion
						variant.
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 pb-2">
					<Field data-invalid={showProjectError}>
						<FieldLabel htmlFor="add-to-project-combobox">Project</FieldLabel>
						<Combobox<Id<'projects'>>
							disabled={isLoadingProjects || eligibleProjects.length === 0}
							items={projectIds}
							itemToStringLabel={(item) => {
								const projectName = projectNameById.get(item) ?? item;
								const project = eligibleProjects.find(
									(entry) => entry._id === item
								);
								const suffix = project
									? ` (${statusLabel(project.status)})`
									: '';
								return `${projectName}${suffix}`;
							}}
							onValueChange={(next) => {
								setSelectedProjectId(next ?? '');
								setShowProjectError(false);
							}}
							value={selectedProject}
						>
							<ComboboxInput
								aria-invalid={showProjectError || undefined}
								id="add-to-project-combobox"
								onBlur={() => {
									if (!selectedProject) {
										setShowProjectError(true);
									}
								}}
								placeholder={
									isLoadingProjects ? 'Loading projects...' : 'Select a project'
								}
							/>
							<ComboboxPopup>
								<ComboboxEmpty>No eligible projects found.</ComboboxEmpty>
								<ComboboxList>
									{(item: Id<'projects'>) => (
										<ComboboxItem key={item} value={item}>
											{projectNameById.get(item) ?? item}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxPopup>
						</Combobox>
						{showProjectError ? (
							<FieldError>Select a project before adding.</FieldError>
						) : null}
					</Field>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!canSubmit}
						loading={isSubmitting}
						onClick={() => {
							addToProject().catch(() => {
								/* Error handled in addToProject */
							});
						}}
						type="button"
						variant="default"
					>
						Add To Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
