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
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { useMemo, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function AddToTaskDialog({
	order,
	open,
	onOpenChange,
}: {
	order: Doc<'projectOrders'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const orderTasks = useQuery(
		api.projectOrderTasks.listByProject.listByProject,
		{ projectId: order.projectId }
	);
	const tasks = useQuery(api.projectTasks.listByProject.listByProject, {
		projectId: order.projectId,
	});
	const linkOrderTask = useMutation(
		api.projectOrders.linkOrderTask.linkOrderTask
	);

	const [selectedOrderTaskId, setSelectedOrderTaskId] =
		useState<Id<'projectOrderTasks'> | null>(order.orderTaskId ?? null);

	const taskNameById = useMemo(() => {
		const m = new Map<Id<'projectTasks'>, string>();
		for (const t of tasks ?? []) {
			m.set(t._id, t.name);
		}
		return m;
	}, [tasks]);

	const orderTaskItems = useMemo(
		() => (orderTasks ?? []).map((ot) => ot._id),
		[orderTasks]
	);

	const orderTaskLabelById = useMemo(() => {
		const m = new Map<Id<'projectOrderTasks'>, string>();
		for (const ot of orderTasks ?? []) {
			const parentName = taskNameById.get(ot.parentTaskId) ?? '';
			m.set(ot._id, `${parentName} · ${ot.name}`);
		}
		return m;
	}, [orderTasks, taskNameById]);

	const handleOpenChange = (next: boolean) => {
		if (next) {
			setSelectedOrderTaskId(order.orderTaskId ?? null);
		}
		onOpenChange(next);
	};

	const handleSave = async () => {
		try {
			await linkOrderTask({
				orderId: order._id,
				orderTaskId: selectedOrderTaskId,
			});
			toastManager.add({ title: 'Order linked to task', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not link order to task. Please try again.'
				),
				title: 'Could not link order',
				type: 'error',
			});
		}
	};

	const isLoading = orderTasks === undefined || tasks === undefined;

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to Task</DialogTitle>
					<DialogDescription>
						Link order {order.orderId} to an order task. The order dates will be
						updated from the task timeline.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4 px-6 pb-2">
					<Field>
						<FieldLabel>Order Task</FieldLabel>
						<Combobox<Id<'projectOrderTasks'>>
							disabled={isLoading}
							items={orderTaskItems}
							itemToStringLabel={(id) =>
								id ? (orderTaskLabelById.get(id) ?? String(id)) : ''
							}
							onValueChange={(val) => {
								setSelectedOrderTaskId(
									(val as Id<'projectOrderTasks'> | null) ?? null
								);
							}}
							value={selectedOrderTaskId}
						>
							<ComboboxInput
								placeholder={isLoading ? 'Loading…' : 'Select an order task…'}
								showClear={selectedOrderTaskId !== null}
							/>
							<ComboboxPopup>
								<ComboboxEmpty>No order tasks found.</ComboboxEmpty>
								<ComboboxList>
									{(id: Id<'projectOrderTasks'>) => (
										<ComboboxItem key={id} value={id}>
											{orderTaskLabelById.get(id) ?? id}
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
					<Button onClick={handleSave} type="button">
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
