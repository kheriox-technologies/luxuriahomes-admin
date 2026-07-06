'use client';

import { api } from '@workspace/backend/api';
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
import { useAction } from 'convex/react';
import { Trash2, X } from 'lucide-react';
import { type ReactElement, useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteUser({
	userId,
	userLabel,
	trigger,
	onDeleted,
}: {
	userId: string;
	userLabel: string;
	trigger: ReactElement;
	onDeleted: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const removeUser = useAction(api.users.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeUser({ userId });
			toastManager.add({ title: 'User deleted', type: 'success' });
			setOpen(false);
			onDeleted();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete user. Please try again in a moment.'
				),
				title: 'Could not delete user',
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
					<AlertDialogTitle>Delete user?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${userLabel} from Clerk. This action cannot be undone.`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose
						render={
							<Button type="button" variant="outline">
								<X aria-hidden />
								Cancel
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
						<Trash2 aria-hidden />
						Delete user
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
