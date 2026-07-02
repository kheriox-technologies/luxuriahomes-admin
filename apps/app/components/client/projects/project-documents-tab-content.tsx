'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@workspace/ui/components/table';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction, useMutation, useQuery } from 'convex/react';
import { Download, EllipsisVertical, FileText, Upload, X } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { signCdnUrl } from '@/actions/cdn';
import {
	FileIcon,
	formatDate,
	formatFileSize,
	getOpenUrl,
} from '@/lib/client/files';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type ClientDocument = Doc<'projectDocuments'>;

type PendingStatus = 'pending' | 'uploading' | 'done' | 'error';
interface PendingUpload {
	error?: string;
	file: File;
	status: PendingStatus;
}

async function downloadDocument(doc: ClientDocument) {
	try {
		const signedUrl = await signCdnUrl(doc.s3Key);
		window.open(getOpenUrl(doc.mimeType, signedUrl), '_blank', 'noopener');
	} catch {
		toastManager.add({
			title: 'Could not generate download link',
			description: 'Please try again.',
			type: 'error',
		});
	}
}

function DocumentRowActions({ doc }: { doc: ClientDocument }) {
	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						aria-label="Document actions"
						size="icon-sm"
						type="button"
						variant="ghost"
					/>
				}
			>
				<EllipsisVertical className="size-4" />
			</MenuTrigger>
			<MenuPopup align="end">
				<MenuItem onClick={() => downloadDocument(doc).catch(() => undefined)}>
					<Download />
					Download
				</MenuItem>
			</MenuPopup>
		</Menu>
	);
}

