'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { StickyNote, Trash2 } from 'lucide-react';
import { NoteImagesRow } from '@/components/notes/note-images-row';

/**
 * The shape every note log shares. Each table brands `_id` differently, so the
 * id type rides along as a parameter and delete handlers stay typed.
 */
export interface TimelineNote<TId extends string = string> {
	_id: TId;
	addedBy: string;
	/** Clerk user id of the author, where the note log records one. */
	addedByUserId?: string;
	images?: string[];
	note: string;
	timestamp: number;
}

interface NoteDay<TId extends string> {
	key: string;
	label: string;
	notes: TimelineNote<TId>[];
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
function groupByDay<TId extends string>(
	notes: TimelineNote<TId>[]
): NoteDay<TId>[] {
	const today = startOfDay(new Date());
	const days: NoteDay<TId>[] = [];
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

function NoteTimelineItem<TId extends string>({
	deletable,
	latest,
	note,
	onDelete,
}: {
	deletable: boolean;
	latest: boolean;
	note: TimelineNote<TId>;
	onDelete: (noteId: TId) => void;
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
					{deletable ? (
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
					) : null}
				</div>
				<p className="whitespace-pre-wrap text-pretty text-muted-foreground text-sm leading-relaxed">
					{note.note}
				</p>
				{note.images && note.images.length > 0 ? (
					<NoteImagesRow
						imageKeys={note.images}
						title={`Note by ${note.addedBy}`}
					/>
				) : null}
			</div>
		</li>
	);
}

function NoteTimeline<TId extends string>({
	canDelete,
	notes,
	onDelete,
}: {
	canDelete: (note: TimelineNote<TId>) => boolean;
	notes: TimelineNote<TId>[];
	onDelete: (noteId: TId) => void;
}) {
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
								deletable={canDelete(note)}
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

/**
 * The whole read side of a note log: loading, empty and the timeline itself.
 * Every notes surface renders this so they stay identical as the design moves.
 */
export function NoteTimelineBody<TId extends string>({
	canDelete,
	emptyDescription,
	notes,
	onDelete,
}: {
	/**
	 * Which notes offer a delete button. Defaults to all of them — the client
	 * portal passes a predicate so a client only sees it on their own notes.
	 */
	canDelete?: (note: TimelineNote<TId>) => boolean;
	emptyDescription: string;
	notes: TimelineNote<TId>[] | undefined;
	onDelete: (noteId: TId) => void;
}) {
	if (notes === undefined) {
		return <p className="text-muted-foreground text-sm">Loading notes…</p>;
	}
	if (notes.length === 0) {
		return (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<StickyNote aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No notes yet</EmptyTitle>
					<EmptyDescription>{emptyDescription}</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	}
	return (
		<NoteTimeline
			canDelete={canDelete ?? (() => true)}
			notes={notes}
			onDelete={onDelete}
		/>
	);
}
