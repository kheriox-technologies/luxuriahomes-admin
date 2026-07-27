'use client';

import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import { Calendar } from '@workspace/ui/components/calendar';
import { Field, FieldError, FieldLabel } from '@workspace/ui/components/field';
import { Input } from '@workspace/ui/components/input';
import {
	Popover,
	PopoverPopup,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { toastManager } from '@workspace/ui/components/toast';
import { cn } from '@workspace/ui/lib/utils';
import { useAction, useMutation } from 'convex/react';
import { CalendarIcon, Loader2, Save } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import RichTextEditor from '@/components/rich-text-editor';
import { usePdfDocument } from '@/components/takeoffs/use-pdf-document';
import { buildLetterPdfBlob } from '@/lib/client/pdf/letter-pdf';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import LetterLocationField, {
	type LetterDestination,
} from './letter-location-field';
import LetterRecipientsField, {
	type LetterRecipientValue,
} from './letter-recipients-field';

const PREVIEW_DEBOUNCE_MS = 500;
const PREVIEW_RENDER_WIDTH = 820;
const EMPTY_EDITOR_HTML = '<p></p>';
const DEFAULT_FROM_HTML = '<p>Kind Regards,</p><p>Luxuria Homes</p>';
const PDF_CONTENT_TYPE = 'application/pdf';

// Handoff key for "Create New Letter": the source letter's HTML is stashed here
// before navigating to the composer, then read once and cleared.
export const LETTER_PREFILL_STORAGE_KEY = 'letter-composer-prefill-content';

function formatDateLabel(date: Date): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}).format(date);
}

function isContentEmpty(html: string): boolean {
	const stripped = html.replace(/<[^>]*>/g, '').replace(/\s|&nbsp;/g, '');
	return stripped.length === 0;
}

// Documents view URL for a destination — used both for the back arrow (origin)
// and post-save navigation (chosen location).
function documentsHref(destination: LetterDestination): string {
	if (destination.scope === 'company') {
		return destination.folderPath
			? `/documents?folder=${encodeURIComponent(destination.folderPath)}`
			: '/documents';
	}
	const params = new URLSearchParams({ tab: 'documents' });
	if (destination.folderPath) {
		params.set('folder', destination.folderPath);
	}
	return `/projects/${destination.projectId}?${params.toString()}`;
}

export interface LetterComposerProps {
	defaultDestination: LetterDestination;
	// When true, prefill the editor content from sessionStorage ("Create New Letter").
	prefill?: boolean;
}

