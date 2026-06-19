'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import PageHeading from '@/components/page-heading';
import ProjectDetailsTabs from '@/components/projects/project-details-tabs';
import {
	formatAddressLine,
	formatStartDateRelative,
	statusBadgeProps,
} from '@/lib/format';

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

	const statusBadge = statusBadgeProps(project.status);

	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading
				backLink="/projects"
				description={formatAddressLine(project.address)}
				heading={project.name}
				titleTrailing={
					<div className="flex shrink-0 items-center gap-3">
						<Badge className="shrink-0" size="lg" variant={statusBadge.variant}>
							{statusBadge.label}
						</Badge>
						{project.startDate ? (
							<Badge className="shrink-0" size="lg" variant="outline">
								{formatStartDateRelative(project.startDate)}
							</Badge>
						) : (
							<Badge className="shrink-0" size="lg" variant="warning">
								No start date available
							</Badge>
						)}
					</div>
				}
			/>
			<ProjectDetailsTabs projectId={project._id} />
		</div>
	);
}
