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
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Button } from '@workspace/ui/components/button';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation } from 'convex/react';
import { Trash2 } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteTradeStage({
	stageId,
	stageName,
	trigger,
}: {
	stageId: Id<'tradeStages'>;
	stageName: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeStage = useMutation(api.tradeStages.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeStage({ stageId });
			toastManager.add({ title: 'Stage deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
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
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger render={trigger} />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete stage?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will delete "${stageName}". Its trades are kept and moved to Ungrouped.`}
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
						variant="destructive-outline"
					>
						<Trash2 aria-hidden /> Delete stage
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
