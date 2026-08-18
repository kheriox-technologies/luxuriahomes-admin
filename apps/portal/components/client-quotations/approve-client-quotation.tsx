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
import { CircleCheck } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import type { QuotationSurface } from './quotation-surface';

export default function ApproveClientQuotation({
	onOpenChange,
	open,
	quotationId,
	reference,
	surface = 'admin',
}: {
	onOpenChange: (open: boolean) => void;
	open: boolean;
	quotationId: Id<'clientQuotations'>;
	reference: string;
	surface?: QuotationSurface;
}) {
	const [isApproving, setIsApproving] = useState(false);
	const adminApprove = useMutation(api.clientQuotations.approve.approve);
	const clientApprove = useMutation(
		api.clientPortal.quotations.approve.approve
	);
	const approveQuotation = surface === 'client' ? clientApprove : adminApprove;

	const onApprove = async () => {
		setIsApproving(true);
		try {
			await approveQuotation({ quotationId });
			toastManager.add({ title: 'Quotation approved', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not approve the quotation. Please try again in a moment.'
				),
				title: 'Could not approve quotation',
				type: 'error',
			});
		} finally {
			setIsApproving(false);
		}
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Approve {reference}?</AlertDialogTitle>
					<AlertDialogDescription>
						{surface === 'client'
							? 'This tells Luxuria Homes you are happy with the quotation as it stands. Nothing about what was quoted changes, and your approval is recorded against this version. If you would rather ask about something first, add a note instead.'
							: 'This marks the quotation as Approved. Nothing about what was quoted changes, so the version stays as it is — the approval is recorded in the version history against it.'}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={isApproving}
						onClick={() => {
							onApprove().catch(() => {
								/* handled in onApprove */
							});
						}}
						type="button"
						variant="outline"
					>
						<CircleCheck aria-hidden /> Approve
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
