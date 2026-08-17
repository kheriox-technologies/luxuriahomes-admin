'use client';

import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import { ListTree, ScrollText, ShieldAlert, Signature } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import PageHeading from '@/components/page-heading';
import QuotationsAcknowledgementTab from './quotations-acknowledgement-tab';
import QuotationsDisclaimerTab from './quotations-disclaimer-tab';
import QuotationsItemsTab from './quotations-items-tab';
import QuotationsTermsTab from './quotations-terms-tab';

const TAB_CLASSNAME =
	'data-active:text-primary-foreground hover:data-active:text-primary-foreground';

export default function QuotationsPageContent() {
	const router = useRouter();
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
		<div className="flex h-full min-h-0 w-full flex-col gap-4">
			<PageHeading
				description="The catalogue, terms, disclaimer and acknowledgement used to build every client quotation."
				heading="Quotations"
				icon={ScrollText}
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
				<TabsPanel className="overflow-auto p-4" value="disclaimer">
					<QuotationsDisclaimerTab />
				</TabsPanel>
				<TabsPanel className="overflow-auto p-4" value="acknowledgement">
					<QuotationsAcknowledgementTab />
				</TabsPanel>
			</Tabs>
		</div>
	);
}
