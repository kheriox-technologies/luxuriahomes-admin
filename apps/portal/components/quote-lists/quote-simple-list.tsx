'use client';

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { toastManager } from '@workspace/ui/components/toast';
import { GripVertical, Trash2 } from 'lucide-react';
import {
	type ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import DeleteQuoteListRow from './delete-quote-list-row';
import { DragHandle, InlineAddRow } from './list-primitives';

export interface QuoteListRow {
	_id: string;
	text: string;
}

// Stable module-level reference — a fresh object each render makes dnd-kit
// re-run its measuring effects, which with `Always` loops on setState.
const MEASURING_CONFIG = {
	droppable: { strategy: MeasuringStrategy.Always },
};

/**
 * One editable row: the text is a plain input committed on blur or Enter, so a
 * list of sentences can be corrected in place without opening a dialog.
 */
function Row({
	row,
	number,
	noun,
	dndEnabled,
	onUpdate,
	onRemove,
}: {
	row: QuoteListRow;
	number: number;
	noun: string;
	dndEnabled: boolean;
	onUpdate: (id: string, text: string) => Promise<unknown>;
	onRemove: (id: string) => Promise<unknown>;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: row._id, disabled: !dndEnabled });
	const [value, setValue] = useState(row.text);
	const [deleteOpen, setDeleteOpen] = useState(false);
	const committedRef = useRef(row.text);

	// Adopt server edits (another tab, or a failed save reverting) but never
	// clobber what is currently being typed.
	useEffect(() => {
		if (row.text !== committedRef.current) {
			committedRef.current = row.text;
			setValue(row.text);
		}
	}, [row.text]);

	const commit = useCallback(async () => {
		const trimmed = value.trim();
		// Blank is treated as "no change" rather than an error — the row reverts to
		// what is stored, and deleting is done with the delete button.
		if (trimmed.length === 0) {
			setValue(committedRef.current);
			return;
		}
		if (trimmed === committedRef.current) {
			return;
		}
		try {
			await onUpdate(row._id, trimmed);
			committedRef.current = trimmed;
		} catch (error) {
			setValue(committedRef.current);
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					`Could not save ${noun}. Please try again in a moment.`
				),
				title: `Could not save ${noun}`,
				type: 'error',
			});
		}
	}, [noun, onUpdate, row._id, value]);

	const handleCommit = () => {
		commit().catch(() => {
			/* Error handled in commit */
		});
	};

	return (
		<div
			className="flex items-center gap-2 bg-card px-3 py-2"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			{dndEnabled ? (
				<DragHandle
					attributes={attributes}
					label={`Reorder ${noun} ${number}`}
					listeners={listeners}
				/>
			) : (
				<span aria-hidden className="w-4 shrink-0" />
			)}
			<span className="shrink-0 text-muted-foreground text-xs tabular-nums">
				{number}
			</span>
			<Input
				aria-label={`${noun} ${number}`}
				className="flex-1"
				nativeInput
				onBlur={handleCommit}
				onChange={(e) => setValue(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						e.currentTarget.blur();
					}
				}}
				value={value}
			/>
			<Button
				aria-label={`Delete ${noun} ${number}`}
				onClick={() => setDeleteOpen(true)}
				size="icon"
				type="button"
				variant="destructive-outline"
			>
				<Trash2 />
			</Button>
			<DeleteQuoteListRow
				noun={noun}
				onConfirm={() => onRemove(row._id)}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				text={row.text}
			/>
		</div>
	);
}

/**
 * A flat, drag-reorderable list of single-sentence rows. Backs both the
 * Exclusions and Notes tabs — they differ only in nouns and mutations. The
 * two-level equivalent is `quote-terms/quote-terms-tree.tsx`.
 */
