import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { Ban } from 'lucide-react-native';
import { OrderableEntryList } from '@/components/quotation-templates/orderable-entry-list';

export default function TemplateExclusionsScreen() {
	const { templateId: raw } = useLocalSearchParams<{ templateId: string }>();
	const templateId = raw as Id<'quoteTemplates'>;

	const exclusions = useQuery(api.quoteExclusions.list.list, { templateId });
	const add = useMutation(api.quoteExclusions.add.add);
	const update = useMutation(api.quoteExclusions.update.update);
	const remove = useMutation(api.quoteExclusions.remove.remove);
	const reorder = useMutation(api.quoteExclusions.reorder.reorder);

	return (
		<OrderableEntryList
			emptyDescription="Anything listed here prints as an exclusion on every quotation built from this template."
			emptyTitle="No exclusions"
			entries={exclusions}
			icon={Ban}
			noun="exclusion"
			onAdd={(text) => add({ templateId, text })}
			onRemove={(id) => remove({ exclusionId: id as Id<'quoteExclusions'> })}
			onReorder={(orderedIds) =>
				reorder({ exclusionIds: orderedIds as Id<'quoteExclusions'>[] })
			}
			onUpdate={(id, text) =>
				update({ exclusionId: id as Id<'quoteExclusions'>, text })
			}
		/>
	);
}
