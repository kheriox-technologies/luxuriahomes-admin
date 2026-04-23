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

export default function DeleteInclusionCategory({
	categoryId,
	categoryName,
	trigger,
}: {
	categoryId: Id<'inclusionCategories'>;
	categoryName: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeCategory = useMutation(api.inclusionCategories.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeCategory({ categoryId });
			toastManager.add({
				title: 'Category deleted',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			const message =
				error instanceof Error ? error.message : 'Could not delete category';
			toastManager.add({
				description: message,
				title: 'Could not delete category',
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
					<AlertDialogTitle>Delete category?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${categoryName}. This action cannot be undone.`}
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
						Delete category
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
