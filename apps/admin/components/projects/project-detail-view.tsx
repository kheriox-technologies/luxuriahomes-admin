'use client';

import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import { Pencil, Trash2 } from 'lucide-react';
import PageHeading from '@/components/page-heading';
import DeleteProject from '@/components/projects/delete-project';
import EditProjectForm from '@/components/projects/edit-project';
import ProjectDetailsTabs from '@/components/projects/project-details-tabs';

function formatAddressLine(address: {
	street: string;
	suburb: string;
	state: string;
	postcode: string;
}): string {
	return `${address.street}, ${address.suburb}, ${address.state} ${address.postcode}`;
}

function statusBadgeProps(status: Doc<'projects'>['status']): {
	label: string;
	variant: 'info' | 'warning' | 'success';
} {
	switch (status) {
		case 'not_started':
			return { label: 'Not started', variant: 'info' };
		case 'in_progress':
			return { label: 'In progress', variant: 'warning' };
		case 'completed':
			return { label: 'Completed', variant: 'success' };
		default: {
			const _exhaustive: never = status;
			return _exhaustive;
		}
	}
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

	const statusBadge = statusBadgeProps(project.status);

	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading
				backLink="/projects"
				className="mb-0"
				description={formatAddressLine(project.address)}
				heading={project.name}
				rightSlot={
					<div className="flex items-center gap-2">
						<Badge size="lg" variant={statusBadge.variant}>
							{statusBadge.label}
						</Badge>
						<EditProjectForm
							projectId={projectId}
							trigger={
								<Button
									aria-label="Edit project"
									className="size-9 sm:h-8 sm:w-auto sm:px-[calc(--spacing(3)-1px)]"
									size="icon"
									variant="outline"
								>
									<Pencil className="sm:hidden" />
									<span className="hidden sm:inline">Edit project</span>
									<span className="sr-only sm:hidden">Edit project</span>
								</Button>
							}
						/>
						<DeleteProject
							projectId={projectId}
							projectName={project.name}
							trigger={
								<Button
									aria-label="Delete project"
									className="size-9 sm:h-8 sm:w-auto sm:px-[calc(--spacing(3)-1px)]"
									size="icon"
									variant="destructive-outline"
								>
									<Trash2 className="sm:hidden" />
									<span className="hidden sm:inline">Delete project</span>
									<span className="sr-only sm:hidden">Delete project</span>
								</Button>
							}
						/>
					</div>
				}
			/>
			<ProjectDetailsTabs clients={project.clients} />
		</div>
	);
}
