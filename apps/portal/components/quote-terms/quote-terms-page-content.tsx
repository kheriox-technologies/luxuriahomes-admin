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
import { useMutation, useQuery } from 'convex/react';
import { ChevronsDownIcon, ChevronsUpIcon, ScrollText } from 'lucide-react';
import { useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddQuoteTermItem from './add-quote-term-item';
import AddQuoteTermSection from './add-quote-term-section';
import EditableHtmlCard from './editable-html-card';
import { QuoteTermsTree, type QuoteTermsTreeHandle } from './quote-terms-tree';

export default function QuoteTermsPageContent() {
	const terms = useQuery(api.quoteTerms.get.get, {});
	const updateContent = useMutation(api.quoteTerms.updateContent.updateContent);
	const [search, setSearch] = useState('');
	const treeRef = useRef<QuoteTermsTreeHandle>(null);

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto">
			<PageHeading
				description="The disclaimer, terms and acknowledgement printed after the item breakdown on every client quotation."
				heading="Quote Terms"
				icon={ScrollText}
			/>
			<EditableHtmlCard
				description="Section 03 of the quotation — what the estimate does and does not commit to."
				editorId="quote-terms-disclaimer"
				isLoading={terms === undefined}
				noun="disclaimer"
				onSave={(html) => updateContent({ disclaimerHtml: html })}
				placeholder="Write the disclaimer that prints on every quotation…"
				title="Disclaimer"
				value={terms?.settings.disclaimerHtml ?? ''}
			/>
			<EditableHtmlCard
				description="Section 05 of the quotation — the copy printed above the client signature block."
				editorId="quote-terms-acknowledgement"
				isLoading={terms === undefined}
				noun="acknowledgement"
				onSave={(html) => updateContent({ acknowledgementHtml: html })}
				placeholder="Write the acknowledgement that prints above the signature block…"
				title="Acknowledgement"
				value={terms?.settings.acknowledgementHtml ?? ''}
			/>
			<PageHeading
				heading="Terms & Conditions"
				rightSlot={
					<>
						<SearchInput
							aria-label="Search terms & conditions"
							onValueChange={setSearch}
							placeholder="Search by section or clause…"
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
						<AddQuoteTermSection />
						<AddQuoteTermItem />
					</>
				}
			/>
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
