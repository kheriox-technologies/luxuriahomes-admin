'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
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
import { Check, ImagePlus } from 'lucide-react';
import { useRef, useState } from 'react';
import {
	NoteImageUploader,
	type NoteImageUploaderHandle,
} from '@/components/notes/note-image-uploader';
import { NoteTimelineBody } from '@/components/notes/note-timeline';
import { getConvexErrorMessage } from '@/lib/convex-errors';

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
	const deleteNoteMutation = useMutation(
		api.projectQuotations.deleteNote.deleteNote
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

	const onDelete = (noteId: Id<'projectQuotationNotes'>) => {
		deleteNoteMutation({ noteId })
			.then(() => {
				toastManager.add({ title: 'Note deleted', type: 'success' });
			})
			.catch((error: unknown) => {
				toastManager.add({
					description: getConvexErrorMessage(
						error,
						'Could not delete note. Please try again in a moment.'
					),
					title: 'Could not delete note',
					type: 'error',
				});
			});
	};

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
					<div className="flex items-center gap-2">
						<DialogTitle>Quotation Notes</DialogTitle>
						{notes && notes.length > 0 ? (
							<Badge variant="secondary">{notes.length}</Badge>
						) : null}
					</div>
				</DialogHeader>
				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
					<NoteTimelineBody
						emptyDescription="Add the first note using the field below."
						notes={notes}
						onDelete={onDelete}
					/>
				</div>
				{/* The composer is docked below the timeline so the newest notes stay
				    in view while you type. */}
				<div className="flex shrink-0 flex-col gap-2 border-t px-6 pt-4">
					<Textarea
						aria-label="New note"
						className="min-h-20 resize-y"
						id={`note-${quotationId}`}
						onChange={(e) => setNoteText(e.target.value)}
						placeholder="Add a note…"
						value={noteText}
					/>
					<NoteImageUploader
						key={uploaderKey}
						onChange={setImages}
						onUploadingChange={setImagesUploading}
						ref={uploaderRef}
					/>
				</div>
				<DialogFooter className="shrink-0 px-6 py-4">
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
