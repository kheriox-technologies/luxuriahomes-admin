'use client';

import { useUser } from '@clerk/nextjs';
import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetPanel,
	SheetTitle,
} from '@workspace/ui/components/sheet';
import { Textarea } from '@workspace/ui/components/textarea';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { NoteTimelineBody } from '@/components/notes/note-timeline';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import type { QuotationSurface } from './quotation-surface';

export default function ClientQuotationNotesSheet({
	quotationId,
	reference,
	projectName,
	open,
	onOpenChange,
	surface = 'admin',
}: {
	quotationId: Id<'clientQuotations'>;
	reference: string;
	projectName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	surface?: QuotationSurface;
}) {
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const isClient = surface === 'client';
	const currentUserId = useUser().user?.id;

	const adminAppendNote = useMutation(
		api.clientQuotations.appendNote.appendNote
	);
	const clientAppendNote = useMutation(
		api.clientPortal.quotations.appendNote.appendNote
	);
	const adminDeleteNote = useMutation(
		api.clientQuotations.deleteNote.deleteNote
	);
	const clientDeleteNote = useMutation(
		api.clientPortal.quotations.deleteNote.deleteNote
	);
	const appendNoteMutation = isClient ? clientAppendNote : adminAppendNote;
	const deleteNoteMutation = isClient ? clientDeleteNote : adminDeleteNote;

	const adminNotes = useQuery(
		api.clientQuotations.listNotes.listNotes,
		open && !isClient ? { quotationId } : 'skip'
	);
	const clientNotes = useQuery(
		api.clientPortal.quotations.listNotes.listNotes,
		open && isClient ? { quotationId } : 'skip'
	);
	const notes = isClient ? clientNotes : adminNotes;

	const onSubmit = async () => {
		if (noteText.trim() === '') {
			toastManager.add({ title: 'Write a note before saving', type: 'error' });
			return;
		}
		setSubmitting(true);
		try {
			await appendNoteMutation({ note: noteText, quotationId });
			toastManager.add({ title: 'Note added', type: 'success' });
			setNoteText('');
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

	const onDelete = (noteId: Id<'clientQuotationNotes'>) => {
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
		<Sheet
			onOpenChange={(next) => {
				onOpenChange(next);
				if (!next) {
					setNoteText('');
				}
			}}
			open={open}
		>
			<SheetContent
				className="flex max-h-full min-w-0 flex-col p-0"
				side="right"
			>
				<SheetHeader>
					<div className="flex items-center gap-2">
						<SheetTitle>Notes</SheetTitle>
						{notes && notes.length > 0 ? (
							<Badge variant="secondary">{notes.length}</Badge>
						) : null}
					</div>
					<SheetDescription>
						{reference} · {projectName}
					</SheetDescription>
				</SheetHeader>
				<SheetPanel>
					<NoteTimelineBody
						// A client may only remove their own notes; an admin removes any.
						canDelete={
							isClient
								? (note) =>
										Boolean(currentUserId) &&
										note.addedByUserId === currentUserId
								: undefined
						}
						emptyDescription="Add the first note using the field below."
						notes={notes}
						onDelete={onDelete}
					/>
				</SheetPanel>
				{/* The composer is docked below the timeline so the newest notes stay
				    in view while you type. */}
				<div className="border-t px-6 pt-4">
					<Textarea
						aria-label="New note"
						className="min-h-20 resize-y"
						onChange={(e) => setNoteText(e.target.value)}
						placeholder="Add a note…"
						value={noteText}
					/>
				</div>
				<SheetFooter variant="bare">
					<SheetClose render={<Button type="button" variant="outline" />}>
						Close
					</SheetClose>
					<Button
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
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
