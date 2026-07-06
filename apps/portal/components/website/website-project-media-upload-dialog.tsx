'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@workspace/ui/components/dialog';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useAction, useMutation } from 'convex/react';
import {
	Check,
	CheckCircle2,
	FileVideo,
	ImageIcon,
	Upload,
	XCircle,
} from 'lucide-react';
import {
	type ChangeEvent,
	type DragEvent,
	type ReactElement,
	useRef,
	useState,
} from 'react';

type MediaType = 'image' | 'video';

interface UploadItem {
	id: number;
	name: string;
	status: 'uploading' | 'done' | 'error';
	type: MediaType;
}

function mediaTypeOf(file: File): MediaType | null {
	if (file.type.startsWith('image/')) {
		return 'image';
	}
	if (file.type.startsWith('video/')) {
		return 'video';
	}
	return null;
}

export default function WebsiteProjectMediaUploadDialog({
	websiteProjectId,
	trigger,
}: {
	websiteProjectId: Id<'websiteProjects'>;
	trigger: ReactElement;
}) {
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState<UploadItem[]>([]);
	const [isUploading, setIsUploading] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const idRef = useRef(0);

	const generateUploadUrl = useAction(
		api.websiteProjects.generateUploadUrl.generateUploadUrl
	);
	const appendMedia = useMutation(api.websiteProjects.appendMedia.appendMedia);

	const reset = () => {
		setItems([]);
		setIsUploading(false);
	};

	const setItemStatus = (id: number, status: UploadItem['status']) => {
		setItems((prev) =>
			prev.map((item) => (item.id === id ? { ...item, status } : item))
		);
	};

	const uploadOne = async (
		file: File,
		type: MediaType,
		id: number
	): Promise<{ key: string; type: MediaType } | null> => {
		try {
			const ext = file.name.split('.').pop() ?? '';
			const { uploadUrl, s3Key } = await generateUploadUrl({
				websiteProjectId,
				mediaType: type,
				contentType: file.type || 'application/octet-stream',
				ext,
			});
			const response = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': file.type || 'application/octet-stream' },
				body: file,
			});
			if (!response.ok) {
				throw new Error('Upload failed');
			}
			setItemStatus(id, 'done');
			return { key: s3Key, type };
		} catch {
			setItemStatus(id, 'error');
			return null;
		}
	};

	const handleFiles = async (fileList: FileList) => {
		const accepted: Array<{ file: File; type: MediaType; id: number }> = [];
		let rejected = 0;
		for (const file of Array.from(fileList)) {
			const type = mediaTypeOf(file);
			if (type === null) {
				rejected += 1;
				continue;
			}
			idRef.current += 1;
			accepted.push({ file, type, id: idRef.current });
		}

		if (rejected > 0) {
			toastManager.add({
				description: 'Only image and video files can be uploaded.',
				title: `Skipped ${rejected} unsupported ${rejected === 1 ? 'file' : 'files'}`,
				type: 'error',
			});
		}
		if (accepted.length === 0) {
			return;
		}

		setItems((prev) => [
			...prev,
			...accepted.map(({ file, type, id }) => ({
				id,
				name: file.name,
				type,
				status: 'uploading' as const,
			})),
		]);
		setIsUploading(true);
		try {
			const results = await Promise.all(
				accepted.map(({ file, type, id }) => uploadOne(file, type, id))
			);
			const uploaded = results.filter(
				(r): r is { key: string; type: MediaType } => r !== null
			);
			if (uploaded.length > 0) {
				await appendMedia({ websiteProjectId, media: uploaded });
				toastManager.add({
					title: `Uploaded ${uploaded.length} ${uploaded.length === 1 ? 'file' : 'files'}`,
					type: 'success',
				});
			}
			if (uploaded.length < accepted.length) {
				toastManager.add({
					description: 'Some files could not be uploaded. Please try again.',
					title: 'Some uploads failed',
					type: 'error',
				});
			}
		} finally {
			setIsUploading(false);
		}
	};

	const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			handleFiles(event.target.files).catch(() => {
				/* per-file errors are surfaced via item status + toast */
			});
		}
		event.target.value = '';
	};

	const onDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		event.stopPropagation();
		setIsDragging(false);
		if (event.dataTransfer.files?.length) {
			handleFiles(event.dataTransfer.files).catch(() => {
				/* per-file errors are surfaced via item status + toast */
			});
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				setOpen(next);
				if (!next) {
					reset();
				}
			}}
			open={open}
		>
			<DialogTrigger render={trigger} />
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Upload images / videos</DialogTitle>
					<DialogDescription>
						Files are stored in the public bucket and shown in the project
						gallery. Only images and videos are allowed.
					</DialogDescription>
				</DialogHeader>

				{/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop drop zone */}
				{/* biome-ignore lint/a11y/noNoninteractiveElementInteractions: drag-and-drop drop zone */}
				<div
					className={cn(
						'rounded-xl border-2 border-input border-dashed bg-muted/32 px-4 py-8 transition-colors',
						isDragging && 'border-primary bg-primary/8'
					)}
					onDragLeave={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsDragging(false);
					}}
					onDragOver={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsDragging(true);
					}}
					onDrop={onDrop}
				>
					<input
						accept="image/*,video/*"
						aria-label="Upload images or videos"
						className="sr-only"
						multiple
						onChange={onInputChange}
						ref={inputRef}
						type="file"
					/>
					<div className="flex flex-col items-center justify-center gap-2 text-center">
						<span className="flex size-10 items-center justify-center rounded-lg border border-input bg-background shadow-xs/5">
							<Upload aria-hidden className="size-5 text-muted-foreground" />
						</span>
						<Button
							onClick={() => inputRef.current?.click()}
							type="button"
							variant="outline"
						>
							<Upload aria-hidden /> Choose files
						</Button>
						<p className="text-muted-foreground text-xs">
							or drag and drop images and videos here
						</p>
					</div>
				</div>

				{items.length > 0 ? (
					<ul className="flex max-h-56 flex-col gap-2 overflow-y-auto">
						{items.map((item) => (
							<li
								className="flex items-center gap-3 rounded-lg border border-input bg-background px-3 py-2"
								key={item.id}
							>
								<span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-input bg-muted/48">
									{item.type === 'video' ? (
										<FileVideo
											aria-hidden
											className="size-4 text-muted-foreground"
										/>
									) : (
										<ImageIcon
											aria-hidden
											className="size-4 text-muted-foreground"
										/>
									)}
								</span>
								<p className="min-w-0 flex-1 truncate text-sm">{item.name}</p>
								{item.status === 'uploading' ? (
									<span className="text-muted-foreground text-xs">
										Uploading…
									</span>
								) : null}
								{item.status === 'done' ? (
									<CheckCircle2
										aria-label="Uploaded"
										className="size-4 text-success-foreground"
									/>
								) : null}
								{item.status === 'error' ? (
									<XCircle
										aria-label="Failed"
										className="size-4 text-destructive-foreground"
									/>
								) : null}
							</li>
						))}
					</ul>
				) : null}

				<DialogFooter>
					<Button
						disabled={isUploading}
						onClick={() => setOpen(false)}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> Done
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
