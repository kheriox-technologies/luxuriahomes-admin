'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardFrame,
	CardFrameDescription,
	CardFrameHeader,
	CardFrameTitle,
	CardHeader,
	CardPanel,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Progress,
	ProgressIndicator,
	ProgressTrack,
} from '@workspace/ui/components/progress';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation } from 'convex/react';
import { ImageIcon, RefreshCw, Upload } from 'lucide-react';
import {
	type ChangeEvent,
	type DragEvent,
	useCallback,
	useId,
	useState,
} from 'react';
import PageHeading from '@/components/page-heading';

type UploadPhase = 'idle' | 'uploading' | 'finalizing' | 'done' | 'error';

interface UploadResult {
	byteLength: number;
	contentType: string;
	documentId: Id<'uploadTestImages'>;
	fileName: string;
	storageId: Id<'_storage'>;
	url: string | null;
}

interface FileRow {
	byteLength: number;
	contentType: string;
	errorMessage?: string;
	file: File;
	id: string;
	name: string;
	phase: UploadPhase;
	progress: number;
	result?: UploadResult;
}

function formatBytes(n: number) {
	if (n < 1024) {
		return `${n} B`;
	}
	if (n < 1024 * 1024) {
		return `${(n / 1024).toFixed(n < 10_240 ? 1 : 0)} KB`;
	}
	return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File) {
	return file.type.startsWith('image/');
}

function readStorageId(body: unknown): Id<'_storage'> | null {
	if (
		body &&
		typeof body === 'object' &&
		'storageId' in body &&
		typeof (body as { storageId: unknown }).storageId === 'string'
	) {
		return (body as { storageId: string }).storageId as Id<'_storage'>;
	}
	return null;
}

function phaseLabel(phase: UploadPhase): string {
	switch (phase) {
		case 'done':
			return 'Complete';
		case 'finalizing':
			return 'Saving metadata…';
		case 'uploading':
			return 'Uploading…';
		default:
			return 'Queued';
	}
}

function ignoreUploadPromiseError() {
	/* uploadOne updates row state on failure */
}

interface ImageDropZoneProps {
	inputId: string;
	isDragging: boolean;
	onDrop: (e: DragEvent) => void;
	onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
	setIsDragging: (v: boolean) => void;
}

function ImageDropZone({
	inputId,
	isDragging,
	onDrop,
	onInputChange,
	setIsDragging,
}: ImageDropZoneProps) {
	return (
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: drag-and-drop shell; file input is focusable via the label
		// biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop shell
		<div
			className={cn(
				'rounded-xl border-2 border-dashed transition-colors',
				isDragging
					? 'border-primary bg-primary/5'
					: 'border-muted-foreground/25 hover:border-muted-foreground/40'
			)}
			onDragEnter={(e) => {
				e.preventDefault();
				setIsDragging(true);
			}}
			onDragLeave={(e) => {
				e.preventDefault();
				if (!e.currentTarget.contains(e.relatedTarget as Node)) {
					setIsDragging(false);
				}
			}}
			onDragOver={(e) => {
				e.preventDefault();
				e.dataTransfer.dropEffect = 'copy';
			}}
			onDrop={onDrop}
		>
			<label
				className="flex cursor-pointer flex-col items-center justify-center gap-2 px-6 py-10 text-center hover:bg-muted/30"
				htmlFor={inputId}
			>
				<div className="flex size-10 items-center justify-center rounded-full bg-muted">
					<ImageIcon className="size-5 text-muted-foreground" />
				</div>
				<div>
					<span className="font-medium text-primary text-sm">
						Click to upload
					</span>
					<span className="text-muted-foreground text-sm">
						{' '}
						or drag and drop
					</span>
				</div>
				<p className="text-muted-foreground text-xs">
					PNG, JPEG, WebP, GIF, or SVG — images only (Convex{' '}
					<code className="rounded bg-muted px-1 py-0.5 font-mono text-[11px]">
						_storage
					</code>
					).
				</p>
				<input
					accept="image/*"
					className="sr-only"
					id={inputId}
					multiple
					onChange={onInputChange}
					type="file"
				/>
			</label>
		</div>
	);
}

