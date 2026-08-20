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

export default function DeleteQuotationTemplate({
	onDeleted,
	onOpenChange,
	open,
	templateId,
	templateName,
}: {
	onDeleted?: () => void;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	templateId: Id<'quoteTemplates'>;
	templateName: string;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const removeTemplate = useMutation(api.quoteTemplates.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			await removeTemplate({ templateId });
			toastManager.add({
				title: 'Quotation template deleted',
				type: 'success',
			});
			onOpenChange(false);
			onDeleted?.();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete quotation template. Please try again in a moment.'
				),
				title: 'Could not delete quotation template',
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
					<AlertDialogTitle>Delete quotation template?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete ${templateName} along with its items, terms, exclusions, notes, disclaimer and acknowledgement. Quotations already issued from it are unaffected. This action cannot be undone.`}
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
						type="button"
						variant="destructive"
					>
						<Trash2 aria-hidden />
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
