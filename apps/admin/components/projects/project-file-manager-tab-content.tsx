'use client';

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
import { Badge } from '@workspace/ui/components/badge';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@workspace/ui/components/breadcrumb';
import { Button } from '@workspace/ui/components/button';
import { Checkbox } from '@workspace/ui/components/checkbox';
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
import { Input } from '@workspace/ui/components/input';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
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
import { useQuery } from 'convex/react';
import type { FunctionReference } from 'convex/server';
import {
	Download,
	EllipsisVertical,
	File,
	FileSpreadsheet,
	FileText,
	Folder,
	FolderOpen,
	FolderPlus,
	Mail,
	MonitorSmartphone,
	MonitorX,
	MoveRight,
	Pencil,
	Ruler,
	Trash2,
	Upload,
	X,
} from 'lucide-react';
import {
	type ChangeEvent,
	type DragEvent,
	type ReactNode,
	useCallback,
	useRef,
	useState,
} from 'react';
import { signCdnUrl } from '@/actions/cdn';
import ComposeEmailDialog from '@/components/email/compose-email-dialog';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import type { ComposeAttachment } from '@/lib/email';

const DEFAULT_ATTACHMENT_CONTENT_TYPE = 'application/octet-stream';

// Structural interfaces matching both projectDocuments and companyDocuments shapes
interface FileItem {
	_id: string;
	clientPortalVisible?: boolean;
	folderPath: string;
	kebabName: string;
	mimeType?: string;
	name: string;
	s3Key: string;
	size?: number;
	uploadedAt: number;
	uploadedByClient?: boolean;
}

interface FolderItem {
	_id: string;
	name: string;
	parentPath: string;
	path: string;
}

// biome-ignore lint/suspicious/noExplicitAny: return type and args differ per namespace; cast at use site
type ListContentsQuery = FunctionReference<'query', 'public', any, any>;

export interface FileManagerUploadArgs {
	contentType: string;
	fileName: string;
	folderPath: string;
}

export interface FileManagerCreateArgs {
	folderPath: string;
	kebabName: string;
	mimeType?: string;
	name: string;
	s3Key: string;
	size?: number;
}

export interface ProjectFileManagerTabContentProps {
	buildQueryArgs: (folderPath: string) => Record<string, unknown>;
	emptyTitle?: string;
	listContentsQuery: ListContentsQuery;
	// When provided, PDF files gain an "Add to take-offs" action.
	onAddToTakeoffs?: (fileId: string, title: string) => Promise<void>;
	onCreateFile: (args: FileManagerCreateArgs) => Promise<void>;
	onCreateFolder: (args: { name: string; parentPath: string }) => Promise<void>;
	onDeleteFolder: (folderId: string) => Promise<void>;
	onGenerateUploadUrl: (
		args: FileManagerUploadArgs
	) => Promise<{ uploadUrl: string; s3Key: string; kebabName: string }>;
	onMoveFile: (fileId: string, targetFolderPath: string) => Promise<void>;
	onRemoveFile: (fileId: string) => Promise<void>;
	onRenameFile: (fileId: string, newName: string) => Promise<void>;
	onRenameFolder: (folderId: string, newName: string) => Promise<void>;
	// When provided, files gain an "Add to / Remove from client portal" action.
	onSetClientPortalVisibility?: (
		fileId: string,
		visible: boolean
	) => Promise<void>;
	projectId?: Id<'projects'>;
	rootLabel?: string;
}

// ---------- Helpers ----------

function formatFileSize(bytes: number): string {
	if (bytes < 1024) {
		return `${bytes} B`;
	}
	if (bytes < 1024 * 1024) {
		return `${(bytes / 1024).toFixed(0)} KB`;
	}
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(timestamp));
}

function getFileIcon(mimeType?: string) {
	if (!mimeType) {
		return <File className="size-4 text-muted-foreground" />;
	}
	if (mimeType.includes('pdf')) {
		return <FileText className="size-4 text-red-500" />;
	}
	if (mimeType.startsWith('image/')) {
		return <File className="size-4 text-blue-500" />;
	}
	if (
		mimeType.includes('wordprocessingml') ||
		mimeType === 'application/msword'
	) {
		return <FileText className="size-4 text-blue-600" />;
	}
	if (
		mimeType.includes('spreadsheetml') ||
		mimeType === 'application/vnd.ms-excel'
	) {
		return <FileSpreadsheet className="size-4 text-green-600" />;
	}
	if (
		mimeType.includes('presentationml') ||
		mimeType === 'application/vnd.ms-powerpoint'
	) {
		return <File className="size-4 text-orange-500" />;
	}
	return <File className="size-4 text-muted-foreground" />;
}

