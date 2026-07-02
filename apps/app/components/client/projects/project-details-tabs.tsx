'use client';

import type { Id } from '@workspace/backend/dataModel';
import {
	Tabs,
	TabsList,
	TabsPanel,
	TabsTab,
} from '@workspace/ui/components/tabs';
import { FileText, SquaresIntersect } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import ProjectDocumentsTabContent from '@/components/client/projects/project-documents-tab-content';
import ProjectInclusionsTabContent from '@/components/client/projects/project-inclusions-tab-content';

export default function ProjectDetailsTabs({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const activeTab = searchParams.get('tab') ?? 'inclusions';

	const onTabChange = useCallback(
		(tab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set('tab', tab);
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
			</TabsList>
			<TabsPanel
				className="min-h-0 flex-1 overflow-auto p-4"
				value="inclusions"
			>
				<ProjectInclusionsTabContent projectId={projectId} />
			</TabsPanel>
			<TabsPanel className="min-h-0 flex-1 overflow-auto p-4" value="documents">
				<ProjectDocumentsTabContent projectId={projectId} />
			</TabsPanel>
		</Tabs>
	);
}
