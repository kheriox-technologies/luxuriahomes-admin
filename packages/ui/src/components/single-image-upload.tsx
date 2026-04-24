"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@workspace/ui/components/field";
import { cn } from "@workspace/ui/lib/utils";
import { FileImage, Trash2, Upload, X } from "lucide-react";
import {
  type ChangeEvent,
  type DragEvent,
  useCallback,
  useRef,
  useState,
} from "react";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) {
    return true;
  }
  const lower = file.name.toLowerCase();
  return /\.(png|jpe?g|gif|webp|svg|avif|heic|heif)$/.test(lower);
}

interface SingleImageUploadProps {
  id: string;
  label: string;
  disabled?: boolean;
  uploading?: boolean;
  imageUrl?: string;
  onFileSelected: (file: File) => void | Promise<void>;
  /** Remove preview, clear form fields, and delete storage (parent may async). */
  onClear?: () => void | Promise<void>;
  /** Shown under the drop zone (e.g. accepted types). */
  description?: string;
}

export function SingleImageUpload({
  id,
  label,
  disabled = false,
  uploading = false,
  imageUrl,
  onFileSelected,
  onClear,
  description = "PNG, JPG, WebP or GIF (one image per variant).",
}: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(
    null,
  );
  const [isRemoving, setIsRemoving] = useState(false);

  const trimmedUrl = imageUrl?.trim() ?? "";
  const hasUploadedPreview = Boolean(trimmedUrl) && !uploading;

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (!file || disabled || uploading) {
        return;
      }
      if (!isImageFile(file)) {
        return;
      }
      setFileMeta({ name: file.name, size: file.size });
      onFileSelected(file);
    },
    [disabled, onFileSelected, uploading],
  );

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleFile(file);
    event.target.value = "";
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled && !uploading && !hasUploadedPreview) {
      setIsDragging(true);
    }
  };

  const onDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (hasUploadedPreview) {
      return;
    }
    const file = event.dataTransfer.files?.[0];
    handleFile(file);
  };

  const showProgressRow = Boolean(fileMeta && (uploading || !trimmedUrl));

  const dismissDraftFile = () => {
    setFileMeta(null);
  };

  const handleDeleteUploaded = async () => {
    if (!onClear || isRemoving || disabled) {
      return;
    }
    setIsRemoving(true);
    try {
      await Promise.resolve(onClear());
      setFileMeta(null);
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <Field className="w-full min-w-0 items-stretch">
      <FieldLabel htmlFor={id}>{label}</FieldLabel>

      {hasUploadedPreview ? (
        <div className="relative w-full min-w-0">
          <img
            alt=""
            className="block h-auto max-h-64 w-full min-w-0 object-contain"
            src={trimmedUrl}
          />
          <Button
            aria-label="Delete image"
            className="absolute top-2 right-2 shadow-md"
            disabled={disabled || isRemoving}
            loading={isRemoving}
            onClick={() => {
              handleDeleteUploaded().catch(() => {
                /* Parent handles errors */
              });
            }}
            size="icon"
            type="button"
            variant="destructive"
          >
            <Trash2 />
          </Button>
          {fileMeta ? (
            <p className="mt-1.5 truncate text-muted-foreground text-xs">
              {fileMeta.name} · {formatFileSize(fileMeta.size)}
            </p>
          ) : null}
        </div>
      ) : (
        <>
          <div
            className={cn(
              "relative w-full min-w-0 rounded-xl border-2 border-dashed border-input bg-muted/32 px-4 py-8 transition-colors",
              isDragging && "border-primary bg-primary/8",
              (disabled || uploading) && "pointer-events-none opacity-64",
            )}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
          >
            <input
              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,image/svg+xml,.png,.jpg,.jpeg,.webp,.gif,.svg"
              aria-label={label}
              className="sr-only"
              disabled={disabled || uploading}
              id={id}
              onChange={onInputChange}
              ref={inputRef}
              type="file"
            />
            <label
              className="flex w-full min-w-0 cursor-pointer flex-col items-center justify-center gap-1 text-center"
              htmlFor={id}
            >
              <span className="flex size-10 items-center justify-center rounded-lg border border-input bg-background shadow-xs/5">
                <Upload aria-hidden className="size-5 text-muted-foreground" />
              </span>
              <p className="mt-1 font-medium text-foreground text-sm">
                <span className="text-primary">Click to upload</span>
                <span className="text-muted-foreground"> or drag and drop</span>
              </p>
            </label>
            <FieldDescription className="mt-1 w-full text-center">
              {description}
            </FieldDescription>
          </div>

          {showProgressRow ? (
            <ul className="mt-3 flex w-full min-w-0 flex-col gap-2" role="list">
              <li
                className="flex w-full min-w-0 gap-3 rounded-lg border border-input bg-background px-3 py-2.5 shadow-xs/5"
                role="listitem"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-input bg-muted/48">
                  <FileImage aria-hidden className="size-4 text-muted-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground text-sm">
                        {fileMeta?.name ?? ""}
                      </p>
                      {fileMeta ? (
                        <p className="text-muted-foreground text-xs">
                          {formatFileSize(fileMeta.size)}
                        </p>
                      ) : null}
                    </div>
                    {onClear && !uploading && !trimmedUrl && fileMeta ? (
                      <button
                        aria-label="Remove file"
                        className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        disabled={disabled}
                        onClick={(event) => {
                          event.preventDefault();
                          dismissDraftFile();
                        }}
                        type="button"
                      >
                        <X className="size-4" />
                      </button>
                    ) : null}
                  </div>

                  <div className="mt-2.5 space-y-1">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full bg-primary transition-all duration-500",
                          uploading ? "w-[55%] animate-pulse" : "w-full",
                        )}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      {uploading ? (
                        <span className="text-muted-foreground">Uploading…</span>
                      ) : trimmedUrl ? (
                        <span className="text-muted-foreground">Complete</span>
                      ) : (
                        <span className="text-muted-foreground">Ready to upload</span>
                      )}
                      {!uploading && trimmedUrl ? (
                        <span className="tabular-nums text-muted-foreground">
                          100%
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {!uploading && !trimmedUrl && fileMeta ? (
                    <button
                      className="mt-2 font-medium text-primary text-xs underline underline-offset-2"
                      disabled={disabled}
                      onClick={() => inputRef.current?.click()}
                      type="button"
                    >
                      Try again
                    </button>
                  ) : null}
                </div>
              </li>
            </ul>
          ) : null}
        </>
      )}
    </Field>
  );
}
