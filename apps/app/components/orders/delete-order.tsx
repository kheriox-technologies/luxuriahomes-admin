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
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteOrder({
	orderId,
	orderName,
	open,
	onOpenChange,
}: {
	orderId: Id<'projectOrders'>;
	orderName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const removeOrder = useMutation(api.projectOrders.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeOrder({ orderId });
			toastManager.add({ title: 'Order deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete order. Please try again in a moment.'
				),
				title: 'Could not delete order',
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
					<AlertDialogTitle>Delete order?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${orderName}" along with all its notes and status history. This action cannot be undone.`}
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
						Delete order
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
