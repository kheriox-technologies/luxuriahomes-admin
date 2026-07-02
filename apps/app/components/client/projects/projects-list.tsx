'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { useQuery } from 'convex/react';
import { Building2, ChevronRight, SearchIcon } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';

type Project = Doc<'projects'>;

function matchesSearch(project: Project, search: string): boolean {
	if (search === '') {
		return true;
	}
	const haystack = [
		project.name,
		project.address.street,
		project.address.suburb,
		project.address.state,
		project.address.postcode,
		...project.clients.flatMap((c) => [c.firstName, c.lastName, c.email]),
	]
		.join(' ')
		.toLowerCase();
	return haystack.includes(search.toLowerCase());
}

function NoProjectsEmpty() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Building2 aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No projects yet</EmptyTitle>
					<EmptyDescription>
						Your projects will appear here once they are set up.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

function NoMatchesEmpty() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<SearchIcon aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching projects</EmptyTitle>
					<EmptyDescription>
						Try another name, address, suburb, postcode, or client detail.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

const columns: ColumnDef<Project>[] = [
	{
		accessorKey: 'name',
		header: 'Name',
		cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
	},
	{
		id: 'address',
		header: 'Address',
		cell: ({ row }) => {
			const { street, suburb, state, postcode } = row.original.address;
			return (
				<div className="space-y-0.5">
					<p>{street}</p>
					<p className="text-muted-foreground text-xs">
						{suburb}, {state} {postcode}
					</p>
				</div>
			);
		},
	},
];

function ProjectCard({
	project,
	onOpen,
}: {
	project: Project;
	onOpen: () => void;
}) {
	const { street, suburb, state, postcode } = project.address;
	return (
		<button
			className="flex w-full items-start justify-between gap-3 rounded-lg border bg-card p-4 text-left"
			onClick={onOpen}
			type="button"
		>
			<div className="min-w-0 space-y-1">
				<p className="truncate font-medium">{project.name}</p>
				<p className="text-muted-foreground text-sm">{street}</p>
				<p className="text-muted-foreground text-xs">
					{suburb}, {state} {postcode}
				</p>
			</div>
			<ChevronRight className="mt-1 size-5 shrink-0 text-muted-foreground" />
		</button>
	);
}

export default function ProjectsList({
	searchQuery = '',
}: {
	searchQuery?: string;
}) {
	const router = useRouter();
	const trimmedSearch = searchQuery.trim();
	const allProjects = useQuery(api.clientPortal.projects.list.list, {});

	if (allProjects === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading projects…</div>
		);
	}

	if (allProjects.length === 0) {
		return <NoProjectsEmpty />;
	}

	const projects = allProjects.filter((p) => matchesSearch(p, trimmedSearch));

	if (projects.length === 0) {
		return <NoMatchesEmpty />;
	}

	const openProject = (id: Project['_id']) =>
		router.push(`/client/projects/${id}` as Route);

	return (
		<>
			{/* Mobile: stacked cards */}
			<div className="flex flex-col gap-3 md:hidden">
				{projects.map((project) => (
					<ProjectCard
						key={project._id}
						onOpen={() => openProject(project._id)}
						project={project}
					/>
				))}
			</div>
			{/* Desktop: table */}
			<div className="hidden md:block">
				<DataTable
					columns={columns}
					data={projects}
					emptyMessage="No matching projects."
					key={trimmedSearch}
					onRowClick={(project) => openProject(project._id)}
				/>
			</div>
		</>
	);
}
