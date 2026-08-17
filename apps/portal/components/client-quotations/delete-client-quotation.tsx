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
import { useAction, useMutation, useQuery } from 'convex/react';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function DeleteClientQuotation({
	onOpenChange,
	open,
	quotationId,
	reference,
}: {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	quotationId: Id<'clientQuotations'>;
	reference: string;
}) {
	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteDocuments, setDeleteDocuments] = useState(true);
	// Every version has its own PDF, so the files to clean up come from the
	// history rather than the quotation row. Only loaded while the dialog is open.
	const versions = useQuery(
		api.clientQuotations.listVersions.listVersions,
		open ? { quotationId } : 'skip'
	);
	const removeQuotation = useMutation(api.clientQuotations.remove.remove);
	const removeDocument = useAction(api.companyDocuments.remove.remove);

	const documentIds = [
		...new Set(
			(versions ?? [])
				.map((version) => version.documentId)
				.filter((documentId): documentId is Id<'companyDocuments'> =>
					Boolean(documentId)
				)
		),
	];
	const pdfCount = documentIds.length;

	const onDelete = async () => {
		setIsDeleting(true);
		try {
			// The PDFs go first: if one fails, the quotation row is still there to
			// retry from rather than leaving orphaned files with no owner.
			if (deleteDocuments) {
				for (const documentId of documentIds) {
					await removeDocument({ documentId });
				}
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
						This removes the quotation and its version history. It cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{pdfCount > 0 ? (
					<label
						className="flex cursor-pointer items-center gap-2 px-6 text-sm"
						htmlFor="delete-quotation-document"
					>
						<Checkbox
							checked={deleteDocuments}
							id="delete-quotation-document"
							onCheckedChange={(checked) =>
								setDeleteDocuments(checked === true)
							}
						/>
						{pdfCount === 1
							? 'Also delete the generated PDF from Documents'
							: `Also delete all ${pdfCount} version PDFs from Documents`}
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
