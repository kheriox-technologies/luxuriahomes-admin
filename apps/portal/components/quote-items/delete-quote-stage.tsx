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
import { type ControllableDialogProps, useDialogOpen } from './use-dialog-open';

function pluralize(count: number, noun: string): string {
	return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export default function DeleteQuoteStage({
	stageId,
	stageName,
	sectionCount,
	itemCount,
	trigger,
	...openProps
}: {
	stageId: Id<'quoteStages'>;
	stageName: string;
	sectionCount: number;
	itemCount: number;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeStage = useMutation(api.quoteStages.remove.remove);

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

	const childSummary =
		sectionCount === 0
			? 'It has no sections.'
			: `This also deletes its ${pluralize(sectionCount, 'section')} and ${pluralize(itemCount, 'item')}.`;

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			{trigger ? <AlertDialogTrigger render={trigger} /> : null}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete stage?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will delete "${stageName}". ${childSummary} This cannot be undone.`}
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
