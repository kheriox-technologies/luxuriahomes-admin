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
import { Ban } from 'lucide-react';
import { useState } from 'react';
import { QuoteSimpleList } from '@/components/quote-lists/quote-simple-list';

export default function QuotationsExclusionsTab() {
	const exclusions = useQuery(api.quoteExclusions.list.list, {});
	const addExclusion = useMutation(api.quoteExclusions.add.add);
	const updateExclusion = useMutation(api.quoteExclusions.update.update);
	const removeExclusion = useMutation(api.quoteExclusions.remove.remove);
	const reorderExclusions = useMutation(api.quoteExclusions.reorder.reorder);
	const [search, setSearch] = useState('');

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<SearchInput
				aria-label="Search exclusions"
				onValueChange={setSearch}
				placeholder="Search exclusions…"
				value={search}
			/>
			<QuoteSimpleList
				addPlaceholder="Add an exclusion and press Enter…"
				empty={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Ban aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No exclusions yet</EmptyTitle>
							<EmptyDescription>
								Add the items a quotation explicitly does not cover. They print
								in the order shown here.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				noResults={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<Ban aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No matching exclusions</EmptyTitle>
							<EmptyDescription>Try different wording.</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				noun="exclusion"
				nounPlural="exclusions"
				onAdd={(text) => addExclusion({ text })}
				onRemove={(id) =>
					removeExclusion({ exclusionId: id as Id<'quoteExclusions'> })
				}
				onReorder={(ids) =>
					reorderExclusions({
						exclusionIds: ids as Id<'quoteExclusions'>[],
					})
				}
				onUpdate={(id, text) =>
					updateExclusion({ exclusionId: id as Id<'quoteExclusions'>, text })
				}
				rows={exclusions}
				search={search}
			/>
		</div>
	);
}
