'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
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
import { getConvexErrorCode, getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteStage({
	stageId,
	stageName,
	open,
	onOpenChange,
}: {
	stageId: Id<'stages'>;
	stageName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const removeStage = useMutation(api.stages.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeStage({ stageId });
			toastManager.add({
				title: 'Stage deleted',
				type: 'success',
			});
			onOpenChange(false);
		} catch (error) {
			const code = getConvexErrorCode(error);
			toastManager.add({
				description:
					code === 'STAGE_HAS_TASKS'
						? 'Remove all tasks from this stage before deleting it.'
						: getConvexErrorMessage(
								error,
								'Could not delete stage. Please try again in a moment.'
							),
				title: 'Could not delete stage',
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
					<AlertDialogTitle>Delete stage?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${stageName}". This action cannot be undone.`}
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
						Delete stage
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
