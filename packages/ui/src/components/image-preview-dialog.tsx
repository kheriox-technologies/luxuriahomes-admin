"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";

interface ImagePreviewThumbnailProps {
  /** CDN-signed URL for the image. */
  signedUrl: string;
  /** Accessible alt text for the image. */
  alt: string;
  /** Title shown in the full-image dialog header. */
  title: string;
  /** Thumbnail edge length in pixels. Defaults to 60. */
  size?: number;
}

/**
 * Renders a small image thumbnail that opens the full-size image in a dialog
 * when clicked. Mirrors the zoom pattern used in the inclusions table.
 */
export function ImagePreviewThumbnail({
  signedUrl,
  alt,
  title,
  size = 60,
}: ImagePreviewThumbnailProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            aria-label={`Open image preview for ${title}`}
            className="flex cursor-zoom-in items-center justify-center rounded-md border bg-card p-1"
            style={{ height: size, width: size }}
            type="button"
          />
        }
      >
        {/* biome-ignore lint/nursery/noImgElement: packages/ui has no next/image dependency */}
        <img
          alt={alt}
          className="size-full object-contain"
          src={signedUrl}
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[75vh] items-center justify-center overflow-hidden rounded-md bg-card p-2">
          {/* biome-ignore lint/nursery/noImgElement: packages/ui has no next/image dependency */}
          <img
            alt={alt}
            className="h-auto max-h-[70vh] w-auto max-w-full object-contain"
            src={signedUrl}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
