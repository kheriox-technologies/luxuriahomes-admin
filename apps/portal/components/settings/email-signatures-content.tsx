'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
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
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Pencil, PenLine, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import PageHeading from '@/components/page-heading';
import CopySignatureButton from '@/components/settings/copy-signature-button';
import SignaturePreview from '@/components/settings/signature-preview';
import SignatureSheet from '@/components/settings/signature-sheet';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type EmailSignature = Doc<'emailSignatures'>;

function DeleteSignature({ signature }: { signature: EmailSignature }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const removeSignature = useMutation(api.emailSignatures.remove.remove);

	const onDelete = async () => {
		setLoading(true);
		try {
			await removeSignature({ signatureId: signature._id });
			toastManager.add({ title: 'Signature deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(error, 'Please try again.'),
				title: 'Could not delete signature',
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog onOpenChange={setOpen} open={open}>
			<AlertDialogTrigger
				render={
					<Button
						aria-label="Delete signature"
						size="icon"
						type="button"
						variant="destructive-outline"
					/>
				}
			>
				<Trash2 />
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete signature?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${signature.name}".`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						<X aria-hidden /> Cancel
					</AlertDialogClose>
					<Button
						loading={loading}
						onClick={() => onDelete().catch(() => undefined)}
						type="button"
						variant="destructive-outline"
					>
						<Trash2 aria-hidden /> Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function SignatureCard({ signature }: { signature: EmailSignature }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between gap-3">
				<div className="flex min-w-0 flex-1 items-center gap-2">
					<CardTitle className="truncate leading-tight">
						{signature.name}
					</CardTitle>
					{signature.isDefault ? (
						<Badge size="lg" variant="success">
							Default
						</Badge>
					) : null}
				</div>
				<CardAction>
					<Group>
						<CopySignatureButton
							aria-label="Copy signature"
							html={signature.content}
							iconOnly
						/>
						<GroupSeparator />
						<SignatureSheet
							signature={signature}
							trigger={
								<Button
									aria-label="Edit signature"
									size="icon"
									type="button"
									variant="outline"
								>
									<Pencil />
								</Button>
							}
						/>
						<GroupSeparator />
						<DeleteSignature signature={signature} />
					</Group>
				</CardAction>
			</CardHeader>
			<CardContent>
				<SignaturePreview html={signature.content} />
			</CardContent>
		</Card>
	);
}

export default function EmailSignaturesContent() {
	const signatures = useQuery(api.emailSignatures.list.list, {});

	let content: React.ReactNode;
	if (signatures === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading signatures…</div>
		);
	} else if (signatures.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<PenLine aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No signatures yet</EmptyTitle>
					<EmptyDescription>
						Create your first signature using the Add Signature button.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
				{signatures.map((signature) => (
					<SignatureCard key={signature._id} signature={signature} />
				))}
			</div>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Email Signatures"
				icon={PenLine}
				rightSlot={
					<SignatureSheet
						trigger={
							<Button variant="outline">
								<Plus aria-hidden /> Add Signature
							</Button>
						}
					/>
				}
			/>
			{content}
		</div>
	);
}
