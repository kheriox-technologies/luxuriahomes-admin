'use client';

import { ImagePreviewThumbnail } from '@workspace/ui/components/image-preview-dialog';
import { useEffect, useState } from 'react';
import { signCdnUrls } from '@/actions/cdn';

/**
 * Displays a note's attached images as thumbnails. Each thumbnail opens the
 * full-size image in a dialog. Signed CDN URLs are resolved on mount.
 */
export function NoteImagesRow({
	imageKeys,
	title,
}: {
	imageKeys: string[];
	title: string;
}) {
	const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

	useEffect(() => {
		if (imageKeys.length === 0) {
			return;
		}
		signCdnUrls(imageKeys)
			.then(setSignedUrls)
			.catch(() => {
				/* thumbnails show as loading if signing fails */
			});
	}, [imageKeys]);

	if (imageKeys.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap gap-2">
			{imageKeys.map((key) => {
				const signedUrl = signedUrls[key];
				if (!signedUrl) {
					return (
						<div
							className="flex size-[60px] items-center justify-center rounded-md border bg-card text-muted-foreground text-xs"
							key={key}
						>
							…
						</div>
					);
				}
				return (
					<ImagePreviewThumbnail
						alt={title}
						key={key}
						signedUrl={signedUrl}
						title={title}
					/>
				);
			})}
		</div>
	);
}