export default function LetterComposer({
	defaultDestination,
	prefill,
}: LetterComposerProps) {
	const router = useRouter();

	const companyGenerate = useAction(
		api.companyDocuments.generateUploadUrl.generateUploadUrl
	);
	const companyCreate = useMutation(api.companyDocuments.create.create);
	const projectGenerate = useAction(
		api.projectDocuments.generateUploadUrl.generateUploadUrl
	);
	const projectCreate = useMutation(api.projectDocuments.create.create);

	// Read (and clear) the prefill content stashed by "Create New Letter" once.
	const [initialContentHtml] = useState(() => {
		if (!(prefill && typeof window !== 'undefined')) {
			return;
		}
		const stored = sessionStorage.getItem(LETTER_PREFILL_STORAGE_KEY);
		sessionStorage.removeItem(LETTER_PREFILL_STORAGE_KEY);
		return stored ?? undefined;
	});

	const [name, setName] = useState('');
	const [date, setDate] = useState<Date>(() => new Date());
	const [dateOpen, setDateOpen] = useState(false);
	const [destination, setDestination] =
		useState<LetterDestination>(defaultDestination);
	const [recipients, setRecipients] = useState<LetterRecipientValue[]>([]);
	const [contentHtml, setContentHtml] = useState(
		initialContentHtml || EMPTY_EDITOR_HTML
	);
	const [fromHtml, setFromHtml] = useState(DEFAULT_FROM_HTML);
	const [nameTouched, setNameTouched] = useState(false);
	const [saving, setSaving] = useState(false);

	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewError, setPreviewError] = useState<string | null>(null);
	const [previewLoading, setPreviewLoading] = useState(false);

	const dateLabel = useMemo(() => formatDateLabel(date), [date]);
	const contentEmpty = isContentEmpty(contentHtml);
	const nameEmpty = name.trim() === '';

	const backHref = documentsHref(defaultDestination);

	// Regenerate the preview PDF (debounced) whenever any field changes.
	useEffect(() => {
		let cancelled = false;
		const handle = setTimeout(() => {
			setPreviewLoading(true);
			buildLetterPdfBlob({
				contentHtml,
				fromHtml,
				dateLabel,
				recipients: recipients.map((recipient) => ({
					name: recipient.name,
					company: recipient.company,
				})),
			})
				.then((blob) => {
					if (cancelled) {
						return;
					}
					setPreviewUrl(URL.createObjectURL(blob));
					setPreviewError(null);
				})
				.catch((error: unknown) => {
					if (cancelled) {
						return;
					}
					setPreviewError(
						error instanceof Error ? error.message : 'Could not render preview.'
					);
				})
				.finally(() => {
					if (!cancelled) {
						setPreviewLoading(false);
					}
				});
		}, PREVIEW_DEBOUNCE_MS);
		return () => {
			cancelled = true;
			clearTimeout(handle);
		};
	}, [contentHtml, fromHtml, dateLabel, recipients]);

	// Revoke the previous blob URL when it is replaced or on unmount.
	useEffect(() => {
		if (!previewUrl) {
			return;
		}
		return () => URL.revokeObjectURL(previewUrl);
	}, [previewUrl]);

	const canSave = !(nameEmpty || contentEmpty || saving);

	const handleSave = async () => {
		if (!canSave) {
			return;
		}
		setSaving(true);
		try {
			const blob = await buildLetterPdfBlob({
				contentHtml,
				fromHtml,
				dateLabel,
				recipients: recipients.map((recipient) => ({
					name: recipient.name,
					company: recipient.company,
				})),
			});
			const fileName = `${name.trim()}.pdf`;
			const generated =
				destination.scope === 'company'
					? await companyGenerate({
							folderPath: destination.folderPath,
							fileName,
							contentType: PDF_CONTENT_TYPE,
						})
					: await projectGenerate({
							projectId: destination.projectId,
							folderPath: destination.folderPath,
							fileName,
							contentType: PDF_CONTENT_TYPE,
						});
			const putResponse = await fetch(generated.uploadUrl, {
				method: 'PUT',
				body: blob,
				headers: { 'Content-Type': PDF_CONTENT_TYPE },
			});
			if (!putResponse.ok) {
				throw new Error('Upload failed. Please try again.');
			}
			const createArgs = {
				folderPath: destination.folderPath,
				kebabName: generated.kebabName,
				name: fileName,
				s3Key: generated.s3Key,
				size: blob.size,
				mimeType: PDF_CONTENT_TYPE,
				letterContentHtml: contentHtml,
			};
			if (destination.scope === 'company') {
				await companyCreate(createArgs);
			} else {
				await projectCreate({
					...createArgs,
					projectId: destination.projectId,
				});
			}
			toastManager.add({ title: 'Letter saved', type: 'success' });
			router.push(documentsHref(destination) as Route);
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not save the letter. Please try again in a moment.'
				),
				title: 'Could not save letter',
				type: 'error',
			});
			setSaving(false);
		}
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				backLink={backHref}
				heading="Add Letter"
				rightSlot={
					<Button
						disabled={!canSave}
						loading={saving}
						onClick={() => {
							handleSave().catch(() => {
								/* handled in handleSave */
							});
						}}
						type="button"
						variant="outline"
					>
						<Save aria-hidden /> Save letter
					</Button>
				}
			/>

			<div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
				{/* Form */}
				<ScrollArea className="min-h-0">
					<div className="flex flex-col gap-5 pe-3 pb-4">
						<div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
							<Field>
								<FieldLabel htmlFor="letter-name">Name</FieldLabel>
								<Input
									aria-invalid={nameTouched && nameEmpty}
									id="letter-name"
									nativeInput
									onBlur={() => setNameTouched(true)}
									onChange={(event) => setName(event.target.value)}
									placeholder="e.g. Variation approval letter"
									value={name}
								/>
								{nameTouched && nameEmpty ? (
									<FieldError>A document name is required.</FieldError>
								) : null}
							</Field>

							<Field>
								<FieldLabel htmlFor="letter-date">Date</FieldLabel>
								<Popover onOpenChange={setDateOpen} open={dateOpen}>
									<PopoverTrigger
										render={
											<Button
												className="w-full justify-start font-normal sm:w-auto"
												id="letter-date"
												type="button"
												variant="outline"
											/>
										}
									>
										<CalendarIcon
											aria-hidden
											className="mr-2 size-4 opacity-60"
										/>
										{dateLabel}
									</PopoverTrigger>
									<PopoverPopup align="start" side="bottom">
										<Calendar
											captionLayout="dropdown"
											mode="single"
											onSelect={(next) => {
												if (next) {
													setDate(next);
													setDateOpen(false);
												}
											}}
											required
											selected={date}
										/>
									</PopoverPopup>
								</Popover>
							</Field>
						</div>

						<Field>
							<FieldLabel>Location</FieldLabel>
							<LetterLocationField
								onChange={setDestination}
								value={destination}
							/>
						</Field>

						<Field>
							<FieldLabel>To</FieldLabel>
							<LetterRecipientsField
								onChange={setRecipients}
								value={recipients}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="letter-content">Content</FieldLabel>
							<RichTextEditor
								editorClassName="min-h-64"
								id="letter-content"
								onChange={setContentHtml}
								placeholder="Compose your letter…"
								value={contentHtml}
							/>
						</Field>

						<Field>
							<FieldLabel htmlFor="letter-from">From</FieldLabel>
							<RichTextEditor
								editorClassName="min-h-24"
								id="letter-from"
								onChange={setFromHtml}
								placeholder="Kind Regards,…"
								value={fromHtml}
							/>
						</Field>
					</div>
				</ScrollArea>

				{/* Preview */}
				<div className="flex min-h-0 flex-col rounded-lg border bg-muted/30">
					<div className="flex items-center justify-between border-b px-4 py-2">
						<span className="font-medium text-sm">Preview</span>
						{previewLoading ? (
							<span className="flex items-center gap-1.5 text-muted-foreground text-xs">
								<Loader2 className="size-3.5 animate-spin" /> Updating…
							</span>
						) : null}
					</div>
					<div className="min-h-0 flex-1">
						{renderPreviewBody(previewError, previewUrl)}
					</div>
				</div>
			</div>
		</div>
	);
}

