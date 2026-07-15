'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import { Card, CardPanel, CardTitle } from '@workspace/ui/components/card';
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
import { AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { type ReactElement, useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import LocationSelect from './location-select';

type Project = Doc<'projects'>;

interface PendingLocation {
	name: string;
	quantity?: number;
	unit?: string;
}

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
	open: openProp,
	onOpenChange: onOpenChangeProp,
}: {
	inclusionVariantId: Id<'inclusionVariants'>;
	variantLabel: string;
	trigger?: ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [openInternal, setOpenInternal] = useState(false);
	const open = openProp ?? openInternal;
	const setOpen = (nextOpen: boolean) => {
		if (openProp === undefined) {
			setOpenInternal(nextOpen);
		}
		onOpenChangeProp?.(nextOpen);
	};
	const [selectedProjectId, setSelectedProjectId] = useState('');
	const [showProjectError, setShowProjectError] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [selectedLocationId, setSelectedLocationId] = useState('');
	const [pendingQuantity, setPendingQuantity] = useState('');
	const [pendingLocations, setPendingLocations] = useState<PendingLocation[]>(
		[]
	);

	const projects = useQuery(api.projects.list.list, {});
	const locations = useQuery(api.locations.list.list, {});
	const inclusionUnit = useQuery(
		api.inclusionVariants.getUnit.getUnit,
		open ? { inclusionVariantId } : 'skip'
	);
	const addProjectInclusion = useMutation(api.projectInclusions.add.add);

	const isLoadingUnit = open && inclusionUnit === undefined;
	const hasUnit = inclusionUnit != null;
	const unitAbbr = inclusionUnit?.abbr ?? '';

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

	const locationNameById = useMemo(() => {
		const map = new Map<Id<'locations'>, string>();
		for (const location of locations ?? []) {
			map.set(location._id, location.name);
		}
		return map;
	}, [locations]);

	const selectedProject =
		selectedProjectId !== '' &&
		projectIds.some((projectId) => projectId === selectedProjectId)
			? (selectedProjectId as Id<'projects'>)
			: null;

	const canSubmit =
		selectedProject !== null && !isSubmitting && hasUnit && !isLoadingUnit;
	const isLoadingProjects = projects === undefined;

	const handleAddLocation = () => {
		const name = locationNameById.get(selectedLocationId as Id<'locations'>);
		if (!name) {
			return;
		}
		const qty =
			pendingQuantity !== '' ? Number.parseFloat(pendingQuantity) : undefined;
		setPendingLocations((prev) => [
			...prev,
			{ name, quantity: qty, unit: unitAbbr || undefined },
		]);
		setSelectedLocationId('');
		setPendingQuantity('');
	};

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
				locations: pendingLocations.length > 0 ? pendingLocations : undefined,
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

	const resetState = () => {
		setSelectedProjectId('');
		setShowProjectError(false);
		setIsSubmitting(false);
		setSelectedLocationId('');
		setPendingQuantity('');
		setPendingLocations([]);
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
			{trigger && <DialogTrigger render={trigger} />}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add To Project</DialogTitle>
					<DialogDescription>
						Choose an in-progress or not-started project for this inclusion
						variant.
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
					<Field>
						<FieldLabel>Locations (optional)</FieldLabel>
						{isLoadingUnit || hasUnit ? null : (
							<Alert variant="warning">
								<AlertTriangle aria-hidden className="size-4 shrink-0" />
								<AlertDescription>
									Set the unit for this inclusion to add locations.
								</AlertDescription>
							</Alert>
						)}
						<div className="flex w-full items-start gap-2">
							<div className="min-w-0 flex-1">
								<LocationSelect
									allowCreate
									disabled={!hasUnit}
									id="add-to-project-location"
									onValueChange={setSelectedLocationId}
									value={selectedLocationId as Id<'locations'> | ''}
								/>
							</div>
							<InputGroup className="w-32 shrink-0">
								<InputGroupInput
									disabled={!hasUnit}
									min="0"
									onChange={(e) => setPendingQuantity(e.target.value)}
									placeholder="Qty"
									type="number"
									value={pendingQuantity}
								/>
								{unitAbbr ? (
									<InputGroupAddon align="inline-end">
										<InputGroupText>{unitAbbr}</InputGroupText>
									</InputGroupAddon>
								) : null}
							</InputGroup>
							<Button
								aria-label="Add location"
								disabled={!(selectedLocationId && hasUnit)}
								onClick={handleAddLocation}
								size="icon"
								type="button"
								variant="outline"
							>
								<Plus />
							</Button>
						</div>
						{pendingLocations.length > 0 ? (
							<div className="flex w-full flex-col gap-1.5 pt-1">
								{pendingLocations.map((entry, i) => (
									<Card key={`${entry.name}-${i}`}>
										<CardPanel className="flex items-center justify-between">
											<CardTitle className="text-sm">{entry.name}</CardTitle>
											<div className="inline-flex items-center gap-2">
												<span className="text-muted-foreground text-sm">
													{entry.quantity != null
														? `${entry.quantity}${entry.unit ? ` ${entry.unit}` : ''}`
														: (entry.unit ?? '')}
												</span>
												<Button
													aria-label={`Remove ${entry.name}`}
													onClick={() =>
														setPendingLocations((prev) =>
															prev.filter((_, idx) => idx !== i)
														)
													}
													size="icon"
													type="button"
													variant="destructive-outline"
												>
													<Trash2 />
												</Button>
											</div>
										</CardPanel>
									</Card>
								))}
							</div>
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
						variant="outline"
					>
						<Plus aria-hidden />
						Add To Project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