interface UploadTestFileRowProps {
	onRetry: (row: FileRow) => void;
	row: FileRow;
}

function UploadTestFileRow({ row, onRetry }: UploadTestFileRowProps) {
	const showProgress = row.phase === 'uploading' || row.phase === 'done';
	const progressValue = row.phase === 'done' ? 100 : row.progress;

	return (
		<li className="flex gap-3 rounded-lg border bg-background/80 p-3 shadow-xs/5">
			<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
				<ImageIcon className="size-5 text-muted-foreground" />
			</div>
			<div className="min-w-0 flex-1 space-y-2">
				<div className="flex flex-wrap items-baseline justify-between gap-2">
					<p className="truncate font-medium text-sm">{row.name}</p>
					<p className="shrink-0 text-muted-foreground text-xs">
						{formatBytes(row.byteLength)}
					</p>
				</div>

				{row.phase === 'error' ? (
					<div className="flex flex-wrap items-center gap-2">
						<p className="text-destructive text-xs">{row.errorMessage}</p>
						<Button
							className="h-7 gap-1 px-2 text-xs"
							onClick={() => onRetry(row)}
							size="sm"
							type="button"
							variant="outline"
						>
							<RefreshCw className="size-3.5" />
							Try again
						</Button>
					</div>
				) : (
					<div className="space-y-1">
						<div className="flex items-center justify-between gap-2 text-xs">
							<span className="text-muted-foreground">
								{phaseLabel(row.phase)}
							</span>
							{showProgress ? (
								<span className="tabular-nums">{row.progress}%</span>
							) : null}
						</div>
						<Progress
							aria-label={`Upload progress for ${row.name}`}
							value={progressValue}
						>
							<ProgressTrack>
								<ProgressIndicator
									style={{
										width: `${progressValue}%`,
									}}
								/>
							</ProgressTrack>
						</Progress>
					</div>
				)}

				{row.result?.url ? (
					<p className="break-all text-muted-foreground text-xs">
						<span className="font-medium text-foreground">URL: </span>
						{row.result.url}
					</p>
				) : null}
			</div>
		</li>
	);
}

