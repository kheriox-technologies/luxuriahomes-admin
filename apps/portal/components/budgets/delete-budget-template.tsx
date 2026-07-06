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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteBudgetTemplate({
	budgetTemplateId,
	templateTitle,
	open,
	onOpenChange,
	onDeleted,
}: {
	budgetTemplateId: Id<'budgetTemplates'>;
	templateTitle: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDeleted?: () => void;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const removeTemplate = useMutation(api.budgetTemplates.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeTemplate({ budgetTemplateId });
			toastManager.add({
				title: 'Budget template deleted',
				type: 'success',
			});
			onOpenChange(false);
			onDeleted?.();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete budget template. Please try again in a moment.'
				),
				title: 'Could not delete budget template',
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
					<AlertDialogTitle>Delete budget template?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${templateTitle} and all of its trade prices. This action cannot be undone.`}
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
						Delete template
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
