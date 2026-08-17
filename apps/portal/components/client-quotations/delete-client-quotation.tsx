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
import { Checkbox } from '@workspace/ui/components/checkbox';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useMutation } from 'convex/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteClientQuotation({
	documentId,
	onOpenChange,
	open,
	quotationId,
	reference,
}: {
	documentId?: Id<'companyDocuments'>;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	quotationId: Id<'clientQuotations'>;
	reference: string;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDocument, setDeleteDocument] = useState(true);
	const removeQuotation = useMutation(api.clientQuotations.remove.remove);
	const removeDocument = useAction(api.companyDocuments.remove.remove);

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			// The PDF goes first: if it fails, the quotation row is still there to
			// retry from rather than leaving an orphaned file with no owner.
			if (documentId && deleteDocument) {
				await removeDocument({ documentId });
			}
			await removeQuotation({ quotationId });
			toastManager.add({ title: 'Quotation deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete the quotation. Please try again in a moment.'
				),
				title: 'Could not delete quotation',
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
					<AlertDialogTitle>Delete {reference}?</AlertDialogTitle>
					<AlertDialogDescription>
						This removes the quotation record. It cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{documentId ? (
					<label
						className="flex cursor-pointer items-center gap-2 px-6 text-sm"
						htmlFor="delete-quotation-document"
					>
						<Checkbox
							checked={deleteDocument}
							id="delete-quotation-document"
							onCheckedChange={(checked) => setDeleteDocument(checked === true)}
						/>
						Also delete the generated PDF from Documents
					</label>
				) : null}
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={isDeleting}
						onClick={() => {
							onDelete().catch(() => {
								/* handled in onDelete */
							});
						}}
						type="button"
						variant="destructive"
					>
						<Trash2 aria-hidden /> Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
