'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
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
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Plus } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function AddServiceProviderToProject({
	serviceProviderId,
	open: openProp,
	onOpenChange: onOpenChangeProp,
	trigger,
}: {
	serviceProviderId: Id<'serviceProviders'>;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: ReactElement;
}) {
	const [openInternal, setOpenInternal] = useState(false);
	const isControlled = openProp !== undefined;
	const open = isControlled ? (openProp ?? false) : openInternal;
	const setOpen = (next: boolean) => {
		if (isControlled) {
			onOpenChangeProp?.(next);
		} else {
			setOpenInternal(next);
		}
	};

	const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const projects = useQuery(api.projects.list.list, {});
	const addToProject = useMutation(api.projectServiceProviders.add.add);

	const handleSubmit = async () => {
		if (selectedProjectIds.length === 0) {
			return;
		}
		setIsSubmitting(true);
		try {
			await Promise.all(
				selectedProjectIds.map((projectId) =>
					addToProject({
						projectId: projectId as Id<'projects'>,
						serviceProviderId,
					})
				)
			);
			toastManager.add({
				title:
					selectedProjectIds.length === 1
						? 'Added to project'
						: `Added to ${selectedProjectIds.length} projects`,
				type: 'success',
			});
			setSelectedProjectIds([]);
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add to project. Please try again in a moment.'
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
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					setSelectedProjectIds([]);
				}
			}}
			open={open}
		>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to Project</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel>Select projects</FieldLabel>
						<Combobox
							itemToStringLabel={(val) =>
								(projects ?? []).find((p) => p._id === val)?.name ??
								String(val ?? '')
							}
							multiple
							onValueChange={(val) => setSelectedProjectIds(val as string[])}
							value={selectedProjectIds}
						>
							<ComboboxChips>
								{selectedProjectIds.map((id) => {
									const project = (projects ?? []).find((p) => p._id === id);
									return (
										<ComboboxChip key={id}>{project?.name ?? id}</ComboboxChip>
									);
								})}
								<ComboboxChipsInput placeholder="Search projects…" />
							</ComboboxChips>
							<ComboboxPopup>
								<ComboboxList>
									{(projects ?? []).map((project) => (
										<ComboboxItem key={project._id} value={project._id}>
											{project.name}
										</ComboboxItem>
									))}
								</ComboboxList>
							</ComboboxPopup>
						</Combobox>
					</Field>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={selectedProjectIds.length === 0 || isSubmitting}
						loading={isSubmitting}
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
						variant="outline"
					>
						<Plus aria-hidden /> Add to project
						{selectedProjectIds.length > 1 ? 's' : ''}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
