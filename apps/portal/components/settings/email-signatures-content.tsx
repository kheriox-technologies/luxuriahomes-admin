'use client';

import type { ColumnDef } from '@tanstack/react-table';
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
import { Checkbox } from '@workspace/ui/components/checkbox';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check, Pencil, PenLine, Plus, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import PageHeading from '@/components/page-heading';
import RichTextEditor from '@/components/rich-text-editor';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type EmailSignature = Doc<'emailSignatures'>;

function SignatureDialog({
	signature,
	trigger,
}: {
	signature?: EmailSignature;
	trigger: React.ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(signature?.name ?? '');
	const [content, setContent] = useState(signature?.content ?? '');
	const [isDefault, setIsDefault] = useState(signature?.isDefault ?? false);
	const [submitting, setSubmitting] = useState(false);

	const addSignature = useMutation(api.emailSignatures.add.add);
	const updateSignature = useMutation(api.emailSignatures.update.update);

	const reset = () => {
		setName(signature?.name ?? '');
		setContent(signature?.content ?? '');
		setIsDefault(signature?.isDefault ?? false);
	};

	const onSubmit = async () => {
		if (name.trim() === '') {
			toastManager.add({ title: 'Signature name is required', type: 'error' });
			return;
		}
		setSubmitting(true);
		try {
			if (signature) {
				await updateSignature({
					signatureId: signature._id,
					name: name.trim(),
					content,
					isDefault,
				});
				toastManager.add({ title: 'Signature updated', type: 'success' });
			} else {
				await addSignature({ name: name.trim(), content, isDefault });
				toastManager.add({ title: 'Signature added', type: 'success' });
			}
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save the signature. Please try again.'
				),
				title: 'Could not save signature',
				type: 'error',
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				setOpen(next);
				if (next) {
					reset();
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger} />
			<DialogContent className="w-[min(92vw,40rem)] max-w-none sm:max-w-none">
				<DialogHeader>
					<DialogTitle>
						{signature ? 'Edit Signature' : 'Add Signature'}
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-4 px-6 pb-2">
					<Field>
						<FieldLabel htmlFor="signature-name">Name</FieldLabel>
						<Input
							autoFocus
							id="signature-name"
							onChange={(event) => setName(event.target.value)}
							placeholder="e.g. Default Signature"
							value={name}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="signature-content">Content</FieldLabel>
						<RichTextEditor
							id="signature-content"
							onChange={setContent}
							placeholder="Kind regards, Luxuria Homes"
							value={content}
						/>
					</Field>
					<div className="flex items-center gap-2">
						<Checkbox
							checked={isDefault}
							id="signature-default"
							onCheckedChange={(checked) => setIsDefault(checked === true)}
						/>
						<label className="text-sm" htmlFor="signature-default">
							Set as default signature
						</label>
					</div>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						<X aria-hidden /> Cancel
					</DialogClose>
					<Button
						loading={submitting}
						onClick={() => {
							onSubmit().catch(() => {
								/* Error handled in onSubmit */
							});
						}}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> {signature ? 'Save changes' : 'Add signature'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

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

const columns: ColumnDef<EmailSignature>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<span className="font-medium">{row.original.name}</span>
				{row.original.isDefault ? (
					<Badge size="lg" variant="success">
						Default
					</Badge>
				) : null}
			</div>
		),
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<Group>
					<SignatureDialog
						signature={row.original}
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
					<DeleteSignature signature={row.original} />
				</Group>
			</div>
		),
	},
];

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
			<DataTable
				columns={columns}
				data={signatures}
				emptyMessage="No signatures found."
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Email Signatures"
				icon={PenLine}
				rightSlot={
					<SignatureDialog
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
