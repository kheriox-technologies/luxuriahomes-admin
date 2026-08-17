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
import {
	type ControllableDialogProps,
	useDialogOpen,
} from '@/components/quote-items/use-dialog-open';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteQuoteTermSection({
	sectionId,
	sectionName,
	itemCount,
	trigger,
	...openProps
}: {
	sectionId: Id<'quoteTermSections'>;
	sectionName: string;
	itemCount: number;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeSection = useMutation(api.quoteTermSections.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeSection({ sectionId });
			toastManager.add({ title: 'Section deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete section. Please try again in a moment.'
				),
				title: 'Could not delete section',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	const childSummary =
		itemCount === 0
			? 'It has no clauses.'
			: `This also deletes its ${itemCount} clause${itemCount === 1 ? '' : 's'}.`;

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			{trigger ? <AlertDialogTrigger render={trigger} /> : null}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete section?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will delete "${sectionName}". ${childSummary} This cannot be undone.`}
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
						<Trash2 aria-hidden /> Delete section
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
