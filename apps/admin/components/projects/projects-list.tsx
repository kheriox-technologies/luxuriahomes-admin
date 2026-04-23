'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Card, CardTitle } from '@workspace/ui/components/card';
import { cn } from '@workspace/ui/lib/utils';
import { useQuery } from 'convex/react';
import Link, { type LinkProps } from 'next/link';

type Project = Doc<'projects'>;

function statusBadgeProps(status: Project['status']): {
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

function ProjectCard({ project }: { project: Project }) {
	const badge = statusBadgeProps(project.status);
	return (
		<Link
			className="group block min-w-0"
			href={`/projects/${project._id}` as LinkProps<string>['href']}
			prefetch
		>
			<Card
				className={cn(
					'h-full transition-colors',
					'group-hover:border-ring/32 group-hover:bg-accent/24'
				)}
			>
				<div className="flex flex-col gap-3 p-6">
					<div className="flex items-center justify-between gap-3">
						<CardTitle className="min-w-0 truncate text-lg leading-snug">
							{project.name}
						</CardTitle>
						<Badge className="shrink-0" size="lg" variant={badge.variant}>
							{badge.label}
						</Badge>
					</div>
					<div className="space-y-1 text-muted-foreground text-sm">
						<p className="leading-snug">{project.address.street}</p>
						<p className="leading-snug">
							{project.address.suburb}, {project.address.state}{' '}
							{project.address.postcode}
						</p>
					</div>
				</div>
			</Card>
		</Link>
	);
}

export default function ProjectsList({
	searchQuery = '',
}: {
	searchQuery?: string;
}) {
	const trimmedSearch = searchQuery.trim();
	const listResults = useQuery(
		api.projects.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.projects.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const projects = trimmedSearch === '' ? listResults : searchResults;

	if (projects === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading projects…</div>
		);
	}

	if (projects.length === 0) {
		return (
			<div className="text-muted-foreground text-sm">
				{trimmedSearch === ''
					? 'No projects yet.'
					: 'No projects match your search.'}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
			{projects.map((project) => (
				<ProjectCard key={project._id} project={project} />
			))}
		</div>
	);
}
