'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Combobox,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
	ComboboxPopup,
} from '@workspace/ui/components/combobox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Field, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useQuery } from 'convex/react';
import { Paperclip, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import RecipientsField from '@/components/email/recipients-field';
import RichTextEditor from '@/components/rich-text-editor';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import {
	buildEmailHtml,
	buildEmailText,
	buildRecipientSuggestions,
	type ComposeAttachment,
	fileToBase64,
} from '@/lib/email';

export interface ComposeEmailDialogProps {
	defaultAttachments?: ComposeAttachment[];
	defaultSubject?: string;
	onOpenChange: (open: boolean) => void;
	onSent?: () => void;
	open: boolean;
	projectId?: Id<'projects'>;
	relatedId?: string;
	relatedTable?: string;
}

const DEFAULT_CONTENT_TYPE = 'application/octet-stream';

export default function ComposeEmailDialog({
	open,
	onOpenChange,
	projectId,
	defaultAttachments,
	defaultSubject,
	relatedTable,
	relatedId,
	onSent,
}: ComposeEmailDialogProps) {
	const [to, setTo] = useState<string[]>([]);
	const [cc, setCc] = useState<string[]>([]);
	const [bcc, setBcc] = useState<string[]>([]);
	const [showCc, setShowCc] = useState(false);
	const [showBcc, setShowBcc] = useState(false);
	const [subject, setSubject] = useState('');
	const [body, setBody] = useState('');
	const [templateId, setTemplateId] = useState<Id<'emailTemplates'> | null>(
		null
	);
	const [signatureId, setSignatureId] = useState<Id<'emailSignatures'> | null>(
		null
	);
	const [attachments, setAttachments] = useState<ComposeAttachment[]>([]);
	const [submitting, setSubmitting] = useState(false);

	const wasOpen = useRef(false);
	const signatureApplied = useRef(false);
	const prefixApplied = useRef(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const sendEmail = useAction(api.email.send.send);

	const project = useQuery(
		api.projects.get.get,
		open && projectId ? { projectId } : 'skip'
	);
	const serviceProviders = useQuery(
		api.projectServiceProviders.listByProject.list,
		open && projectId ? { projectId } : 'skip'
	);
	const templates = useQuery(api.emailTemplates.list.list, open ? {} : 'skip');
	const signatures = useQuery(
		api.emailSignatures.list.list,
		open ? {} : 'skip'
	);

	const suggestions = useMemo(
		() => buildRecipientSuggestions(project, serviceProviders),
		[project, serviceProviders]
	);

	// Project-specific emails (those given a `projectId`) prefix the subject with
	// the project name, e.g. "123 Smith St — Order ORD-101". Company-wide emails
	// have no `projectId`, so no project is fetched and the subject is left as-is.
	const applyProjectPrefix = (subjectText: string) => {
		const projectName = project?.name?.trim();
		if (!projectName) {
			return subjectText;
		}
		return subjectText.trim() === ''
			? projectName
			: `${projectName} — ${subjectText}`;
	};

	const activeTemplates = useMemo(
		() => (templates ?? []).filter((template) => template.isActive),
		[templates]
	);
	const templateIds = useMemo(
		() => activeTemplates.map((template) => template._id),
		[activeTemplates]
	);
	const signatureIds = useMemo(
		() => (signatures ?? []).map((signature) => signature._id),
		[signatures]
	);

	useEffect(() => {
		if (open && !wasOpen.current) {
			setTo([]);
			setCc([]);
			setBcc([]);
			setShowCc(false);
			setShowBcc(false);
			setSubject(defaultSubject ?? '');
			setBody('');
			setTemplateId(null);
			setSignatureId(null);
			setSubmitting(false);
			signatureApplied.current = false;
			prefixApplied.current = false;
			setAttachments(
				(defaultAttachments ?? []).map((attachment) => ({
					...attachment,
					removable: true,
				}))
			);
		}
		wasOpen.current = open;
	}, [open, defaultAttachments, defaultSubject]);

	useEffect(() => {
		if (
			open &&
			!signatureApplied.current &&
			signatures &&
			templateId === null
		) {
			const defaultSignature = signatures.find(
				(signature) => signature.isDefault
			);
			if (defaultSignature) {
				setSignatureId(defaultSignature._id);
			}
			signatureApplied.current = true;
		}
	}, [open, signatures, templateId]);

	// Prepend the project name to the subject once the project query resolves.
	// Runs once per open (guarded by `prefixApplied`) and tolerates the project
	// loading either before or after the dialog is opened.
	const projectName = project?.name?.trim();
	useEffect(() => {
		if (open && !prefixApplied.current && projectId && projectName) {
			setSubject((prev) =>
				prev.trim() === '' ? projectName : `${projectName} — ${prev}`
			);
			prefixApplied.current = true;
		}
	}, [open, projectId, projectName]);

	const applyTemplate = (nextTemplateId: Id<'emailTemplates'> | null) => {
		setTemplateId(nextTemplateId);
		signatureApplied.current = true;
		const template = activeTemplates.find((t) => t._id === nextTemplateId);
		if (template) {
			setSubject(applyProjectPrefix(template.subject));
			setBody(template.body);
			setSignatureId(template.signatureId ?? null);
		}
	};

	const addFiles = async (fileList: FileList) => {
		const next: ComposeAttachment[] = [];
		for (const file of Array.from(fileList)) {
			const base64 = await fileToBase64(file);
			next.push({
				id: crypto.randomUUID(),
				filename: file.name,
				contentType: file.type || DEFAULT_CONTENT_TYPE,
				contentBase64: base64,
				removable: true,
			});
		}
		setAttachments((prev) => [...prev, ...next]);
	};

	const removeAttachment = (id: string) => {
		setAttachments((prev) => prev.filter((attachment) => attachment.id !== id));
	};

	const onSubmit = async () => {
		if (to.length === 0) {
			toastManager.add({ title: 'Add at least one recipient', type: 'error' });
			return;
		}
		if (subject.trim() === '') {
			toastManager.add({ title: 'Add a subject', type: 'error' });
			return;
		}
		const signatureHtml = signatures?.find(
			(signature) => signature._id === signatureId
		)?.content;
		setSubmitting(true);
		try {
			await sendEmail({
				to,
				cc: showCc && cc.length > 0 ? cc : undefined,
				bcc: showBcc && bcc.length > 0 ? bcc : undefined,
				subject: subject.trim(),
				html: buildEmailHtml(body, signatureHtml),
				text: buildEmailText(body, signatureHtml),
				attachments:
					attachments.length > 0
						? attachments.map((attachment) => ({
								filename: attachment.filename,
								contentType: attachment.contentType,
								s3Key: attachment.s3Key,
								storageId: attachment.storageId,
								contentBase64: attachment.contentBase64,
							}))
						: undefined,
				projectId,
				relatedTable,
				relatedId,
			});
			toastManager.add({ title: 'Email sent', type: 'success' });
			onSent?.();
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not send the email. Please try again in a moment.'
				),
				title: 'Could not send email',
				type: 'error',
			});
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="flex h-[min(90vh,52rem)] w-[min(94vw,44rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
				<DialogHeader className="shrink-0 space-y-1.5 border-b px-6 py-4">
					<DialogTitle>Compose Email</DialogTitle>
					<DialogDescription>
						Sent from your Google Workspace account. A copy is kept in its Sent
						folder.
					</DialogDescription>
				</DialogHeader>

				<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-4">
					{templateIds.length > 0 ? (
						<Field>
							<FieldLabel htmlFor="compose-template">Template</FieldLabel>
							<Combobox<Id<'emailTemplates'>>
								items={templateIds}
								itemToStringLabel={(item) =>
									activeTemplates.find((t) => t._id === item)?.name ?? item
								}
								onValueChange={(next) => applyTemplate(next)}
								value={templateId}
							>
								<ComboboxInput
									id="compose-template"
									placeholder="Start from a template (optional)"
									showClear
									showTrigger={false}
								/>
								<ComboboxPopup>
									<ComboboxEmpty>No templates found.</ComboboxEmpty>
									<ComboboxList>
										{(item: Id<'emailTemplates'>) => (
											<ComboboxItem key={item} value={item}>
												{activeTemplates.find((t) => t._id === item)?.name ??
													item}
											</ComboboxItem>
										)}
									</ComboboxList>
								</ComboboxPopup>
							</Combobox>
						</Field>
					) : null}

					<RecipientsField
						id="compose-to"
						label="To"
						onChange={setTo}
						suggestions={suggestions}
						values={to}
					/>

					<div className="flex gap-2">
						{showCc ? null : (
							<Button
								onClick={() => setShowCc(true)}
								size="sm"
								type="button"
								variant="outline"
							>
								Add Cc
							</Button>
						)}
						{showBcc ? null : (
							<Button
								onClick={() => setShowBcc(true)}
								size="sm"
								type="button"
								variant="outline"
							>
								Add Bcc
							</Button>
						)}
					</div>

					{showCc ? (
						<RecipientsField
							id="compose-cc"
							label="Cc"
							onChange={setCc}
							suggestions={suggestions}
							values={cc}
						/>
					) : null}
					{showBcc ? (
						<RecipientsField
							id="compose-bcc"
							label="Bcc"
							onChange={setBcc}
							suggestions={suggestions}
							values={bcc}
						/>
					) : null}

					<Field>
						<FieldLabel htmlFor="compose-subject">Subject</FieldLabel>
						<Input
							id="compose-subject"
							onChange={(event) => setSubject(event.target.value)}
							placeholder="Subject"
							value={subject}
						/>
					</Field>

					<Field>
						<FieldLabel htmlFor="compose-body">Message</FieldLabel>
						<RichTextEditor
							id="compose-body"
							onChange={setBody}
							placeholder="Write your message…"
							value={body}
						/>
					</Field>

					{signatureIds.length > 0 ? (
						<Field>
							<FieldLabel htmlFor="compose-signature">Signature</FieldLabel>
							<Combobox<Id<'emailSignatures'>>
								items={signatureIds}
								itemToStringLabel={(item) =>
									signatures?.find((s) => s._id === item)?.name ?? item
								}
								onValueChange={(next) => setSignatureId(next)}
								value={signatureId}
							>
								<ComboboxInput
									id="compose-signature"
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

					<Field>
						<FieldLabel>Attachments</FieldLabel>
						<div className="flex w-full flex-col gap-2">
							{attachments.length > 0 ? (
								<div className="flex flex-wrap gap-1.5">
									{attachments.map((attachment) => (
										<Badge key={attachment.id} size="lg" variant="secondary">
											<Paperclip className="size-3.5" />
											{attachment.filename}
											{attachment.removable ? (
												<button
													aria-label={`Remove ${attachment.filename}`}
													className="ms-1 cursor-pointer opacity-70 hover:opacity-100"
													onClick={() => removeAttachment(attachment.id)}
													type="button"
												>
													<X className="size-3.5" />
												</button>
											) : null}
										</Badge>
									))}
								</div>
							) : null}
							<div>
								<Button
									onClick={() => fileInputRef.current?.click()}
									size="sm"
									type="button"
									variant="outline"
								>
									<Paperclip />
									Add files
								</Button>
								<input
									aria-label="Add attachments"
									className="sr-only"
									multiple
									onChange={(event) => {
										const { files } = event.target;
										if (files && files.length > 0) {
											addFiles(files).catch(() => {
												toastManager.add({
													title: 'Could not read one or more files',
													type: 'error',
												});
											});
										}
										event.target.value = '';
									}}
									ref={fileInputRef}
									type="file"
								/>
							</div>
						</div>
					</Field>
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
						Send email
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
