'use client';

import type { ColumnDef } from '@tanstack/react-table';
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
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
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
import { LayoutTemplate, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import PageHeading from '@/components/page-heading';
import RichTextEditor from '@/components/rich-text-editor';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type EmailTemplate = Doc<'emailTemplates'>;

function TemplateDialog({
	template,
	trigger,
}: {
	template?: EmailTemplate;
	trigger: React.ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [name, setName] = useState(template?.name ?? '');
	const [subject, setSubject] = useState(template?.subject ?? '');
	const [body, setBody] = useState(template?.body ?? '');
	const [signatureId, setSignatureId] = useState<Id<'emailSignatures'> | null>(
		template?.signatureId ?? null
	);
	const [isActive, setIsActive] = useState(template?.isActive ?? true);
	const [submitting, setSubmitting] = useState(false);

	const signatures = useQuery(
		api.emailSignatures.list.list,
		open ? {} : 'skip'
	);
	const signatureIds = (signatures ?? []).map((signature) => signature._id);

	const addTemplate = useMutation(api.emailTemplates.add.add);
	const updateTemplate = useMutation(api.emailTemplates.update.update);

	const reset = () => {
		setName(template?.name ?? '');
		setSubject(template?.subject ?? '');
		setBody(template?.body ?? '');
		setSignatureId(template?.signatureId ?? null);
		setIsActive(template?.isActive ?? true);
	};

	const onSubmit = async () => {
		if (name.trim() === '') {
			toastManager.add({ title: 'Template name is required', type: 'error' });
			return;
		}
		setSubmitting(true);
		try {
			if (template) {
				await updateTemplate({
					templateId: template._id,
					name: name.trim(),
					subject: subject.trim(),
					body,
					signatureId: signatureId ?? undefined,
					isActive,
				});
				toastManager.add({ title: 'Template updated', type: 'success' });
			} else {
				await addTemplate({
					name: name.trim(),
					subject: subject.trim(),
					body,
					signatureId: signatureId ?? undefined,
					isActive,
				});
				toastManager.add({ title: 'Template added', type: 'success' });
			}
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save the template. Please try again.'
				),
				title: 'Could not save template',
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
			<DialogContent className="flex h-[min(90vh,48rem)] w-[min(92vw,42rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
				<DialogHeader className="shrink-0 border-b px-6 py-4">
					<DialogTitle>
						{template ? 'Edit Template' : 'Add Template'}
					</DialogTitle>
				</DialogHeader>
				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
					<Field>
						<FieldLabel htmlFor="template-name">Name</FieldLabel>
						<Input
							autoFocus
							id="template-name"
							onChange={(event) => setName(event.target.value)}
							placeholder="e.g. Order to Vendor"
							value={name}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="template-subject">Subject</FieldLabel>
						<Input
							id="template-subject"
							onChange={(event) => setSubject(event.target.value)}
							placeholder="Subject line"
							value={subject}
						/>
					</Field>
					<Field>
						<FieldLabel htmlFor="template-body">Body</FieldLabel>
						<RichTextEditor
							id="template-body"
							onChange={setBody}
							placeholder="Write the default message…"
							value={body}
						/>
					</Field>
					{signatureIds.length > 0 ? (
						<Field>
							<FieldLabel htmlFor="template-signature">
								Default signature
							</FieldLabel>
							<Combobox<Id<'emailSignatures'>>
								items={signatureIds}
								itemToStringLabel={(item) =>
									signatures?.find((s) => s._id === item)?.name ?? item
								}
								onValueChange={(next) => setSignatureId(next)}
								value={signatureId}
							>
								<ComboboxInput
									id="template-signature"
									placeholder="No signature"
									showClear
									showTrigger={false}
								/>
								<ComboboxPopup>
									<ComboboxEmpty>No signatures found.</ComboboxEmpty>
									<ComboboxList>
										{(item: Id<'emailSignatures'>) => (
											<ComboboxItem key={item} value={item}>
												{signatures?.find((s) => s._id === item)?.name ?? item}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxPopup>
							</Combobox>
						</Field>
					) : null}
					<div className="flex items-center gap-2">
						<Checkbox
							checked={isActive}
							id="template-active"
							onCheckedChange={(checked) => setIsActive(checked === true)}
						/>
						<label className="text-sm" htmlFor="template-active">
							Active (available when composing emails)
						</label>
					</div>
				</div>
				<DialogFooter className="shrink-0 border-t px-6 py-4">
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						loading={submitting}
						onClick={() => {
							onSubmit().catch(() => {
								/* Error handled in onSubmit */
							});
						}}
						type="button"
					>
						{template ? 'Save changes' : 'Add template'}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

function DeleteTemplate({ template }: { template: EmailTemplate }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const removeTemplate = useMutation(api.emailTemplates.remove.remove);

	const onDelete = async () => {
		setLoading(true);
		try {
			await removeTemplate({ templateId: template._id });
			toastManager.add({ title: 'Template deleted', type: 'success' });
			setOpen(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(error, 'Please try again.'),
				title: 'Could not delete template',
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
						aria-label="Delete template"
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
					<AlertDialogTitle>Delete template?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${template.name}".`}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<Button
						loading={loading}
						onClick={() => onDelete().catch(() => undefined)}
						type="button"
						variant="destructive"
					>
						Delete
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

const columns: ColumnDef<EmailTemplate>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<div className="flex items-center gap-2">
				<span className="font-medium">{row.original.name}</span>
				{row.original.isActive ? null : (
					<Badge size="lg" variant="secondary">
						Inactive
					</Badge>
				)}
			</div>
		),
	},
	{
		accessorKey: 'subject',
		header: 'Subject',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.subject}
			</span>
		),
	},
	{
		id: 'actions',
		header: '',
		size: 100,
		cell: ({ row }) => (
			<div className="flex justify-end">
				<Group>
					<TemplateDialog
						template={row.original}
						trigger={
							<Button
								aria-label="Edit template"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<GroupSeparator />
					<DeleteTemplate template={row.original} />
				</Group>
			</div>
		),
	},
];

export default function EmailTemplatesContent() {
	const templates = useQuery(api.emailTemplates.list.list, {});

	let content: React.ReactNode;
	if (templates === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">Loading templates…</div>
		);
	} else if (templates.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<LayoutTemplate aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No templates yet</EmptyTitle>
					<EmptyDescription>
						Create your first template using the Add Template button.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<DataTable
				columns={columns}
				data={templates}
				emptyMessage="No templates found."
			/>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Email Templates"
				icon={LayoutTemplate}
				rightSlot={<TemplateDialog trigger={<Button>Add Template</Button>} />}
			/>
			{content}
		</div>
	);
}
