'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import {
	Card,
	CardAction,
	CardDescription,
	CardHeader,
	CardPanel,
	CardTitle,
} from '@workspace/ui/components/card';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check, ImagePlus, Info, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import {
	NoteImageUploader,
	type NoteImageUploaderHandle,
} from '@/components/notes/note-image-uploader';
import { NoteImagesRow } from '@/components/notes/note-images-row';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type QuotationNote = Doc<'projectQuotationNotes'>;

function ordinalSuffix(day: number): string {
	const mod100 = day % 100;
	if (mod100 >= 11 && mod100 <= 13) {
		return 'th';
	}
	switch (day % 10) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
}

function formatNoteDate(timestamp: number): string {
	const d = new Date(timestamp);
	const weekday = new Intl.DateTimeFormat('en-AU', { weekday: 'short' }).format(
		d
	);
	const day = d.getDate();
	const month = new Intl.DateTimeFormat('en-AU', { month: 'short' }).format(d);
	const year = d.getFullYear();
	return `${weekday}, ${day}${ordinalSuffix(day)} ${month} ${year}`;
}

function QuotationNotesCardList({ notes }: { notes: QuotationNote[] }) {
	const deleteNoteMutation = useMutation(
		api.projectQuotations.deleteNote.deleteNote
	);

	const onDelete = async (noteId: QuotationNote['_id']) => {
		try {
			await deleteNoteMutation({ noteId });
			toastManager.add({ title: 'Note deleted', type: 'success' });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not delete note. Please try again in a moment.'
				),
				title: 'Could not delete note',
				type: 'error',
			});
		}
	};

	return (
		<div className="flex flex-col gap-3">
			{notes.map((entry) => (
				<Card key={entry._id}>
					<CardHeader>
						<CardTitle>{entry.addedBy}</CardTitle>
						<CardDescription>{formatNoteDate(entry.timestamp)}</CardDescription>
						<CardAction>
							<Button
								aria-label="Delete note"
								onClick={() => {
									onDelete(entry._id).catch(() => {
										/* Error is handled in onDelete */
									});
								}}
								size="icon"
								type="button"
								variant="destructive-outline"
							>
								<Trash2 />
							</Button>
						</CardAction>
					</CardHeader>
					<CardPanel className="flex flex-col gap-3">
						<p className="whitespace-pre-wrap text-pretty text-sm leading-relaxed">
							{entry.note}
						</p>
						{entry.images && entry.images.length > 0 ? (
							<NoteImagesRow
								imageKeys={entry.images}
								title={`Note by ${entry.addedBy}`}
							/>
						) : null}
					</CardPanel>
				</Card>
			))}
		</div>
	);
}

export default function QuotationNotesDialog({
	quotationId,
	open,
	onOpenChange,
}: {
	quotationId: Id<'projectQuotations'>;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [images, setImages] = useState<string[]>([]);
	const [imagesUploading, setImagesUploading] = useState(false);
	const [uploaderKey, setUploaderKey] = useState(0);
	const uploaderRef = useRef<NoteImageUploaderHandle>(null);

	const resetForm = () => {
		setNoteText('');
		setImages([]);
		setImagesUploading(false);
		setUploaderKey((key) => key + 1);
	};

	const appendNoteMutation = useMutation(
		api.projectQuotations.appendNote.appendNote
	);
	const notes = useQuery(
		api.projectQuotations.listNotes.listNotes,
		open ? { quotationId } : 'skip'
	);

	const onSubmit = async () => {
		const trimmed = noteText.trim();
		if (trimmed === '') {
			toastManager.add({ title: 'Write a note before saving', type: 'error' });
			return;
		}
		setSubmitting(true);
		try {
			await appendNoteMutation({ quotationId, note: noteText, images });
			toastManager.add({ title: 'Note added', type: 'success' });
			resetForm();
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not add note. Please try again in a moment.'
				),
				title: 'Could not add note',
				type: 'error',
			});
		} finally {
			setSubmitting(false);
		}
	};

	let notesBody: ReactNode;
	if (notes === undefined) {
		notesBody = <p className="text-muted-foreground text-sm">Loading notes…</p>;
	} else if (notes.length === 0) {
		notesBody = (
			<Alert variant="info">
				<Info aria-hidden className="size-4 shrink-0" />
				<AlertDescription>
					No notes have been added for this quotation yet. Use the field above
					to add the first one.
				</AlertDescription>
			</Alert>
		);
	} else {
		notesBody = <QuotationNotesCardList notes={notes} />;
	}

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					resetForm();
				}
			}}
			open={open}
		>
			<DialogContent className="flex h-[min(88vh,44rem)] w-[min(92vw,40rem)] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none">
				<DialogHeader className="shrink-0 space-y-1.5 px-6 pt-6">
					<DialogTitle>Quotation Notes</DialogTitle>
				</DialogHeader>
				<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
					<div className="shrink-0 px-6 py-4">
						<div className="flex flex-col gap-2">
							<label
								className="font-medium text-sm"
								htmlFor={`note-${quotationId}`}
							>
								New note
							</label>
							<Textarea
								className="min-h-[100px] resize-y"
								id={`note-${quotationId}`}
								onChange={(e) => setNoteText(e.target.value)}
								placeholder="Type your note…"
								value={noteText}
							/>
							<NoteImageUploader
								key={uploaderKey}
								onChange={setImages}
								onUploadingChange={setImagesUploading}
								ref={uploaderRef}
							/>
						</div>
					</div>
					<div className="flex min-h-0 flex-1 flex-col overflow-hidden px-6 pb-2">
						<div className="min-h-0 flex-1 overflow-y-auto pe-1">
							{notesBody}
						</div>
					</div>
				</div>
				<DialogFooter className="shrink-0 border-t px-6 py-4">
					<DialogClose render={<Button type="button" variant="outline" />}>
						Close
					</DialogClose>
					<Button
						disabled={imagesUploading}
						loading={imagesUploading}
						onClick={() => uploaderRef.current?.open()}
						type="button"
						variant="outline"
					>
						<ImagePlus />
						Add image
					</Button>
					<Button
						disabled={imagesUploading}
						loading={submitting}
						onClick={() => {
							onSubmit().catch(() => {
								/* Error is handled in onSubmit */
							});
						}}
						type="button"
						variant="outline"
					>
						<Check aria-hidden /> Save note
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