export function QuoteSimpleList({
	rows: serverRows,
	noun,
	nounPlural,
	addPlaceholder,
	onAdd,
	onUpdate,
	onRemove,
	onReorder,
	search = '',
	empty,
	noResults,
	loadingLabel,
}: {
	rows: QuoteListRow[] | undefined;
	noun: string;
	nounPlural: string;
	addPlaceholder: string;
	onAdd: (text: string) => Promise<unknown>;
	onUpdate: (id: string, text: string) => Promise<unknown>;
	onRemove: (id: string) => Promise<unknown>;
	onReorder: (ids: string[]) => Promise<unknown>;
	search?: string;
	empty?: ReactNode;
	noResults?: ReactNode;
	loadingLabel?: string;
}) {
	const [rows, setRows] = useState<QuoteListRow[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);

	// Mirror server data into local state so drags reorder optimistically. Never
	// overwrite mid-drag or the dragged row would snap back.
	useEffect(() => {
		if (serverRows && !activeId) {
			setRows(serverRows);
		}
	}, [serverRows, activeId]);

	const trimmedSearch = search.trim().toLowerCase();
	const dndEnabled = trimmedSearch === '';
	// Numbers come from the unfiltered list so they stay stable while searching.
	const numbers = useMemo(() => {
		const map = new Map<string, number>();
		for (const [index, row] of rows.entries()) {
			map.set(row._id, index + 1);
		}
		return map;
	}, [rows]);
	const displayRows = useMemo(
		() =>
			trimmedSearch
				? rows.filter((row) => row.text.toLowerCase().includes(trimmedSearch))
				: rows,
		[rows, trimmedSearch]
	);
	const rowIds = useMemo(
		() => displayRows.map((row) => row._id),
		[displayRows]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Only allow autoscroll on our own scroller — dnd-kit would otherwise scroll an
	// ancestor, moving every droppable under a stationary pointer and flip-flopping
	// `over` until React throws "Maximum update depth exceeded".
	const autoScroll = useMemo(
		() => ({
			canScroll: (element: Element) => element === scrollerRef.current,
		}),
		[]
	);

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(String(event.active.id));
	};

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		setActiveId(null);
		if (!over || active.id === over.id) {
			return;
		}
		const oldIndex = rows.findIndex((row) => row._id === String(active.id));
		const newIndex = rows.findIndex((row) => row._id === String(over.id));
		if (oldIndex === -1 || newIndex === -1) {
			return;
		}
		const next = arrayMove(rows, oldIndex, newIndex);
		setRows(next);
		onReorder(next.map((row) => row._id)).catch(() => {
			/* Convex reactive queries revert the UI automatically */
		});
	};

	const activeLabel = useMemo(
		() => rows.find((row) => row._id === activeId)?.text ?? null,
		[activeId, rows]
	);

	if (!serverRows) {
		return (
			<div className="text-muted-foreground text-sm">
				{loadingLabel ?? `Loading ${nounPlural}…`}
			</div>
		);
	}

	if (trimmedSearch !== '' && displayRows.length === 0 && noResults) {
		return <>{noResults}</>;
	}

	return (
		<div ref={scrollerRef}>
			{/* Hidden while searching: the box would look like a filtered result. */}
			{dndEnabled ? (
				<div className="mb-3">
					<InlineAddRow
						noun={noun}
						onAdd={onAdd}
						placeholder={addPlaceholder}
					/>
				</div>
			) : null}
			{displayRows.length === 0 && !trimmedSearch ? empty : null}
			<DndContext
				autoScroll={autoScroll}
				collisionDetection={closestCenter}
				measuring={MEASURING_CONFIG}
				onDragEnd={onDragEnd}
				onDragStart={onDragStart}
				sensors={sensors}
			>
				<SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
					{displayRows.length > 0 ? (
						<div className="divide-y overflow-hidden rounded-md border">
							{displayRows.map((row) => (
								<Row
									dndEnabled={dndEnabled}
									key={row._id}
									noun={noun}
									number={numbers.get(row._id) ?? 0}
									onRemove={onRemove}
									onUpdate={onUpdate}
									row={row}
								/>
							))}
						</div>
					) : null}
				</SortableContext>
				<DragOverlay>
					{activeLabel ? (
						<div className="flex max-w-md items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-md">
							<GripVertical className="size-4 shrink-0 text-muted-foreground" />
							<span className="truncate font-medium text-sm">
								{activeLabel}
							</span>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