const OFFICE_MIME_TYPES = new Set([
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	'application/msword',
	'application/vnd.ms-excel',
	'application/vnd.ms-powerpoint',
]);

function getOpenUrl(mimeType: string | undefined, signedUrl: string): string {
	if (mimeType && OFFICE_MIME_TYPES.has(mimeType)) {
		return `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(signedUrl)}`;
	}
	return signedUrl;
}

// ---------- Create Folder Dialog ----------

function CreateFolderDialog({
	open,
	onOpenChange,
	currentPath,
	onCreateFolder,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	currentPath: string;
	onCreateFolder: ProjectFileManagerTabContentProps['onCreateFolder'];
}) {
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		const trimmed = name.trim();
		if (!trimmed) {
			return;
		}
		setLoading(true);
		try {
			await onCreateFolder({
				name: trimmed,
				parentPath: currentPath,
			});
			toastManager.add({ title: 'Folder created', type: 'success' });
			setName('');
			onOpenChange(false);
		} catch (error) {
			onOpenChange(false);
			setName('');
			toastManager.add({
				title: 'Could not create folder',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					setName('');
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>New folder</DialogTitle>
					<DialogDescription>
						Enter a name for the new folder.
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 pb-2">
					<Input
						autoFocus
						id="new-folder-name"
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								onSubmit().catch(() => undefined);
							}
						}}
						placeholder="e.g. Floor Plans"
						value={name}
					/>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!name.trim() || loading}
						loading={loading}
						onClick={() => {
							onSubmit().catch(() => undefined);
						}}
						type="button"
					>
						Create folder
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ---------- Upload Files Dialog ----------

interface PendingUpload {
	error?: string;
	file: File;
	status: 'pending' | 'uploading' | 'done' | 'error';
}

