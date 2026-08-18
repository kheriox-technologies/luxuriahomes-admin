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
import { Send } from 'lucide-react';
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

export default function SendQuotationToClients({
	clients,
	isDraft,
	onOpenChange,
	open,
	quotationId,
	reference,
}: {
	clients: QuotationRecipient[];
	/** Only a draft changes status when sent; anything else is a re-send. */
	isDraft: boolean;
	onOpenChange: (open: boolean) => void;
	open: boolean;
	quotationId: Id<'clientQuotations'>;
	reference: string;
}) {
	const [isSending, setIsSending] = useState(false);
	const sendToClients = useAction(
		api.clientQuotations.sendToClients.sendToClients
	);

	const recipients = clients.filter((client) => client.email.trim() !== '');

	const onSend = async () => {
		setIsSending(true);
		try {
			const result = await sendToClients({ quotationId });
			const created = result.accountsCreated.length;
			toastManager.add({
				description:
					created > 0
						? `Portal logins were created for ${describeSent(created)} and the details included in their email.`
						: 'Everyone already had a portal login, so no new accounts were created.',
				title: `Quotation sent to ${describeSent(result.sent)}`,
				type: 'success',
			});
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not send the quotation. Please try again in a moment.'
				),
				title: 'Could not send quotation',
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
						{isDraft ? 'Send' : 'Resend'} {reference} to the clients?
					</AlertDialogTitle>
					<AlertDialogDescription>
						Each client below is emailed the latest quotation PDF and a link to
						the client portal. Anyone without a portal login gets one created,
						with the password included in their email.{' '}
						{isDraft
							? 'The quotation moves to Under Review.'
							: 'This is a fresh copy of the current version — the status and version stay as they are.'}
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
						<Send aria-hidden /> {isDraft ? 'Send' : 'Resend'}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
