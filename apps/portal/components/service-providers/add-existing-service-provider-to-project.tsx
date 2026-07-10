'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
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
import ServiceProviderSelect from './service-provider-select';

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

	const [selectedIds, setSelectedIds] = useState<Id<'serviceProviders'>[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const linked = useQuery(api.projectServiceProviders.listByProject.list, {
		projectId,
	});
	const addToProject = useMutation(api.projectServiceProviders.add.add);

	const linkedIds = linked?.map((p) => p._id) ?? [];

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
						serviceProviderId,
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
						<ServiceProviderSelect
							allowCreate
							excludeServiceProviderIds={linkedIds}
							multiple
							onValueChange={setSelectedIds}
							value={selectedIds}
						/>
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
						variant="outline"
					>
						<Plus aria-hidden /> Add to project
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
