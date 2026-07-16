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
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteProjectBudget({
	projectBudgetId,
	tradeName,
	open: controlledOpen,
	onOpenChange,
}: {
	projectBudgetId: Id<'projectBudgets'>;
	tradeName: string;
	// Omit these to render the built-in trash trigger; provide them to drive the
	// dialog from a menu (no visible trigger button).
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
	const removeBudget = useMutation(api.projectBudgets.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeBudget({ projectBudgetId });
			toastManager.add({ title: 'Budget removed', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not remove budget. Please try again in a moment.'
				),
				title: 'Could not remove budget',
				type: 'error',
			});
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			{isControlled ? null : (
				<AlertDialogTrigger
					render={
						<Button
							aria-label={`Remove ${tradeName} budget`}
							size="icon"
							type="button"
							variant="destructive-outline"
						>
							<Trash2 />
						</Button>
					}
				/>
			)}
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove budget?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This removes the budget for ${tradeName} from this project. The trade itself is not deleted.`}
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
						<Trash2 aria-hidden /> Remove budget
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
