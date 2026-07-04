'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { toastManager } from '@workspace/ui/components/toast';
import { useAction } from 'convex/react';
import { X } from 'lucide-react';
import NextImage from 'next/image';
import {
	type Ref,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

interface PendingImage {
	key: string;
	previewUrl: string;
}

export interface NoteImageUploaderHandle {
	open: () => void;
}

const THUMB_SIZE = 64;

/**
 * Lets the user attach images to a note. Uploads each selected file to S3 via
 * the admin image upload action and reports the resulting S3 keys to the parent
 * through `onChange`. Renders only the selected-image previews; call `open()` on
 * the ref to launch the file picker. Remount with a fresh `key` to reset.
 *
 * Pass `projectId` for inclusion notes so images are stored under the shared
 * project-scoped key (`projects/{id}/inclusion-notes/…`), matching the mobile
 * and client-portal upload paths. Without it, images go to the generic
 * `images/inclusions/…` store (tasks, quotations, orders).
 */
export function NoteImageUploader({
	ref,
	projectId,
	onChange,
	onUploadingChange,
	disabled,
}: {
	ref?: Ref<NoteImageUploaderHandle>;
	projectId?: Id<'projects'>;
	onChange: (keys: string[]) => void;
	onUploadingChange?: (uploading: boolean) => void;
	disabled?: boolean;
}) {
	const generateGenericUploadUrl = useAction(
		api.fileStorage.generateS3UploadUrl.generateS3UploadUrl
	);
	const generateInclusionUploadUrl = useAction(
		api.projectInclusions.generateNoteImageUploadUrl.generateNoteImageUploadUrl
	);
	const [images, setImages] = useState<PendingImage[]>([]);
	const [uploadingCount, setUploadingCount] = useState(0);
	const inputRef = useRef<HTMLInputElement>(null);

	useImperativeHandle(
		ref,
		() => ({ open: () => inputRef.current?.click() }),
		[]
	);

	useEffect(() => {
		onUploadingChange?.(uploadingCount > 0);
	}, [uploadingCount, onUploadingChange]);

	// Revoke any outstanding object URLs when the component unmounts.
	const imagesRef = useRef<PendingImage[]>([]);
	imagesRef.current = images;
	useEffect(
		() => () => {
			for (const img of imagesRef.current) {
				URL.revokeObjectURL(img.previewUrl);
			}
		},
		[]
	);

	const uploadOne = async (file: File): Promise<PendingImage | null> => {
		const previewUrl = URL.createObjectURL(file);
		try {
			const ext = file.name.split('.').pop() ?? 'jpg';
			const contentType = file.type || 'application/octet-stream';
			const { uploadUrl, s3Key } = projectId
				? await generateInclusionUploadUrl({ projectId, contentType, ext })
				: await generateGenericUploadUrl({ contentType, ext });
			const response = await fetch(uploadUrl, {
				method: 'PUT',
				headers: { 'Content-Type': contentType },
				body: file,
			});
			if (!response.ok) {
				throw new Error('Upload failed');
			}
			return { key: s3Key, previewUrl };
		} catch (error) {
			URL.revokeObjectURL(previewUrl);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not upload image. Please try again in a moment.'
				),
				title: 'Image upload failed',
				type: 'error',
			});
			return null;
		}
	};

	const onFilesSelected = async (files: FileList) => {
		const picked = Array.from(files).filter((file) =>
			file.type.startsWith('image/')
		);
		if (picked.length === 0) {
			return;
		}
		setUploadingCount((count) => count + picked.length);
		try {
			const results = await Promise.all(picked.map((file) => uploadOne(file)));
			const uploaded = results.filter((item): item is PendingImage =>
				Boolean(item)
			);
			if (uploaded.length > 0) {
				setImages((prev) => {
					const next = [...prev, ...uploaded];
					onChange(next.map((img) => img.key));
					return next;
				});
			}
		} finally {
			setUploadingCount((count) => Math.max(0, count - picked.length));
		}
	};

	const onRemove = (key: string) => {
		setImages((prev) => {
			const target = prev.find((img) => img.key === key);
			if (target) {
				URL.revokeObjectURL(target.previewUrl);
			}
			const next = prev.filter((img) => img.key !== key);
			onChange(next.map((img) => img.key));
			return next;
		});
	};

	return (
		<>
			<input
				accept="image/*"
				className="hidden"
				disabled={disabled}
				multiple
				onChange={(e) => {
					if (e.target.files) {
						onFilesSelected(e.target.files).catch(() => {
							/* errors are surfaced per-file via toast */
						});
					}
					e.target.value = '';
				}}
				ref={inputRef}
				type="file"
			/>
			{images.length > 0 ? (
				<div className="flex flex-wrap items-center gap-2">
					{images.map((img) => (
						<div
							className="relative overflow-hidden rounded-md border bg-card"
							key={img.key}
							style={{ height: THUMB_SIZE, width: THUMB_SIZE }}
						>
							<NextImage
								alt="Note attachment"
								className="size-full object-contain"
								height={THUMB_SIZE}
								src={img.previewUrl}
								unoptimized
								width={THUMB_SIZE}
							/>
							<button
								aria-label="Remove image"
								className="absolute end-0.5 top-0.5 rounded-full bg-background/80 p-0.5 text-foreground opacity-80 hover:opacity-100"
								onClick={() => onRemove(img.key)}
								type="button"
							>
								<X className="size-3.5" />
							</button>
						</div>
					))}
				</div>
			) : null}
		</>
	);
}
