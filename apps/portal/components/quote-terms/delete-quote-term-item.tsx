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

export default function DeleteQuoteTermItem({
	itemId,
	itemText,
	trigger,
	...openProps
}: {
	itemId: Id<'quoteTermItems'>;
	itemText: string;
	trigger?: ReactElement;
} & ControllableDialogProps) {
	const { open, setOpen } = useDialogOpen(openProps);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeItem = useMutation(api.quoteTermItems.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeItem({ itemId });
			toastManager.add({ title: 'Clause deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete clause. Please try again in a moment.'
				),
				title: 'Could not delete clause',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			{trigger ? <AlertDialogTrigger render={trigger} /> : null}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete clause?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will delete "${itemText}" from the quote terms. This cannot be undone.`}
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
						<Trash2 aria-hidden /> Delete clause
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
