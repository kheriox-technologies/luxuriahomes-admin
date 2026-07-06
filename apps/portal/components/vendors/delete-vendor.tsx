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
import { Trash2, X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteVendor({
	vendorId,
	vendorName,
	trigger,
}: {
	vendorId: Id<'vendors'>;
	vendorName: string;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeVendor = useMutation(api.vendors.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeVendor({ vendorId });
			toastManager.add({
				title: 'Vendor deleted',
				type: 'success',
			});
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete vendor. Please try again in a moment.'
				),
				title: 'Could not delete vendor',
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
					<AlertDialogTitle>Delete vendor?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${vendorName}. This action cannot be undone.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose
						render={
							<Button type="button" variant="outline">
								<X aria-hidden /> Cancel
							</Button>
						}
					/>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* Error handled in onDelete */
							});
						}}
						variant="destructive-outline"
					>
						<Trash2 aria-hidden /> Delete vendor
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
