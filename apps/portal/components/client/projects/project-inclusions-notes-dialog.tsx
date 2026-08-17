'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { ImagePlus, Plus, X } from 'lucide-react';
import { useRef, useState } from 'react';
import {
	NoteImageUploader,
	type NoteImageUploaderHandle,
} from '@/components/client/notes/note-image-uploader';
import { NoteTimelineBody } from '@/components/notes/note-timeline';
import { getConvexErrorMessage } from '@/lib/convex-errors';

export default function ProjectInclusionNotesDialog({
	projectId,
	inclusionId,
	inclusionTitle,
	open,
	onOpenChange,
}: {
	projectId: Id<'projects'>;
	inclusionId: Id<'projectInclusions'>;
	inclusionTitle: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const notes = useQuery(
		api.clientPortal.inclusions.listNotes.listNotes,
		open ? { projectInclusionId: inclusionId } : 'skip'
	);
	const appendNote = useMutation(
		api.clientPortal.inclusions.appendNote.appendNote
	);
	const deleteNote = useMutation(
		api.clientPortal.inclusions.deleteNote.deleteNote
	);
	const [noteText, setNoteText] = useState('');
	const [saving, setSaving] = useState(false);
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

	const onAdd = async () => {
		const trimmed = noteText.trim();
		if (trimmed === '') {
			return;
		}
		setSaving(true);
		try {
			await appendNote({
				projectInclusionId: inclusionId,
				note: trimmed,
				images,
			});
			resetForm();
		} catch (error) {
			toastManager.add({
				title: 'Could not add note',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		} finally {
			setSaving(false);
		}
	};

	const onDelete = (noteId: Id<'projectInclusionNotes'>) => {
		deleteNote({ noteId }).catch((error: unknown) => {
			toastManager.add({
				title: 'Could not delete note',
				description: getConvexErrorMessage(error, 'Please try again.'),
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
			<DialogContent className="sm:max-w-lg">
				<DialogHeader>
					<DialogTitle>Notes</DialogTitle>
					<DialogDescription>{inclusionTitle}</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="max-h-72 overflow-y-auto pe-1">
						<NoteTimelineBody
							emptyDescription="Add the first note using the field below."
							notes={notes}
							onDelete={onDelete}
						/>
					</div>
					{/* The composer is docked below the timeline so the newest notes
					    stay in view while you type. */}
					<div className="flex flex-col gap-2 border-t pt-4">
						<Textarea
							aria-label="New note"
							className="min-h-20 resize-y"
							onChange={(e) => setNoteText(e.target.value)}
							placeholder="Add a note…"
							value={noteText}
						/>
						<NoteImageUploader
							key={uploaderKey}
							onChange={setImages}
							onUploadingChange={setImagesUploading}
							projectId={projectId}
							ref={uploaderRef}
						/>
						<div className="flex justify-end gap-2">
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
								disabled={saving || imagesUploading || noteText.trim() === ''}
								onClick={() => onAdd().catch(() => undefined)}
								type="button"
								variant="outline"
							>
								<Plus aria-hidden /> Add note
							</Button>
						</div>
					</div>
				</div>
				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								<X aria-hidden /> Close
							</Button>
						}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
