'use client';

import { DraftInlineAdd, DraftTextRow } from './quotation-draft-primitives';
import type { DraftEntry } from './use-quotation-draft';

/**
 * A flat list of single-sentence rows — the exclusions and the important notes.
 * The draft-local twin of `quote-lists/quote-simple-list.tsx`.
 */
export default function QuotationEntriesEditor({
	addPlaceholder,
	entries,
	loading,
	noun,
	onAdd,
	onRemove,
	onUpdate,
}: {
	addPlaceholder: string;
	entries: DraftEntry[];
	loading: boolean;
	noun: string;
	onAdd: (text: string) => void;
	onRemove: (key: string) => void;
	onUpdate: (key: string, text: string) => void;
}) {
	if (loading) {
		return (
			<p className="text-muted-foreground text-sm">{`Loading ${noun}s…`}</p>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<DraftInlineAdd noun={noun} onAdd={onAdd} placeholder={addPlaceholder} />
			{entries.length > 0 ? (
				<div className="divide-y overflow-hidden rounded-md border">
					{entries.map((entry, index) => (
						<DraftTextRow
							key={entry.key}
							label={`${noun} ${index + 1}`}
							number={String(index + 1)}
							onChange={(text) => onUpdate(entry.key, text)}
							onRemove={() => onRemove(entry.key)}
							value={entry.text}
						/>
					))}
				</div>
			) : (
				<p className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-sm">
					{`No ${noun}s on this quotation.`}
				</p>
			)}
		</div>
	);
}
