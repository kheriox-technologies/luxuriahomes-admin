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
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteMaterialItem({
	itemId,
	itemName,
	open: openProp,
	onOpenChange: onOpenChangeProp,
	trigger,
}: {
	itemId: Id<'materialItems'>;
	itemName: string;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	trigger?: ReactElement;
}) {
	const [openInternal, setOpenInternal] = useState(false);
	const isControlled = openProp !== undefined;
	const open = isControlled ? (openProp ?? false) : openInternal;
	const setOpen = (next: boolean) => {
		if (isControlled) {
			onOpenChangeProp?.(next);
		} else {
			setOpenInternal(next);
		}
	};
	const [isDeleting, setIsDeleting] = useState(false);
	const removeItem = useMutation(api.materialItems.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeItem({ itemId });
			toastManager.add({ title: 'Item deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete item. Please try again in a moment.'
				),
				title: 'Could not delete item',
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
					<AlertDialogTitle>Delete item?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${itemName}. This action cannot be undone.`}
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
						Delete item
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
