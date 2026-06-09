'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxEmpty,
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
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function AddExistingServiceProviderToProject({
	projectId,
	open: openProp,
	onOpenChange: onOpenChangeProp,
	trigger,
}: {
	projectId: Id<'projects'>;
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

	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const allProviders = useQuery(api.serviceProviders.list.list, {});
	const linked = useQuery(api.projectServiceProviders.listByProject.list, {
		projectId,
	});
	const addToProject = useMutation(api.projectServiceProviders.add.add);

	const linkedIds = new Set(linked?.map((p) => p._id) ?? []);
	const available = (allProviders ?? []).filter((p) => !linkedIds.has(p._id));
	const availableIds = available.map((p) => p._id);

	const handleSubmit = async () => {
		if (selectedIds.length === 0) {
			return;
		}
		setIsSubmitting(true);
		try {
			await Promise.all(
				selectedIds.map((serviceProviderId) =>
					addToProject({
						projectId,
						serviceProviderId: serviceProviderId as Id<'serviceProviders'>,
					})
				)
			);
			toastManager.add({
				title:
					selectedIds.length === 1
						? 'Added to project'
						: `Added ${selectedIds.length} service providers to project`,
				type: 'success',
			});
			setSelectedIds([]);
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
					setSelectedIds([]);
				}
			}}
			open={open}
		>
			{trigger ? <DialogTrigger render={trigger} /> : null}
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add Existing Service Provider</DialogTitle>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-4">
					<Field>
						<FieldLabel>Select service providers</FieldLabel>
						<Combobox
							items={availableIds}
							itemToStringLabel={(val) =>
								(allProviders ?? []).find((p) => p._id === val)?.company ??
								String(val ?? '')
							}
							multiple
							onValueChange={(val) => setSelectedIds(val as string[])}
							value={selectedIds}
						>
							<ComboboxChips>
								{selectedIds.map((id) => {
									const provider = (allProviders ?? []).find(
										(p) => p._id === id
									);
									return (
										<ComboboxChip key={id}>
											{provider?.company ?? id}
										</ComboboxChip>
									);
								})}
								<ComboboxChipsInput placeholder="Search service providers…" />
							</ComboboxChips>
							<ComboboxPopup>
								<ComboboxEmpty>No service providers found.</ComboboxEmpty>
								<ComboboxList>
									{(id: Id<'serviceProviders'>) => {
										const provider = (allProviders ?? []).find(
											(p) => p._id === id
										);
										return (
											<ComboboxItem key={id} value={id}>
												{provider?.company ?? id}
											</ComboboxItem>
										);
									}}
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
						disabled={selectedIds.length === 0 || isSubmitting}
						loading={isSubmitting}
						onClick={() => {
							handleSubmit().catch(() => {
								/* Error handled in handleSubmit */
							});
						}}
						type="button"
					>
						Add to project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
