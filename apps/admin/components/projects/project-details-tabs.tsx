'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import {
	CalendarDays,
	ClipboardList,
	DollarSign,
	FileText,
	Handshake,
	SquaresIntersect,
	Users,
	Wallet,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import ProjectOrdersTabContent from '@/components/orders/orders-tab-content';
import ProjectBudgetsTabContent from '@/components/projects/project-budgets-tab-content';
import ProjectClientsTabContent from '@/components/projects/project-clients-tab-content';
import ProjectDocumentsTabContent from '@/components/projects/project-documents-tab-content';
import ProjectInclusionsTabContent from '@/components/projects/project-inclusions-tab-content';
import ProjectQuotationsTabContent from '@/components/projects/project-quotations-tab-content';
import ProjectScheduleTabContent from '@/components/projects/project-schedule-tab-content';
import ProjectServiceProvidersTabContent from '@/components/projects/project-service-providers-tab-content';
import type { QuotationFormValues } from '@/components/quotations/quotation-form-shared';

type ProjectClient = Doc<'projects'>['clients'][number];
type QuotationStatus = QuotationFormValues['status'];

export default function ProjectDetailsTabs({
	clients,
	project,
}: {
	clients: ProjectClient[];
	project: Doc<'projects'>;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab = searchParams.get('tab') ?? 'schedule';
	const orderIdFilter = searchParams.get('orderId') ?? '';
	const orderTaskIdFilter = searchParams.get('orderTaskId') ?? undefined;
	const orderTradeIdFilter =
		(searchParams.get('orderTradeId') as Id<'trades'> | null) ?? undefined;
	const quotationTradeIdFilter =
		(searchParams.get('quotationTradeId') as Id<'trades'> | null) ?? undefined;
	const quotationStatusFilter =
		(searchParams.get('quotationStatus') as QuotationStatus | null) ??
		undefined;

	const onTabChange = useCallback(
		(tab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set('tab', tab);
			params.delete('orderId');
			params.delete('orderTaskId');
			params.delete('orderTradeId');
			params.delete('quotationTradeId');
			params.delete('quotationStatus');
			router.push(`?${params.toString()}`);
		},
		[router, searchParams]
	);

	return (
		<Tabs
			className="flex-1 gap-0 overflow-hidden rounded-xl border"
			onValueChange={onTabChange}
			value={activeTab}
		>
			<TabsList className="w-full rounded-none border-b bg-muted/50 **:data-[slot=tab-indicator]:bg-primary">
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="schedule"
				>
					<CalendarDays />
					Schedule
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="inclusions"
				>
					<SquaresIntersect />
					Inclusions
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="documents"
				>
					<FileText />
					Documents
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="quotations"
				>
					<DollarSign />
					Quotations
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="budgets"
				>
					<Wallet />
					Budgets
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="contacts"
				>
					<Handshake />
					Service Providers
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="orders"
				>
					<ClipboardList />
					Orders
				</TabsTab>
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="clients"
				>
					<Users />
					Clients
				</TabsTab>
			</TabsList>
			<TabsPanel
				className="flex min-h-0 flex-1 overflow-hidden p-0"
				value="schedule"
			>
				<ProjectScheduleTabContent project={project} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="clients">
				<ProjectClientsTabContent clients={clients} projectId={project._id} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="inclusions">
				<ProjectInclusionsTabContent projectId={project._id} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="documents">
				<ProjectDocumentsTabContent projectId={project._id} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="quotations">
				<ProjectQuotationsTabContent
					initialStatus={quotationStatusFilter}
					initialTradeId={quotationTradeIdFilter}
					projectId={project._id}
				/>
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="budgets">
				<ProjectBudgetsTabContent projectId={project._id} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="contacts">
				<ProjectServiceProvidersTabContent projectId={project._id} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="orders">
				<ProjectOrdersTabContent
					initialTradeId={orderTradeIdFilter}
					orderIdFilter={orderIdFilter}
					orderTaskIdFilter={orderTaskIdFilter}
					projectId={project._id}
				/>
			</TabsPanel>
		</Tabs>
	);
}