function UploadFilesDialog({
	open,
	onOpenChange,
	currentPath,
	onGenerateUploadUrl,
	onCreateFile,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	currentPath: string;
	onGenerateUploadUrl: ProjectFileManagerTabContentProps['onGenerateUploadUrl'];
	onCreateFile: ProjectFileManagerTabContentProps['onCreateFile'];
}) {
	const [pending, setPending] = useState<PendingUpload[]>([]);
	const [uploading, setUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const addFiles = useCallback((files: FileList | null) => {
		if (!files) {
			return;
		}
		const newEntries: PendingUpload[] = Array.from(files).map((file) => ({
			file,
			status: 'pending',
		}));
		setPending((prev) => [...prev, ...newEntries]);
	}, []);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		addFiles(e.target.files);
		e.target.value = '';
	};

	const onDropZoneClick = () => inputRef.current?.click();

	const onDragOver = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const onDragLeave = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const onDrop = (e: DragEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsDragging(false);
		addFiles(e.dataTransfer.files);
	};

	const removeFile = (index: number) => {
		setPending((prev) => prev.filter((_, i) => i !== index));
	};

	const uploadAll = async () => {
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
				const { uploadUrl, s3Key, kebabName } = await onGenerateUploadUrl({
					folderPath: currentPath,
					fileName: entry.file.name,
					contentType: entry.file.type || 'application/octet-stream',
				});

				await fetch(uploadUrl, {
					method: 'PUT',
					body: entry.file,
					headers: {
						'Content-Type': entry.file.type || 'application/octet-stream',
					},
				});

				await onCreateFile({
					name: entry.file.name,
					kebabName,
					s3Key,
					folderPath: currentPath,
					size: entry.file.size,
					mimeType: entry.file.type || undefined,
				});

				setPending((prev) =>
					prev.map((e, idx) => (idx === i ? { ...e, status: 'done' } : e))
				);
			} catch (error) {
				hasError = true;
				const msg = error instanceof Error ? error.message : 'Upload failed';
				setPending((prev) =>
					prev.map((e, idx) =>
						idx === i ? { ...e, status: 'error', error: msg } : e
					)
				);
			}
		}

		setUploading(false);

		if (!hasError) {
			toastManager.add({ title: 'Files uploaded', type: 'success' });
			setPending([]);
			onOpenChange(false);
		}
	};

	const hasPending = pending.some((e) => e.status !== 'done');
	const pendingCount = pending.filter((e) => e.status !== 'done').length;

	return (
		<Dialog
			onOpenChange={(next) => {
				if (uploading) {
					return;
				}
				onOpenChange(next);
				if (!next) {
					setPending([]);
				}
			}}
			open={open}
		>
			<DialogContent className="flex h-[min(88vh,40rem)] w-[min(92vw,36rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
				<DialogHeader className="shrink-0 px-6 pt-6 pb-4">
					<DialogTitle>Upload files</DialogTitle>
					<DialogDescription>
						{currentPath
							? `Uploading to folder: ${currentPath}`
							: 'Uploading to root folder'}
					</DialogDescription>
				</DialogHeader>

				<div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-2">
					<input
						aria-hidden
						className="sr-only"
						id="file-manager-upload-input"
						multiple
						onChange={onInputChange}
						ref={inputRef}
						tabIndex={-1}
						type="file"
					/>
					<button
						aria-label="File upload area — click or drag and drop files here"
						className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-input border-dashed bg-muted/32 px-4 py-8 text-center transition-colors ${isDragging ? 'border-primary bg-primary/8' : ''}`}
						onClick={onDropZoneClick}
						onDragLeave={onDragLeave}
						onDragOver={onDragOver}
						onDrop={onDrop}
						type="button"
					>
						<span className="flex size-10 items-center justify-center rounded-lg border border-input bg-background shadow-xs/5">
							<Upload aria-hidden className="size-5 text-muted-foreground" />
						</span>
						<p className="font-medium text-sm">
							<span className="text-primary">Click to upload</span>
							<span className="text-muted-foreground"> or drag and drop</span>
						</p>
						<p className="text-muted-foreground text-xs">
							File names will be normalized to kebab-case
						</p>
					</button>

					{pending.length > 0 && (
						<ul className="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pe-1">
							{pending.map((entry, i) => (
								<li
									className="flex items-center gap-3 rounded-lg border border-input bg-background px-3 py-2.5"
									key={`${entry.file.name}-${i}`}
								>
									{getFileIcon(entry.file.type)}
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">
											{entry.file.name}
										</p>
										<p className="text-muted-foreground text-xs">
											{formatFileSize(entry.file.size)}
											{entry.status === 'uploading' && ' · Uploading…'}
											{entry.status === 'done' && ' · Done'}
											{entry.status === 'error' && ` · Error: ${entry.error}`}
										</p>
									</div>
									{entry.status === 'pending' && !uploading && (
										<button
											aria-label={`Remove ${entry.file.name}`}
											className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
											onClick={() => removeFile(i)}
											type="button"
										>
											<X className="size-3.5" />
										</button>
									)}
								</li>
							))}
						</ul>
					)}
				</div>

				<DialogFooter className="shrink-0 border-t px-6 py-4">
					<DialogClose
						render={
							<Button disabled={uploading} type="button" variant="outline" />
						}
					>
						Cancel
					</DialogClose>
					<Button
						disabled={pending.length === 0 || !hasPending || uploading}
						loading={uploading}
						onClick={() => {
							uploadAll().catch(() => undefined);
						}}
						type="button"
					>
						{`Upload${pendingCount > 0 ? ` ${pendingCount} file${pendingCount === 1 ? '' : 's'}` : ''}`}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ---------- Rename Dialog ----------

function RenameDialog({
	open,
	onOpenChange,
	initialName,
	title,
	onRename,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	initialName: string;
	title: string;
	onRename: (newName: string) => Promise<void>;
}) {
	const [name, setName] = useState(initialName);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		const trimmed = name.trim();
		if (!trimmed || trimmed === initialName) {
			onOpenChange(false);
			return;
		}
		setLoading(true);
		try {
			await onRename(trimmed);
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (next) {
					setName(initialName);
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
				</DialogHeader>
				<div className="px-6 pb-2">
					<Input
						autoFocus
						onChange={(e) => setName(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								onSubmit().catch(() => undefined);
							}
						}}
						value={name}
					/>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!name.trim() || loading}
						loading={loading}
						onClick={() => onSubmit().catch(() => undefined)}
						type="button"
					>
						Rename
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ---------- Add to Take-offs Dialog ----------

function AddToTakeoffsDialog({
	open,
	onOpenChange,
	initialTitle,
	onAdd,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	initialTitle: string;
	onAdd: (title: string) => Promise<void>;
}) {
	const [title, setTitle] = useState(initialTitle);
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		const trimmed = title.trim();
		if (!trimmed) {
			return;
		}
		setLoading(true);
		try {
			await onAdd(trimmed);
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (next) {
					setTitle(initialTitle);
				}
			}}
			open={open}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add to take-offs</DialogTitle>
					<DialogDescription>
						Enter a title for this take-off.
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 pb-2">
					<Input
						autoFocus
						onChange={(e) => setTitle(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								onSubmit().catch(() => undefined);
							}
						}}
						placeholder="e.g. Ground Floor Plan"
						value={title}
					/>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={!title.trim() || loading}
						loading={loading}
						onClick={() => onSubmit().catch(() => undefined)}
						type="button"
					>
						Add to take-offs
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ---------- Move Dialog ----------

function MoveFolderPicker({
	buildQueryArgs,
	selected,
	onSelect,
	currentFolderPath,
	listContentsQuery,
	parentPath = '',
	depth = 0,
}: {
	buildQueryArgs: ProjectFileManagerTabContentProps['buildQueryArgs'];
	selected: string;
	onSelect: (path: string) => void;
	currentFolderPath: string;
	listContentsQuery: ListContentsQuery;
	parentPath?: string;
	depth?: number;
}) {
	// biome-ignore lint/suspicious/noExplicitAny: args shape varies by namespace
	const raw = useQuery(listContentsQuery, buildQueryArgs(parentPath) as any);
	const contents = raw as { folders: FolderItem[] } | undefined;

	return (
		<ul className="flex flex-col gap-0.5">
			{depth === 0 && (
				<li>
					<button
						className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${selected === '' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'} ${currentFolderPath === '' ? 'cursor-not-allowed opacity-50' : ''}`}
						disabled={currentFolderPath === ''}
						onClick={() => onSelect('')}
						type="button"
					>
						<FolderOpen className="size-4 shrink-0" />
						<span>Root folder</span>
					</button>
				</li>
			)}
			{contents?.folders.map((folder) => (
				<li key={folder._id} style={{ paddingLeft: `${depth * 16}px` }}>
					<button
						className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${selected === folder.path ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'} ${folder.path === currentFolderPath ? 'cursor-not-allowed opacity-50' : ''}`}
						disabled={folder.path === currentFolderPath}
						onClick={() => onSelect(folder.path)}
						type="button"
					>
						<Folder className="size-4 shrink-0" />
						<span>{folder.name}</span>
					</button>
					<MoveFolderPicker
						buildQueryArgs={buildQueryArgs}
						currentFolderPath={currentFolderPath}
						depth={depth + 1}
						listContentsQuery={listContentsQuery}
						onSelect={onSelect}
						parentPath={folder.path}
						selected={selected}
					/>
				</li>
			))}
		</ul>
	);
}

