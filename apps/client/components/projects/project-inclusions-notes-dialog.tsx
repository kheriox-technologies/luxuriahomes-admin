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
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
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
	inclusionId,
	inclusionTitle,
	open,
	onOpenChange,
}: {
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

	const onAdd = async () => {
		const trimmed = noteText.trim();
		if (trimmed === '') {
			return;
		}
		setSaving(true);
		try {
			await appendNote({ projectInclusionId: inclusionId, note: trimmed });
			setNoteText('');
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
		<Dialog onOpenChange={onOpenChange} open={open}>
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
						<div className="flex justify-end">
							<Button
								disabled={saving || noteText.trim() === ''}
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
