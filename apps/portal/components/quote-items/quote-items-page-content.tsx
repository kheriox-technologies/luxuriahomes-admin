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
import { ChevronsDownIcon, ChevronsUpIcon, ListTree } from 'lucide-react';
import { useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddQuoteItem from './add-quote-item';
import AddQuoteSection from './add-quote-section';
import AddQuoteStage from './add-quote-stage';
import {
	QuoteCatalogueTree,
	type QuoteCatalogueTreeHandle,
} from './quote-catalogue-tree';

export default function QuoteItemsPageContent() {
	const tree = useQuery(api.quoteCatalogue.tree.tree, {});
	const [search, setSearch] = useState('');
	const treeRef = useRef<QuoteCatalogueTreeHandle>(null);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<PageHeading
				heading="Quote Items"
				icon={ListTree}
				rightSlot={
					<>
						<SearchInput
							aria-label="Search quote items"
							onValueChange={setSearch}
							placeholder="Search by stage, section or item…"
							value={search}
						/>
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
						<AddQuoteStage />
						<AddQuoteSection />
						<AddQuoteItem />
					</>
				}
			/>
			<QuoteCatalogueTree
				empty={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ListTree aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No quote items yet</EmptyTitle>
							<EmptyDescription>
								Start with a stage above, then add sections and the items that
								belong in them. Items marked as default are pre-selected on new
								quotations.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				noResults={
					<Empty>
						<EmptyHeader>
							<EmptyMedia variant="icon">
								<ListTree aria-hidden />
							</EmptyMedia>
							<EmptyTitle>No matching quote items</EmptyTitle>
							<EmptyDescription>
								Try a different stage, section or item name.
							</EmptyDescription>
						</EmptyHeader>
					</Empty>
				}
				ref={treeRef}
				search={search}
				tree={tree}
			/>
		</div>
	);
}