function renderPreviewBody(
	previewError: string | null,
	previewUrl: string | null
) {
	if (previewError) {
		return <div className="p-4 text-destructive text-sm">{previewError}</div>;
	}
	if (!previewUrl) {
		return (
			<div className="p-4 text-muted-foreground text-sm">
				Preview will appear here.
			</div>
		);
	}
	return <LetterPreview url={previewUrl} />;
}

function LetterPreview({ url }: { url: string }) {
	const { numPages, renderThumbnail, ready, error } = usePdfDocument(url);
	const canvasRefs = useRef<Map<number, HTMLCanvasElement>>(new Map());

	useEffect(() => {
		if (!ready || numPages === 0) {
			return;
		}
		let cancelled = false;
		(async () => {
			for (let page = 1; page <= numPages; page++) {
				if (cancelled) {
					return;
				}
				const canvas = canvasRefs.current.get(page);
				if (canvas) {
					await renderThumbnail(page, canvas, PREVIEW_RENDER_WIDTH);
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [ready, numPages, renderThumbnail]);

	if (error) {
		return <div className="p-4 text-destructive text-sm">{error}</div>;
	}

	return (
		<ScrollArea className="h-full">
			<div className="flex flex-col items-center gap-4 p-4">
				{Array.from(
					{ length: Math.max(numPages, 1) },
					(_, index) => index + 1
				).map((page) => (
					<canvas
						className={cn(
							'h-auto w-full max-w-[820px] rounded-sm border bg-white shadow-sm'
						)}
						key={page}
						ref={(element) => {
							if (element) {
								canvasRefs.current.set(page, element);
							} else {
								canvasRefs.current.delete(page);
							}
						}}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