export default function ImageUploadTest() {
	const inputId = useId();
	const generateUploadUrl = useMutation(
		api.uploadTest.generateUploadUrl.generateUploadUrl
	);
	const finalize = useMutation(api.uploadTest.finalize.finalize);
	const [rows, setRows] = useState<FileRow[]>([]);
	const [isDragging, setIsDragging] = useState(false);

	const uploadOne = useCallback(
		async (row: FileRow) => {
			setRows((prev) =>
				prev.map((r) =>
					r.id === row.id
						? {
								...r,
								phase: 'uploading' as const,
								progress: 0,
								errorMessage: undefined,
							}
						: r
				)
			);
			try {
				const postUrl = await generateUploadUrl({});
				const storageId = await new Promise<Id<'_storage'>>(
					(resolve, reject) => {
						const xhr = new XMLHttpRequest();
						xhr.open('POST', postUrl);
						xhr.setRequestHeader(
							'Content-Type',
							row.file.type || 'application/octet-stream'
						);
						xhr.upload.onprogress = (ev) => {
							if (!ev.lengthComputable) {
								return;
							}
							const pct = Math.round((ev.loaded / ev.total) * 100);
							setRows((prev) =>
								prev.map((r) => (r.id === row.id ? { ...r, progress: pct } : r))
							);
						};
						xhr.onload = () => {
							if (xhr.status >= 200 && xhr.status < 300) {
								try {
									const parsed: unknown = JSON.parse(xhr.responseText);
									const sid = readStorageId(parsed);
									if (!sid) {
										reject(new Error('Upload response missing storageId'));
										return;
									}
									resolve(sid);
								} catch {
									reject(new Error('Invalid upload response'));
								}
							} else {
								reject(new Error(`Upload failed (${xhr.status})`));
							}
						};
						xhr.onerror = () =>
							reject(new Error('Network error during upload'));
						xhr.send(row.file);
					}
				);

				setRows((prev) =>
					prev.map((r) =>
						r.id === row.id
							? { ...r, phase: 'finalizing' as const, progress: 100 }
							: r
					)
				);

				const finalized = await finalize({
					storageId,
					fileName: row.name,
					contentType: row.contentType,
					byteLength: row.byteLength,
				});

				const logPayload = {
					convexTable: 'uploadTestImages',
					documentId: finalized.documentId,
					storageId: finalized.storageId,
					url: finalized.url,
					fileName: finalized.fileName,
					contentType: finalized.contentType,
					byteLength: finalized.byteLength,
					note: 'Store `storageId` on your entity for stable references; use storage.getUrl(storageId) (or a query) when you need a download URL.',
				};
				console.log('[upload-test] Convex file details', logPayload);

				setRows((prev) =>
					prev.map((r) =>
						r.id === row.id
							? {
									...r,
									phase: 'done' as const,
									progress: 100,
									result: finalized,
								}
							: r
					)
				);
			} catch (e) {
				const message = e instanceof Error ? e.message : 'Upload failed';
				console.error('[upload-test]', e);
				setRows((prev) =>
					prev.map((r) =>
						r.id === row.id
							? { ...r, phase: 'error' as const, errorMessage: message }
							: r
					)
				);
			}
		},
		[finalize, generateUploadUrl]
	);

	const enqueueFiles = useCallback(
		(fileList: FileList | File[]) => {
			const files = Array.from(fileList).filter(isImageFile);
			const skipped = Array.from(fileList).filter((f) => !isImageFile(f));
			if (skipped.length) {
				console.warn(
					'[upload-test] Skipped non-image files',
					skipped.map((f) => f.name)
				);
			}
			if (!files.length) {
				return;
			}
			const newRows: FileRow[] = files.map((file) => ({
				id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
				file,
				name: file.name,
				contentType: file.type,
				byteLength: file.size,
				phase: 'idle' as const,
				progress: 0,
			}));
			setRows((prev) => [...prev, ...newRows]);
			for (const row of newRows) {
				uploadOne(row).catch(ignoreUploadPromiseError);
			}
		},
		[uploadOne]
	);

	const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) {
			enqueueFiles(e.target.files);
		}
		e.target.value = '';
	};

	const onDrop = (e: DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
		if (e.dataTransfer.files?.length) {
			enqueueFiles(e.dataTransfer.files);
		}
	};

	const retry = (row: FileRow) => {
		uploadOne({
			...row,
			phase: 'idle',
			progress: 0,
			errorMessage: undefined,
			result: undefined,
		}).catch(ignoreUploadPromiseError);
	};

	return (
		<div className="flex w-full flex-col">
			<PageHeading
				description="Convex file storage — open the browser console to see payloads you can mirror on your own entities."
				heading="Upload test"
				icon={Upload}
			/>
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
				<CardFrame>
					<Card>
						<CardFrameHeader>
							<CardFrameTitle>Image upload (Convex storage)</CardFrameTitle>
							<CardFrameDescription>
								Images only. After each upload completes, details are logged to
								the browser console for copy-paste while you wire real tables.
							</CardFrameDescription>
						</CardFrameHeader>
					</Card>
					<Card>
						<CardHeader className="border-b">
							<CardTitle>File upload</CardTitle>
						</CardHeader>
						<CardPanel>
							<ImageDropZone
								inputId={inputId}
								isDragging={isDragging}
								onDrop={onDrop}
								onInputChange={onInputChange}
								setIsDragging={setIsDragging}
							/>

							{rows.length > 0 && (
								<ul className="mt-6 flex flex-col gap-3">
									{rows.map((row) => (
										<UploadTestFileRow key={row.id} onRetry={retry} row={row} />
									))}
								</ul>
							)}
						</CardPanel>
					</Card>
				</CardFrame>
			</div>
		</div>
	);
}
