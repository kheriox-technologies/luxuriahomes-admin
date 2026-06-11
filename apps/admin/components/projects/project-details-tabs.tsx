'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import {
	ClipboardList,
	DollarSign,
	FileText,
	Handshake,
	SquaresIntersect,
	Users,
} from 'lucide-react';
import ProjectOrdersTabContent from '@/components/orders/orders-tab-content';
import ProjectClientsTabContent from '@/components/projects/project-clients-tab-content';
import ProjectDocumentsTabContent from '@/components/projects/project-documents-tab-content';
import ProjectInclusionsTabContent from '@/components/projects/project-inclusions-tab-content';
import ProjectQuotationsTabContent from '@/components/projects/project-quotations-tab-content';
import ProjectServiceProvidersTabContent from '@/components/projects/project-service-providers-tab-content';

type ProjectClient = Doc<'projects'>['clients'][number];

export default function ProjectDetailsTabs({
	clients,
	projectId,
}: {
	clients: ProjectClient[];
	projectId: Id<'projects'>;
}) {
	return (
		<Tabs
			className="flex-1 gap-0 overflow-hidden rounded-xl border"
			defaultValue="clients"
		>
			<TabsList className="w-full rounded-none border-b bg-muted/50 **:data-[slot=tab-indicator]:bg-primary">
				<TabsTab
					className="data-active:text-primary-foreground hover:data-active:text-primary-foreground"
					value="clients"
				>
					<Users />
					Clients
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
			</TabsList>
			<TabsPanel className="overflow-auto p-4" value="clients">
				<ProjectClientsTabContent clients={clients} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="inclusions">
				<ProjectInclusionsTabContent projectId={projectId} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="documents">
				<ProjectDocumentsTabContent projectId={projectId} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="quotations">
				<ProjectQuotationsTabContent projectId={projectId} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="contacts">
				<ProjectServiceProvidersTabContent projectId={projectId} />
			</TabsPanel>
			<TabsPanel className="overflow-auto p-4" value="orders">
				<ProjectOrdersTabContent projectId={projectId} />
			</TabsPanel>
		</Tabs>
	);
}
