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
import AddQuoteItem from '@/components/quote-items/add-quote-item';
import AddQuoteSection from '@/components/quote-items/add-quote-section';
import AddQuoteStage from '@/components/quote-items/add-quote-stage';
import {
	QuoteCatalogueTree,
	type QuoteCatalogueTreeHandle,
} from '@/components/quote-items/quote-catalogue-tree';

const REQUIRED_PERCENT_TOTAL = 100;

export default function QuotationsItemsTab() {
	const tree = useQuery(api.quoteCatalogue.tree.tree, {});
	const [search, setSearch] = useState('');
	const treeRef = useRef<QuoteCatalogueTreeHandle>(null);

	// Quotations pre-fill their progress-payment split from these percentages, so
	// surface it here when the catalogue's defaults don't add up.
	const percentTotal = tree?.reduce(
		(sum, node) => sum + (node.stage.defaultPercent ?? 0),
		0
	);
	const showPercentWarning =
		percentTotal !== undefined &&
		tree !== undefined &&
		tree.length > 0 &&
		percentTotal !== REQUIRED_PERCENT_TOTAL;

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4">
			<div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<SearchInput
					aria-label="Search quote items"
					onValueChange={setSearch}
					placeholder="Search by stage, section or item…"
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
					<AddQuoteStage />
					<AddQuoteSection />
					<AddQuoteItem />
				</div>
			</div>
			{showPercentWarning ? (
				<p className="text-muted-foreground text-sm">
					Stage progress payments total {percentTotal}%. A quotation needs
					exactly 100%, so adjust the stage percentages or set them on the
					quotation itself.
				</p>
			) : null}
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
