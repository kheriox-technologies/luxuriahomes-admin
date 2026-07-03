'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
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
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { EllipsisVertical, ShieldMinus, ShieldPlus } from 'lucide-react';
import { useState } from 'react';
import { useClientPortalPending } from '@/components/projects/client-portal-pending-context';
import { projectClientDisplayName } from '@/components/projects/project-form-shared';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type ProjectClient = Doc<'projects'>['clients'][number];

export default function ClientPortalActionsCell({
	projectId,
	client,
}: {
	projectId: Id<'projects'>;
	client: ProjectClient;
}) {
	const grantAccess = useAction(api.clientPortal.grantAccess.grantAccess);
	const revokeAccess = useAction(api.clientPortal.revokeAccess.revokeAccess);
	const { isPending: isClientPending, setPending } = useClientPortalPending();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const hasAccess = Boolean(client.portalUserId);
	const displayName = projectClientDisplayName(client);
	const isPending = isClientPending(client.email);

	const onGrant = async () => {
		setPending(client.email, true);
		try {
			const result = await grantAccess({ projectId, email: client.email });
			toastManager.add({
				description: result.emailSent
					? `A portal password was emailed to ${client.email}.`
					: `${displayName} was linked to their existing portal account.`,
				title: 'Added to client portal',
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add this client to the portal. Please try again in a moment.'
				),
				title: 'Could not add to client portal',
				type: 'error',
			});
		} finally {
			setPending(client.email, false);
		}
	};

	const onRevoke = async () => {
		setPending(client.email, true);
		try {
			await revokeAccess({ projectId, email: client.email });
			toastManager.add({
				title: 'Removed from client portal',
				type: 'success',
			});
			setConfirmOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not remove this client from the portal. Please try again in a moment.'
				),
				title: 'Could not remove from client portal',
				type: 'error',
			});
		} finally {
			setPending(client.email, false);
		}
	};

	return (
		<div className="flex justify-end">
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Portal actions for ${displayName}`}
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					{hasAccess ? (
						<MenuItem
							disabled={isPending}
							onClick={() => setConfirmOpen(true)}
							variant="destructive"
						>
							<ShieldMinus />
							Delete from client portal
						</MenuItem>
					) : (
						<MenuItem
							disabled={isPending}
							onClick={() => {
								onGrant().catch(() => {
									/* handled above */
								});
							}}
						>
							<ShieldPlus />
							Add to client portal
						</MenuItem>
					)}
				</MenuPopup>
			</Menu>
			<AlertDialog onOpenChange={setConfirmOpen} open={confirmOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Remove portal access?</AlertDialogTitle>
						<AlertDialogDescription>
							{`This removes ${displayName}'s access to the client portal. Their login will be deleted unless they are linked to another project.`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<Button
							loading={isPending}
							onClick={() => {
								onRevoke().catch(() => {
									/* handled above */
								});
							}}
							variant="destructive"
						>
							Remove access
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
