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

export default function DeleteProjectTask({
	open,
	onOpenChange,
	task,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task: Doc<'projectTasks'>;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const removeTask = useMutation(api.projectTasks.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeTask({ taskId: task._id });
			toastManager.add({ title: 'Task deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete task. Please try again in a moment.'
				),
				title: 'Could not delete task',
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
					<AlertDialogTitle>Delete task?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${task.name}". This action cannot be undone.`}
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
								/* handled above */
							});
						}}
						variant="destructive"
					>
						Delete task
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
