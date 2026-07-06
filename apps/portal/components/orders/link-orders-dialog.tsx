'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function LinkOrdersDialog({
	orderTask,
	open,
	onOpenChange,
}: {
	orderTask: Doc<'projectOrderTasks'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const orders = useQuery(api.projectOrders.list.list, {
		projectId: orderTask.projectId,
	});
	const linkOrderTask = useMutation(
		api.projectOrders.linkOrderTask.linkOrderTask
	);

	const currentlyLinkedIds = useMemo(
		() =>
			(orders ?? [])
				.filter((o) => o.orderTaskId === orderTask._id)
				.map((o) => o._id),
		[orders, orderTask._id]
	);

	const [selectedIds, setSelectedIds] = useState<Id<'projectOrders'>[]>([]);

	const orderItems = useMemo(() => (orders ?? []).map((o) => o._id), [orders]);
	const orderLabelById = useMemo(() => {
		const m = new Map<Id<'projectOrders'>, string>();
		for (const o of orders ?? []) {
			m.set(o._id, `${o.orderId} - ${o.vendor}`);
		}
		return m;
	}, [orders]);

	const handleOpenChange = (next: boolean) => {
		if (next) {
			setSelectedIds(currentlyLinkedIds);
		}
		onOpenChange(next);
	};

	const handleSave = async () => {
		try {
			const toLink = selectedIds.filter(
				(id) => !currentlyLinkedIds.includes(id)
			);
			const toUnlink = currentlyLinkedIds.filter(
				(id) => !selectedIds.includes(id)
			);
			await Promise.all([
				...toLink.map((id) =>
					linkOrderTask({ orderId: id, orderTaskId: orderTask._id })
				),
				...toUnlink.map((id) =>
					linkOrderTask({ orderId: id, orderTaskId: null })
				),
			]);
			toastManager.add({ title: 'Orders linked', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not link orders. Please try again.'
				),
				title: 'Could not link orders',
				type: 'error',
			});
		}
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Link Orders</DialogTitle>
					<DialogDescription>
						Select orders to link to &ldquo;{orderTask.name}&rdquo;. Linked
						orders will have their dates set from the task timeline.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 px-6 pb-2">
					<Field>
						<FieldLabel>Orders</FieldLabel>
						<Combobox<Id<'projectOrders'>, true>
							disabled={orders === undefined}
							items={orderItems}
							itemToStringLabel={(id) =>
								id ? (orderLabelById.get(id) ?? String(id)) : ''
							}
							multiple
							onValueChange={(val) => {
								setSelectedIds((val as Id<'projectOrders'>[] | null) ?? []);
							}}
							value={selectedIds}
						>
							<ComboboxChips>
								{selectedIds.map((id) => (
									<ComboboxChip key={id}>
										{orderLabelById.get(id) ?? id}
									</ComboboxChip>
								))}
								<ComboboxChipsInput placeholder="Search orders…" />
							</ComboboxChips>
							<ComboboxPopup>
								<ComboboxEmpty>No orders found.</ComboboxEmpty>
								<ComboboxList>
									{(id: Id<'projectOrders'>) => (
										<ComboboxItem key={id} value={id}>
											{orderLabelById.get(id) ?? id}
										</ComboboxItem>
									)}
								</ComboboxList>
							</ComboboxPopup>
						</Combobox>
					</Field>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button onClick={handleSave} type="button" variant="outline">
						<Check aria-hidden /> Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
