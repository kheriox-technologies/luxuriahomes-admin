'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
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
import { Check, StickyNote, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';

type QuotationNote = Doc<'clientQuotationNotes'>;

interface NoteDay {
	key: string;
	label: string;
	notes: QuotationNote[];
}

const TIME_FORMATTER = new Intl.DateTimeFormat('en-AU', {
	hour: 'numeric',
	minute: '2-digit',
});
const DAY_FORMATTER = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'short',
});
const DAY_WITH_YEAR_FORMATTER = new Intl.DateTimeFormat('en-AU', {
	day: 'numeric',
	month: 'short',
	year: 'numeric',
});
const MS_PER_DAY = 86_400_000;

/** Local midnight, so notes group by the day the reader saw them happen. */
function startOfDay(date: Date): number {
	return new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate()
	).getTime();
}

function dayLabel(timestamp: number, today: number): string {
	const day = startOfDay(new Date(timestamp));
	if (day === today) {
		return 'Today';
	}
	if (day === today - MS_PER_DAY) {
		return 'Yesterday';
	}
	const date = new Date(timestamp);
	const sameYear = date.getFullYear() === new Date(today).getFullYear();
	const formatter = sameYear ? DAY_FORMATTER : DAY_WITH_YEAR_FORMATTER;
	return formatter.format(date);
}

/** Notes arrive newest first, so the day groups come out in that order too. */
function groupByDay(notes: QuotationNote[]): NoteDay[] {
	const today = startOfDay(new Date());
	const days: NoteDay[] = [];
	for (const note of notes) {
		const key = String(startOfDay(new Date(note.timestamp)));
		const current = days.at(-1);
		if (current?.key === key) {
			current.notes.push(note);
		} else {
			days.push({
				key,
				label: dayLabel(note.timestamp, today),
				notes: [note],
			});
		}
	}
	return days;
}

function NoteTimelineItem({
	latest,
	note,
	onDelete,
}: {
	latest: boolean;
	note: QuotationNote;
	onDelete: (noteId: QuotationNote['_id']) => void;
}) {
	return (
		<li className="group/note grid grid-cols-[0.5rem_minmax(0,1fr)] gap-3 pb-5 last:pb-0">
			{/* The rail: a dot on the author line, then a hairline down the note. */}
			<div aria-hidden className="relative flex justify-center pt-[0.4rem]">
				<span
					className={`size-2 shrink-0 rounded-full ${latest ? 'bg-foreground' : 'bg-border'}`}
				/>
				<span className="absolute top-[1.1rem] bottom-0 w-px bg-border" />
			</div>
			<div className="flex min-w-0 flex-col gap-1">
				<div className="flex min-w-0 items-center gap-2">
					<span className="truncate font-medium text-sm">{note.addedBy}</span>
					<span className="shrink-0 text-muted-foreground text-xs">
						{TIME_FORMATTER.format(new Date(note.timestamp))}
					</span>
					<Button
						aria-label={`Delete note by ${note.addedBy}`}
						className="ms-auto shrink-0 opacity-0 transition-opacity focus-visible:opacity-100 group-focus-within/note:opacity-100 group-hover/note:opacity-100 max-md:opacity-100"
						onClick={() => onDelete(note._id)}
						size="icon-sm"
						type="button"
						variant="ghost"
					>
						<Trash2 className="size-4 text-destructive" />
					</Button>
				</div>
				<p className="whitespace-pre-wrap text-pretty text-muted-foreground text-sm leading-relaxed">
					{note.note}
				</p>
			</div>
		</li>
	);
}

function NotesTimeline({ notes }: { notes: QuotationNote[] }) {
	const deleteNoteMutation = useMutation(
		api.clientQuotations.deleteNote.deleteNote
	);

	const onDelete = (noteId: QuotationNote['_id']) => {
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

	const latestId = notes[0]?._id;

	return (
		<div className="flex flex-col gap-5">
			{groupByDay(notes).map((day) => (
				<section className="flex flex-col gap-3" key={day.key}>
					<div className="flex items-center gap-3">
						<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
							{day.label}
						</span>
						<span aria-hidden className="h-px flex-1 bg-border" />
					</div>
					<ol className="flex flex-col">
						{day.notes.map((note) => (
							<NoteTimelineItem
								key={note._id}
								latest={note._id === latestId}
								note={note}
								onDelete={onDelete}
							/>
						))}
					</ol>
				</section>
			))}
		</div>
	);
}

export default function ClientQuotationNotesSheet({
	quotationId,
	reference,
	projectName,
	open,
	onOpenChange,
}: {
	quotationId: Id<'clientQuotations'>;
	reference: string;
	projectName: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [noteText, setNoteText] = useState('');
	const [submitting, setSubmitting] = useState(false);

	const appendNoteMutation = useMutation(
		api.clientQuotations.appendNote.appendNote
	);
	const notes = useQuery(
		api.clientQuotations.listNotes.listNotes,
		open ? { quotationId } : 'skip'
	);

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

	let notesBody: ReactNode;
	if (notes === undefined) {
		notesBody = <p className="text-muted-foreground text-sm">Loading notes…</p>;
	} else if (notes.length === 0) {
		notesBody = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<StickyNote aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No notes yet</EmptyTitle>
					<EmptyDescription>
						Add the first note using the field below.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		notesBody = <NotesTimeline notes={notes} />;
	}

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
				<SheetPanel>{notesBody}</SheetPanel>
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
