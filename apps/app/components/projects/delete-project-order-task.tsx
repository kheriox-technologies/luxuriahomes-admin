'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteProjectOrderTask({
	open,
	onOpenChange,
	orderTask,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	orderTask: Doc<'projectOrderTasks'>;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const removeOrderTask = useMutation(api.projectOrderTasks.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeOrderTask({ orderTaskId: orderTask._id });
			toastManager.add({ title: 'Order task deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete order task. Please try again in a moment.'
				),
				title: 'Could not delete order task',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete order task?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${orderTask.name}". This action cannot be undone.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* Error handled in onDelete */
							});
						}}
						variant="destructive"
					>
						Delete order task
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
