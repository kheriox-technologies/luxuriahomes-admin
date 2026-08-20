'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { SearchInput } from '@workspace/ui/components/search-input';
import { useMutation, useQuery } from 'convex/react';
import { NotebookPen } from 'lucide-react';
import { useState } from 'react';
import { QuoteSimpleList } from '@/components/quote-lists/quote-simple-list';
import { useQuoteTemplateId } from './quote-template-context';

export default function QuotationsNotesTab() {
	const templateId = useQuoteTemplateId();
	const notes = useQuery(api.quoteNotes.list.list, { templateId });
	const addNote = useMutation(api.quoteNotes.add.add);
	const updateNote = useMutation(api.quoteNotes.update.update);
	const removeNote = useMutation(api.quoteNotes.remove.remove);
	const reorderNotes = useMutation(api.quoteNotes.reorder.reorder);
	const [search, setSearch] = useState('');

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<SearchInput
				aria-label="Search notes"
				onValueChange={setSearch}
				placeholder="Search notes…"
				value={search}
			/>
			<QuoteSimpleList
				addPlaceholder="Add a note and press Enter…"
				empty={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<NotebookPen aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No notes yet</EmptyTitle>
							<EmptyDescription>
								Add the important notes a client should read alongside the
								quotation. They print in the order shown here.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				noResults={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<NotebookPen aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No matching notes</EmptyTitle>
							<EmptyDescription>Try different wording.</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				noun="note"
				nounPlural="notes"
				onAdd={(text) => addNote({ templateId, text })}
				onRemove={(id) => removeNote({ noteId: id as Id<'quoteNotes'> })}
				onReorder={(ids) =>
					reorderNotes({ noteIds: ids as Id<'quoteNotes'>[] })
				}
				onUpdate={(id, text) =>
					updateNote({ noteId: id as Id<'quoteNotes'>, text })
				}
				rows={notes}
				search={search}
			/>
		</div>
	);
}
