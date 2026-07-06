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
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { FolderInput, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
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

export default function AddMaterialToProject({
	materialId,
	materialName,
	unitAbbr,
}: {
	materialId: Id<'materials'>;
	materialName: string;
	unitAbbr: string;
}) {
	const [open, setOpen] = useState(false);
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [showProjectError, setShowProjectError] = useState(false);
	const [quantity, setQuantity] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const projects = useQuery(api.projects.list.list, {});
	const addToProject = useMutation(api.materials.addToProject.addToProject);

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
		projectIds.some((id) => id === selectedProjectId)
			? (selectedProjectId as Id<'projects'>)
			: null;

	const parsedQuantity = Number.parseFloat(quantity);
	const canSubmit =
		selectedProject !== null &&
		quantity !== '' &&
		!Number.isNaN(parsedQuantity) &&
		parsedQuantity > 0 &&
		!isSubmitting;

	const isLoadingProjects = projects === undefined;

	const handleSubmit = async () => {
		if (!selectedProject) {
			setShowProjectError(true);
			return;
		}
		setShowProjectError(false);
		setIsSubmitting(true);
		try {
			await addToProject({
				projectId: selectedProject,
				materialId,
				quantity: parsedQuantity,
			});
			toastManager.add({
				description: `${materialName} was added to ${projectNameById.get(selectedProject) ?? 'the selected project'}.`,
				title: 'Added to project',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			setOpen(false);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add to project. Please try again.'
				),
				title: 'Could not add to project',
				type: 'error',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetState = () => {
		setSelectedProjectId('');
		setShowProjectError(false);
		setQuantity('');
		setIsSubmitting(false);
	};

	return (
		<Dialog
			onOpenChange={(nextOpen) => {
				setOpen(nextOpen);
				if (!nextOpen) {
					resetState();
				}
			}}
			open={open}
		>
			<DialogTrigger
				render={
					<Button type="button" variant="outline">
						<FolderInput />
						Add to Project
					</Button>
				}
			/>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to Project</DialogTitle>
					<DialogDescription>
						Choose an in-progress or not-started project to add this material.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 px-6 pb-2">
					<Field data-invalid={showProjectError}>
						<FieldLabel htmlFor="add-to-project-combobox">Project</FieldLabel>
						<Combobox<Id<'projects'>>
							disabled={isLoadingProjects || eligibleProjects.length === 0}
							items={projectIds}
							itemToStringLabel={(item) => {
								const projectName = projectNameById.get(item) ?? item;
								const project = eligibleProjects.find((p) => p._id === item);
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
					<Field>
						<FieldLabel htmlFor="add-to-project-quantity">Quantity</FieldLabel>
						<InputGroup>
							<InputGroupInput
								id="add-to-project-quantity"
								min="0"
								onChange={(e) => setQuantity(e.target.value)}
								placeholder="e.g. 10"
								step="any"
								type="number"
								value={quantity}
							/>
							{unitAbbr ? (
								<InputGroupAddon align="inline-end">
									<InputGroupText>{unitAbbr}</InputGroupText>
								</InputGroupAddon>
							) : null}
						</InputGroup>
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
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
						variant="outline"
					>
						<Plus aria-hidden />
						Add to Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
