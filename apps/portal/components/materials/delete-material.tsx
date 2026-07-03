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

export default function DeleteMaterial({
	materialId,
	materialName,
	redirectAfterDelete,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: {
	materialId: Id<'materials'>;
	materialName: string;
	redirectAfterDelete?: boolean;
	trigger?: ReactElement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isControlled = controlledOpen !== undefined;
	const open = isControlled ? controlledOpen : internalOpen;
	const setOpen = (next: boolean) => {
		if (!isControlled) {
			setInternalOpen(next);
		}
		onOpenChange?.(next);
	};
	const [isDeleting, setIsDeleting] = useState(false);
	const removeMaterial = useMutation(api.materials.remove.remove);
	const router = useRouter();

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeMaterial({ materialId });
			toastManager.add({ title: 'Material deleted', type: 'success' });
			setOpen(false);
			if (redirectAfterDelete) {
				router.push('/materials' as never);
			}
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete material. Please try again in a moment.'
				),
				title: 'Could not delete material',
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
					<AlertDialogTitle>Delete material?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${materialName} and all of its items. This action cannot be undone.`}
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
						Delete material
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
