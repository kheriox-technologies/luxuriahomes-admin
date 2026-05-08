'use client';

import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import { SquaresIntersect, Users } from 'lucide-react';
import ProjectClientsTabContent from '@/components/projects/project-clients-tab-content';
import ProjectInclusionsTabContent from '@/components/projects/project-inclusions-tab-content';

type ProjectClient = Doc<'projects'>['clients'][number];

export default function ProjectDetailsTabs({
	clients,
	projectId,
}: {
	clients: ProjectClient[];
	projectId: Id<'projects'>;
}) {
	return (
		<Tabs className="mt-6 gap-4" defaultValue="clients">
			<TabsList className="**:data-[slot=tab-indicator]:bg-primary">
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
			</TabsList>
			<TabsPanel value="clients">
				<ProjectClientsTabContent clients={clients} />
			</TabsPanel>
			<TabsPanel value="inclusions">
				<ProjectInclusionsTabContent projectId={projectId} />
			</TabsPanel>
		</Tabs>
	);
}
