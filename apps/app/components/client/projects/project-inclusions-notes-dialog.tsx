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
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useRef, useState } from 'react';
import {
	NoteImageUploader,
	type NoteImageUploaderHandle,
} from '@/components/client/notes/note-image-uploader';
import { NoteImagesRow } from '@/components/client/notes/note-images-row';
import { getConvexErrorMessage } from '@/lib/convex-errors';

function formatNoteDate(timestamp: number): string {
	return new Intl.DateTimeFormat('en-AU', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	}).format(new Date(timestamp));
}

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
			setNoteText('');
			setImages([]);
			setImagesUploading(false);
			setUploaderKey((key) => key + 1);
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

	const onDelete = async (noteId: Id<'projectInclusionNotes'>) => {
		try {
			await deleteNote({ noteId });
		} catch (error) {
			toastManager.add({
				title: 'Could not delete note',
				description: getConvexErrorMessage(error, 'Please try again.'),
				type: 'error',
			});
		}
	};

	return (
		<Dialog
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					setNoteText('');
					setImages([]);
					setImagesUploading(false);
					setUploaderKey((key) => key + 1);
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
					<div className="flex flex-col gap-2">
						<textarea
							className="min-h-20 w-full rounded-md border bg-background p-2 text-sm"
							onChange={(e) => setNoteText(e.target.value)}
							placeholder="Type your note…"
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
							>
								Add note
							</Button>
						</div>
					</div>
					<div className="flex max-h-72 flex-col gap-2 overflow-y-auto">
						{notes === undefined ? (
							<p className="text-muted-foreground text-sm">Loading notes…</p>
						) : null}
						{notes && notes.length === 0 ? (
							<p className="text-muted-foreground text-sm">No notes yet.</p>
						) : null}
						{notes?.map((note) => (
							<div
								className="flex items-start justify-between gap-2 rounded-md border p-3"
								key={note._id}
							>
								<div className="min-w-0">
									<p className="font-medium text-sm">{note.addedBy}</p>
									<p className="text-muted-foreground text-xs">
										{formatNoteDate(note.timestamp)}
									</p>
									<p className="mt-1 whitespace-pre-wrap text-sm">
										{note.note}
									</p>
									{note.images && note.images.length > 0 ? (
										<div className="mt-2">
											<NoteImagesRow
												imageKeys={note.images}
												title={`Note by ${note.addedBy}`}
											/>
										</div>
									) : null}
								</div>
								<Button
									aria-label="Delete note"
									onClick={() => onDelete(note._id).catch(() => undefined)}
									size="icon-sm"
									type="button"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						))}
					</div>
				</div>
				<DialogFooter>
					<DialogClose
						render={
							<Button type="button" variant="outline">
								Close
							</Button>
						}
					/>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
