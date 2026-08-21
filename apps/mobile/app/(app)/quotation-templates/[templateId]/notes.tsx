import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { NotebookPen } from 'lucide-react-native';
import { OrderableEntryList } from '@/components/quotation-templates/orderable-entry-list';

export default function TemplateNotesScreen() {
	const { templateId: raw } = useLocalSearchParams<{ templateId: string }>();
	const templateId = raw as Id<'quoteTemplates'>;

	const notes = useQuery(api.quoteNotes.list.list, { templateId });
	const add = useMutation(api.quoteNotes.add.add);
	const update = useMutation(api.quoteNotes.update.update);
	const remove = useMutation(api.quoteNotes.remove.remove);
	const reorder = useMutation(api.quoteNotes.reorder.reorder);

	return (
		<OrderableEntryList
			emptyDescription="Anything listed here prints under Important notes on every quotation built from this template."
			emptyTitle="No important notes"
			entries={notes}
			icon={NotebookPen}
			noun="note"
			onAdd={(text) => add({ templateId, text })}
			onRemove={(id) => remove({ noteId: id as Id<'quoteNotes'> })}
			onReorder={(orderedIds) =>
				reorder({ noteIds: orderedIds as Id<'quoteNotes'>[] })
			}
			onUpdate={(id, text) => update({ noteId: id as Id<'quoteNotes'>, text })}
		/>
	);
}
