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

export default function DeleteMaterialColor({
	materialColorId,
	materialColorName,
	trigger,
}: {
	materialColorId: Id<'materialColors'>;
	materialColorName: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeMaterialColor = useMutation(api.materialColors.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeMaterialColor({ materialColorId });
			toastManager.add({
				title: 'Material color deleted',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete material color. Please try again in a moment.'
				),
				title: 'Could not delete material color',
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
					<AlertDialogTitle>Delete material color?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${materialColorName}. This action cannot be undone.`}
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
						<Trash2 aria-hidden />
						Delete material color
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
