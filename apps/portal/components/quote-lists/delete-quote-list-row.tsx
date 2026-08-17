'use client';

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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

/**
 * Confirmation for deleting one row of a flat quote list. The row itself owns
 * the open state (the delete button lives in the row), so this is always
 * controlled.
 */
export default function DeleteQuoteListRow({
	noun,
	text,
	onConfirm,
	open,
	onOpenChange,
}: {
	noun: string;
	text: string;
	onConfirm: () => Promise<unknown>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await onConfirm();
			toastManager.add({ title: `${noun} deleted`, type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					`Could not delete ${noun.toLowerCase()}. Please try again in a moment.`
				),
				title: `Could not delete ${noun.toLowerCase()}`,
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
					<AlertDialogTitle>{`Delete ${noun.toLowerCase()}?`}</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will delete "${text}". This cannot be undone.`}
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
						<Trash2 aria-hidden /> {`Delete ${noun.toLowerCase()}`}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
