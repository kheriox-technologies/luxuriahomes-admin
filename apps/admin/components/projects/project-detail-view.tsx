'use client';

import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import DeleteProject from '@/components/forms/delete-project';
import EditProjectForm from '@/components/forms/edit-project';
import PageHeading from '@/components/page-heading';

function formatAddressLine(address: {
	street: string;
	suburb: string;
	state: string;
	postcode: string;
}): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

export default function ProjectDetailView({
	projectId,
}: {
	projectId: Id<'projects'>;
}) {
	const project = useQuery(api.projects.get.get, { projectId });

	if (project === undefined) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/projects" heading="Project" />
				<p className="text-muted-foreground text-sm">Loading…</p>
			</div>
		);
	}

	if (project === null) {
		return (
			<div className={cn('flex h-full w-full flex-col')}>
				<PageHeading backLink="/projects" heading="Project" />
				<p className="text-muted-foreground text-sm">Project not found.</p>
			</div>
		);
	}

	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading
				backLink="/projects"
				className="mb-0"
				description={formatAddressLine(project.address)}
				heading={project.name}
				rightSlot={
					<div className="flex items-center gap-2">
						<EditProjectForm projectId={projectId} />
						<DeleteProject projectId={projectId} projectName={project.name} />
					</div>
				}
			/>
		</div>
	);
}