function MoveDialog({
	open,
	onOpenChange,
	item,
	buildQueryArgs,
	listContentsQuery,
	onMove,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	item: FileItem;
	buildQueryArgs: ProjectFileManagerTabContentProps['buildQueryArgs'];
	listContentsQuery: ListContentsQuery;
	onMove: (targetFolderPath: string) => Promise<void>;
}) {
	const [selected, setSelected] = useState('');
	const [loading, setLoading] = useState(false);

	const onSubmit = async () => {
		setLoading(true);
		try {
			await onMove(selected);
			onOpenChange(false);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Move file</DialogTitle>
					<DialogDescription>
						Choose where to move{' '}
						<span className="font-medium text-foreground">{item.name}</span>
					</DialogDescription>
				</DialogHeader>
				<div className="px-6 pb-2">
					<MoveFolderPicker
						buildQueryArgs={buildQueryArgs}
						currentFolderPath={item.folderPath}
						listContentsQuery={listContentsQuery}
						onSelect={setSelected}
						selected={selected}
					/>
				</div>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button
						disabled={selected === item.folderPath || loading}
						loading={loading}
						onClick={() => onSubmit().catch(() => undefined)}
						type="button"
					>
						Move here
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// ---------- Delete Dialogs ----------

function DeleteFileDialog({
	open,
	onOpenChange,
	item,
	onRemove,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	item: FileItem;
	onRemove: (fileId: string) => Promise<void>;
}) {
	const [loading, setLoading] = useState(false);

	const onDelete = async () => {
		setLoading(true);
		try {
			await onRemove(item._id);
			toastManager.add({ title: 'File deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				title: 'Could not delete file',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete file?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete "${item.name}" from S3.`}
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

function DeleteFolderDialog({
	open,
	onOpenChange,
	folder,
	onDeleteFolder,
}: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	folder: FolderItem;
	onDeleteFolder: (folderId: string) => Promise<void>;
}) {
	const [loading, setLoading] = useState(false);

	const onDelete = async () => {
		setLoading(true);
		try {
			await onDeleteFolder(folder._id);
			toastManager.add({ title: 'Folder deleted', type: 'success' });
			onOpenChange(false);
		} catch (error) {
			toastManager.add({
				title: 'Could not delete folder',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete folder?</AlertDialogTitle>
					<AlertDialogDescription>
						{`This will permanently delete the folder "${folder.name}" and all its contents from S3. This cannot be undone.`}
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
						Delete folder
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

// ---------- Row Actions ----------

function FileRowActions({
	item,
	buildQueryArgs,
	listContentsQuery,
	onRenameFile,
	onMoveFile,
	onRemoveFile,
	onAddToTakeoffs,
	onSetClientPortalVisibility,
}: {
	item: FileItem;
	buildQueryArgs: ProjectFileManagerTabContentProps['buildQueryArgs'];
	listContentsQuery: ListContentsQuery;
	onRenameFile: ProjectFileManagerTabContentProps['onRenameFile'];
	onMoveFile: ProjectFileManagerTabContentProps['onMoveFile'];
	onRemoveFile: ProjectFileManagerTabContentProps['onRemoveFile'];
	onAddToTakeoffs?: ProjectFileManagerTabContentProps['onAddToTakeoffs'];
	onSetClientPortalVisibility?: ProjectFileManagerTabContentProps['onSetClientPortalVisibility'];
}) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [moveOpen, setMoveOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [addTakeoffOpen, setAddTakeoffOpen] = useState(false);

	const isPdf = item.mimeType?.includes('pdf') ?? false;

	const onAddTakeoff = async (title: string) => {
		try {
			await onAddToTakeoffs?.(item._id, title);
			toastManager.add({ title: 'Added to take-offs', type: 'success' });
		} catch (error) {
			toastManager.add({
				title: 'Could not add to take-offs',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
			throw error;
		}
	};

	const onTogglePortal = async () => {
		const nextVisible = !item.clientPortalVisible;
		try {
			await onSetClientPortalVisibility?.(item._id, nextVisible);
			toastManager.add({
				title: nextVisible
					? 'Added to client portal'
					: 'Removed from client portal',
				type: 'success',
			});
		} catch (error) {
			toastManager.add({
				title: 'Could not update client portal visibility',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		}
	};

	const onRename = async (newName: string) => {
		try {
			await onRenameFile(item._id, newName);
			toastManager.add({ title: 'File renamed', type: 'success' });
		} catch (error) {
			toastManager.add({
				title: 'Could not rename file',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
			throw error;
		}
	};

	const onMove = async (targetFolderPath: string) => {
		try {
			await onMoveFile(item._id, targetFolderPath);
			toastManager.add({ title: 'File moved', type: 'success' });
		} catch (error) {
			toastManager.add({
				title: 'Could not move file',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
			throw error;
		}
	};

	const onDownload = async () => {
		try {
			const url = await signCdnUrl(item.s3Key);
			window.open(url, '_blank', 'noopener');
		} catch {
			toastManager.add({
				title: 'Could not generate download link',
				description: 'Please try again.',
				type: 'error',
			});
		}
	};

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="File actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => onDownload().catch(() => undefined)}>
						<Download />
						Download
					</MenuItem>
					<MenuItem onClick={() => setRenameOpen(true)}>
						<Pencil />
						Rename
					</MenuItem>
					<MenuItem onClick={() => setMoveOpen(true)}>
						<MoveRight />
						Move
					</MenuItem>
					{onAddToTakeoffs && isPdf ? (
						<MenuItem onClick={() => setAddTakeoffOpen(true)}>
							<Ruler />
							Add to take-offs
						</MenuItem>
					) : null}
					{onSetClientPortalVisibility ? (
						<MenuItem onClick={() => onTogglePortal().catch(() => undefined)}>
							{item.clientPortalVisible ? <MonitorX /> : <MonitorSmartphone />}
							{item.clientPortalVisible
								? 'Remove from client portal'
								: 'Add to client portal'}
						</MenuItem>
					) : null}
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>

			<RenameDialog
				initialName={item.name}
				onOpenChange={setRenameOpen}
				onRename={onRename}
				open={renameOpen}
				title="Rename file"
			/>
			<MoveDialog
				buildQueryArgs={buildQueryArgs}
				item={item}
				listContentsQuery={listContentsQuery}
				onMove={onMove}
				onOpenChange={setMoveOpen}
				open={moveOpen}
			/>
			<DeleteFileDialog
				item={item}
				onOpenChange={setDeleteOpen}
				onRemove={onRemoveFile}
				open={deleteOpen}
			/>
			{onAddToTakeoffs ? (
				<AddToTakeoffsDialog
					initialTitle={item.name}
					onAdd={onAddTakeoff}
					onOpenChange={setAddTakeoffOpen}
					open={addTakeoffOpen}
				/>
			) : null}
		</>
	);
}

function FolderRowActions({
	folder,
	onRenameFolder,
	onDeleteFolder,
}: {
	folder: FolderItem;
	onRenameFolder: ProjectFileManagerTabContentProps['onRenameFolder'];
	onDeleteFolder: ProjectFileManagerTabContentProps['onDeleteFolder'];
}) {
	const [renameOpen, setRenameOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	const onRename = async (newName: string) => {
		try {
			await onRenameFolder(folder._id, newName);
			toastManager.add({ title: 'Folder renamed', type: 'success' });
		} catch (error) {
			toastManager.add({
				title: 'Could not rename folder',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
			throw error;
		}
	};

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Folder actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setRenameOpen(true)}>
						<Pencil />
						Rename
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete folder
					</MenuItem>
				</MenuPopup>
			</Menu>

			<RenameDialog
				initialName={folder.name}
				onOpenChange={setRenameOpen}
				onRename={onRename}
				open={renameOpen}
				title="Rename folder"
			/>
			<DeleteFolderDialog
				folder={folder}
				onDeleteFolder={onDeleteFolder}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</>
	);
}

// ---------- Breadcrumb ----------

function FileManagerBreadcrumb({
	currentPath,
	rootLabel,
	onNavigate,
}: {
	currentPath: string;
	rootLabel: string;
	onNavigate: (path: string) => void;
}) {
	const segments = currentPath ? currentPath.split('/') : [];

	return (
		<Breadcrumb>
			<BreadcrumbList>
				<BreadcrumbItem>
					{segments.length === 0 ? (
						<BreadcrumbPage>{rootLabel}</BreadcrumbPage>
					) : (
						<BreadcrumbLink
							render={
								<button
									className="transition-colors hover:text-foreground"
									onClick={() => onNavigate('')}
									type="button"
								/>
							}
						>
							{rootLabel}
						</BreadcrumbLink>
					)}
				</BreadcrumbItem>
				{segments.map((segment, i) => {
					const segmentPath = segments.slice(0, i + 1).join('/');
					const isLast = i === segments.length - 1;
					return [
						<BreadcrumbSeparator key={`sep-${segmentPath}`} />,
						<BreadcrumbItem key={segmentPath}>
							{isLast ? (
								<BreadcrumbPage>{segment}</BreadcrumbPage>
							) : (
								<BreadcrumbLink
									render={
										<button
											className="transition-colors hover:text-foreground"
											onClick={() => onNavigate(segmentPath)}
											type="button"
										/>
									}
								>
									{segment}
								</BreadcrumbLink>
							)}
						</BreadcrumbItem>,
					];
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}

// ---------- Main Component ----------

export function ProjectFileManagerTabContent({
	buildQueryArgs,
	listContentsQuery,
	onGenerateUploadUrl,
	onCreateFile,
	onCreateFolder,
	onRenameFile,
	onMoveFile,
	onRemoveFile,
	onRenameFolder,
	onDeleteFolder,
	onAddToTakeoffs,
	onSetClientPortalVisibility,
	projectId,
	rootLabel = 'Files',
	emptyTitle = 'No files yet',
}: ProjectFileManagerTabContentProps) {
	const [currentPath, setCurrentPath] = useState('');
	const [createFolderOpen, setCreateFolderOpen] = useState(false);
	const [uploadOpen, setUploadOpen] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	// Tracks dragenter/dragleave depth so the overlay doesn't flicker when the
	// cursor moves over child elements of the drop zone.
	const dragDepth = useRef(0);
	const [loadingDocs, setLoadingDocs] = useState<Set<string>>(new Set());
	// Keyed by document id so the selection persists across folder navigation
	// and an email can attach documents picked from multiple folders.
	const [selectedDocs, setSelectedDocs] = useState<Map<string, FileItem>>(
		new Map()
	);
	const [emailOpen, setEmailOpen] = useState(false);
	const [emailAttachments, setEmailAttachments] = useState<ComposeAttachment[]>(
		[]
	);

	const navigateTo = (path: string) => {
		setCurrentPath(path);
	};

	const toggleSelected = (doc: FileItem) => {
		setSelectedDocs((prev) => {
			const next = new Map(prev);
			if (next.has(doc._id)) {
				next.delete(doc._id);
			} else {
				next.set(doc._id, doc);
			}
			return next;
		});
	};

	const handleOpenDocument = async (doc: FileItem) => {
		if (loadingDocs.has(doc._id)) {
			return;
		}
		setLoadingDocs((prev) => new Set(prev).add(doc._id));
		try {
			const signedUrl = await signCdnUrl(doc.s3Key);
			window.open(getOpenUrl(doc.mimeType, signedUrl), '_blank', 'noopener');
		} catch {
			toastManager.add({
				title: 'Could not open file',
				description: 'Please try again.',
				type: 'error',
			});
		} finally {
			setLoadingDocs((prev) => {
				const next = new Set(prev);
				next.delete(doc._id);
				return next;
			});
		}
	};

	// Upload a single file to the current folder, surfacing progress via a toast
	// that transitions from loading to success/error.
	const uploadOne = useCallback(
		async (file: File) => {
			const contentType = file.type || 'application/octet-stream';
			const toastId = toastManager.add({
				title: `Uploading ${file.name}`,
				type: 'loading',
			});
			try {
				const { uploadUrl, s3Key, kebabName } = await onGenerateUploadUrl({
					folderPath: currentPath,
					fileName: file.name,
					contentType,
				});

				const res = await fetch(uploadUrl, {
					method: 'PUT',
					body: file,
					headers: { 'Content-Type': contentType },
				});
				if (!res.ok) {
					throw new Error(`Upload failed (${res.status})`);
				}

				await onCreateFile({
					name: file.name,
					kebabName,
					s3Key,
					folderPath: currentPath,
					size: file.size,
					mimeType: file.type || undefined,
				});

				toastManager.update(toastId, {
					title: `${file.name} uploaded`,
					type: 'success',
				});
			} catch (error) {
				toastManager.update(toastId, {
					title: `Could not upload ${file.name}`,
					description: getConvexErrorMessage(error, 'Please try again.'),
					type: 'error',
				});
			}
		},
		[currentPath, onCreateFile, onGenerateUploadUrl]
	);

	// Upload dropped files concurrently so one slow file doesn't block the rest.
	const uploadFiles = useCallback(
		(files: FileList | File[]) => {
			const list = Array.from(files);
			if (list.length === 0) {
				return;
			}
			Promise.allSettled(list.map((file) => uploadOne(file))).catch(
				() => undefined
			);
		},
		[uploadOne]
	);

	const hasFiles = (e: DragEvent<HTMLDivElement>) =>
		Array.from(e.dataTransfer.types).includes('Files');

	const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
		if (!hasFiles(e)) {
			return;
		}
		e.preventDefault();
		dragDepth.current += 1;
		setIsDragging(true);
	};

	const onDragOver = (e: DragEvent<HTMLDivElement>) => {
		if (!hasFiles(e)) {
			return;
		}
		e.preventDefault();
	};

	const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
		if (!hasFiles(e)) {
			return;
		}
		e.preventDefault();
		dragDepth.current = Math.max(0, dragDepth.current - 1);
		if (dragDepth.current === 0) {
			setIsDragging(false);
		}
	};

	const onDrop = (e: DragEvent<HTMLDivElement>) => {
		if (!hasFiles(e)) {
			return;
		}
		e.preventDefault();
		dragDepth.current = 0;
		setIsDragging(false);
		uploadFiles(e.dataTransfer.files);
	};

	// biome-ignore lint/suspicious/noExplicitAny: args shape varies by namespace
	const raw = useQuery(listContentsQuery, buildQueryArgs(currentPath) as any);
	const contents = raw as
		| { folders: FolderItem[]; documents: FileItem[] }
		| undefined;

	const documents = contents?.documents ?? [];
	const allSelected =
		documents.length > 0 && documents.every((doc) => selectedDocs.has(doc._id));
	const someSelected = documents.some((doc) => selectedDocs.has(doc._id));
	const selectedCount = selectedDocs.size;

	const toggleSelectAll = () => {
		setSelectedDocs((prev) => {
			const next = new Map(prev);
			if (documents.every((doc) => next.has(doc._id))) {
				for (const doc of documents) {
					next.delete(doc._id);
				}
			} else {
				for (const doc of documents) {
					next.set(doc._id, doc);
				}
			}
			return next;
		});
	};

	const openEmailWithSelected = () => {
		if (selectedDocs.size === 0) {
			return;
		}
		setEmailAttachments(
			Array.from(selectedDocs.values()).map((doc) => ({
				id: doc._id,
				filename: doc.name,
				contentType: doc.mimeType ?? DEFAULT_ATTACHMENT_CONTENT_TYPE,
				s3Key: doc.s3Key,
				removable: true,
			}))
		);
		setEmailOpen(true);
	};

	const isEmpty =
		contents !== undefined &&
		contents.folders.length === 0 &&
		contents.documents.length === 0;

	let body: ReactNode;
	if (contents === undefined) {
		body = <p className="text-muted-foreground text-sm">Loading…</p>;
	} else if (isEmpty) {
		body = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<FolderOpen aria-hidden />
					</EmptyMedia>
					<EmptyTitle>
						{currentPath ? 'This folder is empty' : emptyTitle}
					</EmptyTitle>
					<EmptyDescription>
						Upload files or create a folder to get started.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		body = (
			<div className="w-full min-w-0 overflow-x-auto rounded-lg border">
				<Table className="w-full min-w-xl">
					<TableHeader>
						<TableRow>
							<TableHead className="w-10 min-w-10 max-w-10">
								<Checkbox
									aria-label="Select all files"
									checked={allSelected}
									disabled={documents.length === 0}
									indeterminate={someSelected && !allSelected}
									onCheckedChange={toggleSelectAll}
								/>
							</TableHead>
							<TableHead className="min-w-[16rem]">Name</TableHead>
							<TableHead>Size</TableHead>
							<TableHead>Uploaded</TableHead>
							<TableHead className="w-12 min-w-12 max-w-12">
								<span className="sr-only">Actions</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{contents.folders.map((folder) => (
							<TableRow
								className="cursor-pointer"
								key={folder._id}
								onClick={() => navigateTo(folder.path)}
							>
								<TableCell className="w-10" />
								<TableCell className="font-medium">
									<div className="flex items-center gap-2">
										<Folder className="size-4 shrink-0 text-yellow-500" />
										<span>{folder.name}</span>
									</div>
								</TableCell>
								<TableCell className="text-muted-foreground">—</TableCell>
								<TableCell className="text-muted-foreground">—</TableCell>
								<TableCell
									className="w-12"
									onClick={(e) => e.stopPropagation()}
								>
									<div className="flex justify-end">
										<FolderRowActions
											folder={folder}
											onDeleteFolder={onDeleteFolder}
											onRenameFolder={onRenameFolder}
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
						{contents.documents.map((doc) => (
							<TableRow
								className="cursor-pointer"
								data-state={selectedDocs.has(doc._id) ? 'selected' : undefined}
								key={doc._id}
								onClick={() => handleOpenDocument(doc).catch(() => undefined)}
							>
								<TableCell
									className="w-10"
									onClick={(e) => e.stopPropagation()}
								>
									<Checkbox
										aria-label={`Select ${doc.name}`}
										checked={selectedDocs.has(doc._id)}
										onCheckedChange={() => toggleSelected(doc)}
									/>
								</TableCell>
								<TableCell className="font-medium">
									<div className="flex flex-wrap items-center gap-2">
										{getFileIcon(doc.mimeType)}
										<span>{doc.name}</span>
										{doc.uploadedByClient ? (
											<Badge size="lg" variant="secondary">
												Uploaded by client
											</Badge>
										) : null}
										{doc.clientPortalVisible ? (
											<Badge size="lg" variant="success">
												On client portal
											</Badge>
										) : null}
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
										<FileRowActions
											buildQueryArgs={buildQueryArgs}
											item={doc}
											listContentsQuery={listContentsQuery}
											onAddToTakeoffs={onAddToTakeoffs}
											onMoveFile={onMoveFile}
											onRemoveFile={onRemoveFile}
											onRenameFile={onRenameFile}
											onSetClientPortalVisibility={onSetClientPortalVisibility}
										/>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop is a progressive enhancement; the Upload button is the accessible alternative
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: drag-and-drop is a progressive enhancement; the Upload button is the accessible alternative
		<div
			className="relative flex min-h-0 flex-1 flex-col gap-4"
			onDragEnter={onDragEnter}
			onDragLeave={onDragLeave}
			onDragOver={onDragOver}
			onDrop={onDrop}
		>
			{isDragging ? (
				<div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-primary border-dashed bg-primary/8 backdrop-blur-xs">
					<span className="flex size-12 items-center justify-center rounded-lg border border-input bg-background shadow-xs/5">
						<Upload aria-hidden className="size-6 text-primary" />
					</span>
					<p className="font-medium text-sm">
						{`Drop files to upload to ${currentPath || rootLabel}`}
					</p>
				</div>
			) : null}
			<div className="flex items-center justify-between gap-3">
				<FileManagerBreadcrumb
					currentPath={currentPath}
					onNavigate={navigateTo}
					rootLabel={rootLabel}
				/>
				<div className="flex shrink-0 items-center gap-2">
					<Button
						onClick={() => setCreateFolderOpen(true)}
						size="sm"
						type="button"
						variant="outline"
					>
						<FolderPlus />
						New folder
					</Button>
					<Button onClick={() => setUploadOpen(true)} size="sm" type="button">
						<Upload />
						Upload
					</Button>
				</div>
			</div>

			{selectedCount > 0 ? (
				<div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
					<span className="font-medium text-sm">{selectedCount} selected</span>
					<div className="flex items-center gap-2">
						<Button
							onClick={() => setSelectedDocs(new Map())}
							size="sm"
							type="button"
							variant="ghost"
						>
							Clear
						</Button>
						<Button onClick={openEmailWithSelected} size="sm" type="button">
							<Mail />
							Email
						</Button>
					</div>
				</div>
			) : null}

			{body}

			<ComposeEmailDialog
				defaultAttachments={emailAttachments}
				onOpenChange={setEmailOpen}
				onSent={() => setSelectedDocs(new Map())}
				open={emailOpen}
				projectId={projectId}
			/>

			<CreateFolderDialog
				currentPath={currentPath}
				onCreateFolder={onCreateFolder}
				onOpenChange={setCreateFolderOpen}
				open={createFolderOpen}
			/>
			<UploadFilesDialog
				currentPath={currentPath}
				onCreateFile={onCreateFile}
				onGenerateUploadUrl={onGenerateUploadUrl}
				onOpenChange={setUploadOpen}
				open={uploadOpen}
			/>
		</div>
	);
}
