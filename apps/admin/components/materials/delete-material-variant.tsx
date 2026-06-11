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
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteMaterialVariant({
	variantId,
	variantName,
	materialId,
	redirectAfterDelete,
	trigger,
}: {
	variantId: Id<'materialVariants'>;
	variantName: string;
	materialId?: Id<'materials'>;
	redirectAfterDelete?: boolean;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeVariant = useMutation(api.materialVariants.remove.remove);
	const router = useRouter();

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeVariant({ variantId });
			toastManager.add({ title: 'Variant deleted', type: 'success' });
			setOpen(false);
			if (redirectAfterDelete && materialId) {
				router.push(`/materials#${materialId}` as never);
			}
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete variant. Please try again in a moment.'
				),
				title: 'Could not delete variant',
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
					<AlertDialogTitle>Delete variant?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${variantName} and all of its items. This action cannot be undone.`}
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
						Delete variant
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