function UploadDialog({
	open,
	onOpenChange,
	projectId,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	projectId: Id<'projects'>;
}) {
	const generateUploadUrl = useAction(
		api.clientPortal.documents.generateUploadUrl.generateUploadUrl
	);
	const createDocument = useMutation(api.clientPortal.documents.create.create);
	const inputRef = useRef<HTMLInputElement>(null);
	const [pending, setPending] = useState<PendingUpload[]>([]);
	const [uploading, setUploading] = useState(false);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files ?? []);
		setPending((prev) => [
			...prev,
			...files.map((file) => ({ file, status: 'pending' as PendingStatus })),
		]);
		if (inputRef.current) {
			inputRef.current.value = '';
		}
	};

	const removeFile = (index: number) => {
		setPending((prev) => prev.filter((_, i) => i !== index));
	};

	const onUpload = async () => {
		setUploading(true);
		let hasError = false;
		for (let i = 0; i < pending.length; i++) {
			const entry = pending[i];
			if (entry.status === 'done') {
				continue;
			}
			setPending((prev) =>
				prev.map((e, idx) => (idx === i ? { ...e, status: 'uploading' } : e))
			);
			try {
				const contentType = entry.file.type || 'application/octet-stream';
				const { uploadUrl, s3Key, kebabName } = await generateUploadUrl({
					projectId,
					fileName: entry.file.name,
					contentType,
				});
				await fetch(uploadUrl, {
					method: 'PUT',
					body: entry.file,
					headers: { 'Content-Type': contentType },
				});
				await createDocument({
					projectId,
					name: entry.file.name,
					kebabName,
					s3Key,
					size: entry.file.size,
					mimeType: entry.file.type || undefined,
				});
				setPending((prev) =>
					prev.map((e, idx) => (idx === i ? { ...e, status: 'done' } : e))
				);
			} catch (error) {
				hasError = true;
				setPending((prev) =>
					prev.map((e, idx) =>
						idx === i
							? {
									...e,
									status: 'error',
									error: getConvexErrorMessage(error, 'Upload failed'),
								}
							: e
					)
				);
			}
		}
		setUploading(false);
		if (!hasError) {
			toastManager.add({ title: 'Upload complete', type: 'success' });
			setPending([]);
			onOpenChange(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				if (!uploading) {
					onOpenChange(next);
					if (!next) {
						setPending([]);
					}
				}
			}}
			open={open}
		>
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Upload documents</DialogTitle>
					<DialogDescription>
						Files are added to your project and shared with the builder.
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<button
						className="flex flex-col items-center gap-2 rounded-lg border border-dashed p-6 text-center"
						onClick={() => inputRef.current?.click()}
						type="button"
					>
						<Upload className="size-5 text-muted-foreground" />
						<p className="text-sm">
							<span className="text-primary">Click to upload</span> or drag and
							drop
						</p>
					</button>
					<input
						className="sr-only"
						multiple
						onChange={onInputChange}
						ref={inputRef}
						type="file"
					/>
					{pending.length > 0 ? (
						<ul className="space-y-2">
							{pending.map((entry, i) => (
								<li
									className="flex items-center gap-3 rounded-lg border bg-background px-3 py-2.5"
									key={`${entry.file.name}-${i}`}
								>
									<FileIcon mimeType={entry.file.type} />
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">
											{entry.file.name}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatFileSize(entry.file.size)}
											{entry.status === 'uploading' && ' · Uploading…'}
											{entry.status === 'done' && ' · Done'}
											{entry.status === 'error' && ` · ${entry.error}`}
										</p>
									</div>
									{entry.status === 'pending' && !uploading ? (
										<button
											aria-label="Remove file"
											onClick={() => removeFile(i)}
											type="button"
										>
											<X className="size-3.5" />
										</button>
									) : null}
								</li>
							))}
						</ul>
					) : null}
				</div>
				<DialogFooter>
					<DialogClose
						render={
							<Button disabled={uploading} type="button" variant="outline">
								Cancel
							</Button>
						}
					/>
					<Button
						disabled={uploading || pending.length === 0}
						onClick={() => onUpload().catch(() => undefined)}
						type="button"
					>
						Upload
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default function ProjectDocumentsTabContent({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const documents = useQuery(api.clientPortal.documents.list.list, {
		projectId,
	});
	const [uploadOpen, setUploadOpen] = useState(false);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="flex items-center justify-between gap-3">
				<h2 className="font-medium text-lg">Documents</h2>
				<Button onClick={() => setUploadOpen(true)} type="button">
					<Upload />
					Upload
				</Button>
			</div>

			{documents === undefined ? (
				<p className="text-muted-foreground text-sm">Loading documents…</p>
			) : null}

			{documents && documents.length === 0 ? (
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<FileText aria-hidden />
						</EmptyMedia>
						<EmptyTitle>No documents yet</EmptyTitle>
						<EmptyDescription>
							Documents shared with you will appear here. You can also upload
							your own.
						</EmptyDescription>
					</EmptyHeader>
				</Empty>
			) : null}

			{documents && documents.length > 0 ? (
				<>
					{/* Mobile: stacked cards */}
					<div className="flex flex-col gap-3 md:hidden">
						{documents.map((doc) => (
							<div
								className="flex items-start justify-between gap-3 rounded-lg border bg-card p-4"
								key={doc._id}
							>
								<button
									className="flex min-w-0 items-start gap-2 text-left"
									onClick={() => downloadDocument(doc).catch(() => undefined)}
									type="button"
								>
									<FileIcon mimeType={doc.mimeType} />
									<div className="min-w-0">
										<p className="truncate font-medium">{doc.name}</p>
										<p className="text-muted-foreground text-xs">
											{doc.size != null ? formatFileSize(doc.size) : '—'} ·{' '}
											{formatDate(doc.uploadedAt)}
										</p>
									</div>
								</button>
								<DocumentRowActions doc={doc} />
							</div>
						))}
					</div>

					{/* Desktop: table */}
					<div className="hidden md:block">
						<Table className="w-full">
							<TableHeader>
								<TableRow>
									<TableHead className="min-w-[16rem]">Name</TableHead>
									<TableHead>Size</TableHead>
									<TableHead>Uploaded</TableHead>
									<TableHead className="w-12 min-w-12 max-w-12">
										<span className="sr-only">Actions</span>
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{documents.map((doc) => (
									<TableRow
										className="cursor-pointer"
										key={doc._id}
										onClick={() => downloadDocument(doc).catch(() => undefined)}
									>
										<TableCell className="font-medium">
											<div className="flex items-center gap-2">
												<FileIcon mimeType={doc.mimeType} />
												<span>{doc.name}</span>
											</div>
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{doc.size != null ? formatFileSize(doc.size) : '—'}
										</TableCell>
										<TableCell className="text-muted-foreground text-sm">
											{formatDate(doc.uploadedAt)}
										</TableCell>
										<TableCell
											className="w-12"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex justify-end">
												<DocumentRowActions doc={doc} />
											</div>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</>
			) : null}

			<UploadDialog
				onOpenChange={setUploadOpen}
				open={uploadOpen}
				projectId={projectId}
			/>
		</div>
	);
}
