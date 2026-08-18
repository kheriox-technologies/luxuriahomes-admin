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
import { useAction } from 'convex/react';
import { Signature } from 'lucide-react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

interface QuotationRecipient {
	email: string;
	name: string;
}

/** "one client", "two clients", … reads better than a bare count in a toast. */
function describeSent(sent: number): string {
	return sent === 1 ? '1 client' : `${sent} clients`;
}

export default function RequestSignatures({
	clients,
	onOpenChange,
	open,
	quotationId,
	reference,
}: {
	clients: QuotationRecipient[];
	onOpenChange: (open: boolean) => void;
	open: boolean;
	quotationId: Id<'clientQuotations'>;
	reference: string;
}) {
	const [isSending, setIsSending] = useState(false);
	const requestSignatures = useAction(
		api.clientQuotations.requestSignatures.requestSignatures
	);

	const recipients = clients.filter((client) => client.email.trim() !== '');

	const onSend = async () => {
		setIsSending(true);
		try {
			const result = await requestSignatures({ quotationId });
			toastManager.add({
				description:
					'They can sign in and initial the quotation now. You will be emailed to countersign once they all have.',
				title: `Signature request sent to ${describeSent(result.sent)}`,
				type: 'success',
			});
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not request signatures. Please try again in a moment.'
				),
				title: 'Could not request signatures',
				type: 'error',
			});
		} finally {
			setIsSending(false);
		}
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						Request signatures for {reference}?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Each client below gets their own email with a link to sign. They
						initial every section and sign the last page; once they all have,
						Luxuria Homes is emailed to countersign. The quotation moves to
						Awaiting Signatures.
					</AlertDialogDescription>
				</AlertDialogHeader>
				{/* The header and footer own the dialog's horizontal padding, so a child
				    between them has to match it. */}
				<ul className="-mt-2 flex flex-col gap-1 px-6 pb-6 text-sm">
					{recipients.map((client) => (
						<li
							className="flex min-w-0 flex-wrap items-baseline gap-x-2"
							key={client.email}
						>
							<span className="truncate font-medium">{client.name}</span>
							<span className="truncate text-muted-foreground">
								{client.email}
							</span>
						</li>
					))}
				</ul>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						disabled={recipients.length === 0}
						loading={isSending}
						onClick={() => {
							onSend().catch(() => {
								/* handled in onSend */
							});
						}}
						type="button"
						variant="outline"
					>
						<Signature aria-hidden /> Request signatures
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
