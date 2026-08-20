'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import { useQuery } from 'convex/react';
import {
	Ban,
	ListTree,
	NotebookPen,
	Plus,
	ScrollText,
	ShieldAlert,
	Signature,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import PageHeading from '@/components/page-heading';
import QuotationsAcknowledgementTab from './quotations-acknowledgement-tab';
import QuotationsDisclaimerTab from './quotations-disclaimer-tab';
import QuotationsExclusionsTab from './quotations-exclusions-tab';
import QuotationsItemsTab from './quotations-items-tab';
import QuotationsNotesTab from './quotations-notes-tab';
import QuotationsTermsTab from './quotations-terms-tab';
import { QuoteTemplateProvider } from './quote-template-context';

const TAB_CLASSNAME =
	'data-active:text-primary-foreground hover:data-active:text-primary-foreground';

export default function QuotationsPageContent({
	templateId,
}: {
	templateId: Id<'quoteTemplates'>;
}) {
	const router = useRouter();
	const template = useQuery(api.quoteTemplates.get.get, { templateId });
	const searchParams = useSearchParams();
	const activeTab = searchParams.get('tab') ?? 'items';

	const onTabChange = useCallback(
		(tab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set('tab', tab);
			router.push(`?${params.toString()}`);
		},
		[router, searchParams]
	);

	return (
		<QuoteTemplateProvider templateId={templateId}>
			<div className="flex h-full min-h-0 w-full flex-col gap-4">
				<PageHeading
					backLink="/quotation-templates"
					description={
						template?.description ??
						'The catalogue, terms, exclusions, notes, disclaimer and acknowledgement this template builds a quotation from.'
					}
					heading={template?.name ?? 'Quotation template'}
					icon={ScrollText}
					rightSlot={
						<Button
							render={<Link href={`/quotations/new?template=${templateId}`} />}
							variant="outline"
						>
							<Plus aria-hidden />
							Create Quotation
						</Button>
					}
				/>
				<Tabs
					className="flex-1 gap-0 overflow-hidden rounded-xl border"
					onValueChange={onTabChange}
					value={activeTab}
				>
					<TabsList className="w-full rounded-none border-b bg-muted/50 **:data-[slot=tab-indicator]:bg-primary">
						<TabsTab className={TAB_CLASSNAME} value="items">
							<ListTree />
							Items
						</TabsTab>
						<TabsTab className={TAB_CLASSNAME} value="terms">
							<ScrollText />
							Terms
						</TabsTab>
						<TabsTab className={TAB_CLASSNAME} value="exclusions">
							<Ban />
							Exclusions
						</TabsTab>
						<TabsTab className={TAB_CLASSNAME} value="notes">
							<NotebookPen />
							Notes
						</TabsTab>
						<TabsTab className={TAB_CLASSNAME} value="disclaimer">
							<ShieldAlert />
							Disclaimer
						</TabsTab>
						<TabsTab className={TAB_CLASSNAME} value="acknowledgement">
							<Signature />
							Acknowledgement
						</TabsTab>
					</TabsList>
					<TabsPanel
						className="flex min-h-0 flex-1 flex-col overflow-auto p-4"
						value="items"
					>
						<QuotationsItemsTab />
					</TabsPanel>
					<TabsPanel
						className="flex min-h-0 flex-1 flex-col overflow-auto p-4"
						value="terms"
					>
						<QuotationsTermsTab />
					</TabsPanel>
					<TabsPanel
						className="flex min-h-0 flex-1 flex-col overflow-auto p-4"
						value="exclusions"
					>
						<QuotationsExclusionsTab />
					</TabsPanel>
					<TabsPanel
						className="flex min-h-0 flex-1 flex-col overflow-auto p-4"
						value="notes"
					>
						<QuotationsNotesTab />
					</TabsPanel>
					<TabsPanel className="overflow-auto p-4" value="disclaimer">
						<QuotationsDisclaimerTab />
					</TabsPanel>
					<TabsPanel className="overflow-auto p-4" value="acknowledgement">
						<QuotationsAcknowledgementTab />
					</TabsPanel>
				</Tabs>
			</div>
		</QuoteTemplateProvider>
	);
}
