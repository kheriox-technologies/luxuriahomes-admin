'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import PageHeading from '@/components/page-heading';
import ProjectDetailsTabs from '@/components/projects/project-details-tabs';
import { formatAddressLine } from '@/lib/format';

export default function ProjectDetailView({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const project = useQuery(api.clientPortal.projects.get.get, { projectId });

	if (project === undefined) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading heading="Project" />
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	if (project === null) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading heading="Project" />
				<p className="text-muted-foreground text-sm">Project not found.</p>
			</div>
		);
	}

	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading
				backLink="/projects"
				description={formatAddressLine(project.address)}
				heading={project.name}
			/>
			<ProjectDetailsTabs projectId={project._id} />
		</div>
	);
}
