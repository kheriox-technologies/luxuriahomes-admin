'use client';

import { api } from '@workspace/backend/api';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { SearchInput } from '@workspace/ui/components/search-input';
import { useQuery } from 'convex/react';
import { ChevronsDownIcon, ChevronsUpIcon, ScrollText } from 'lucide-react';
import { useRef, useState } from 'react';
import {
	QuoteTermsTree,
	type QuoteTermsTreeHandle,
} from '@/components/quote-terms/quote-terms-tree';

export default function QuotationsTermsTab() {
	const terms = useQuery(api.quoteTerms.get.get, {});
	const [search, setSearch] = useState('');
	const treeRef = useRef<QuoteTermsTreeHandle>(null);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<SearchInput
					aria-label="Search terms & conditions"
					onValueChange={setSearch}
					placeholder="Search by section or clause…"
					value={search}
				/>
				<div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
					<Group>
						<Button
							aria-label="Expand all"
							onClick={() => treeRef.current?.expandAll()}
							size="icon"
							type="button"
							variant="outline"
						>
							<ChevronsDownIcon />
						</Button>
						<GroupSeparator />
						<Button
							aria-label="Collapse all"
							onClick={() => treeRef.current?.collapseAll()}
							size="icon"
							type="button"
							variant="outline"
						>
							<ChevronsUpIcon />
						</Button>
					</Group>
				</div>
			</div>
			<QuoteTermsTree
				empty={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ScrollText aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No terms & conditions yet</EmptyTitle>
							<EmptyDescription>
								Start with a section above, then add the clauses that belong in
								it. Sections and clauses print in the order shown here.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				noResults={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ScrollText aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No matching terms</EmptyTitle>
							<EmptyDescription>
								Try a different section name or clause wording.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				ref={treeRef}
				search={search}
				tree={terms?.sections}
			/>
		</div>
	);
}
