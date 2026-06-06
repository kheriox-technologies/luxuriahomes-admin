'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { useQuery } from 'convex/react';
import { Building2, SearchIcon } from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Set to `false` before commit — forces the "no projects yet" empty UI. */
const FORCE_SHOW_PROJECTS_EMPTY_FOR_TESTING = false;

type Project = Doc<'projects'>;

function NoProjectsYetEmpty() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Building2 aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No projects yet</EmptyTitle>
					<EmptyDescription>
						Create a project to track builds, clients, and site details in one
						place. Use the Add project button above to get started.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

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

function formatDuration(startDate: number): string {
	const start = new Date(startDate);
	const end = new Date();

	let months =
		(end.getFullYear() - start.getFullYear()) * 12 +
		(end.getMonth() - start.getMonth());
	let days = end.getDate() - start.getDate();

	if (days < 0) {
		months -= 1;
		const daysInPrevMonth = new Date(
			end.getFullYear(),
			end.getMonth(),
			0
		).getDate();
		days += daysInPrevMonth;
	}

	const parts: string[] = [];
	if (months > 0) {
		parts.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
	}
	if (days > 0) {
		parts.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
	}
	return parts.length > 0 ? parts.join(' ') : 'Today';
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
	{
		accessorKey: 'status',
		header: 'Status',
		size: 130,
		cell: ({ row }) => {
			const badge = statusBadgeProps(row.original.status);
			return <Badge variant={badge.variant}>{badge.label}</Badge>;
		},
	},
	{
		id: 'duration',
		header: 'Duration',
		size: 140,
		cell: ({ row }) => {
			const { status, startDate } = row.original;
			if (status !== 'in_progress' || !startDate) {
				return null;
			}
			return (
				<span className="text-muted-foreground text-sm">
					{formatDuration(startDate)}
				</span>
			);
		},
	},
	{
		id: 'clients',
		header: 'Clients',
		cell: ({ row }) => (
			<div className="space-y-3">
				{row.original.clients.map((client, i) => (
					<div className="space-y-0.5" key={`${client.email}-${i}`}>
						<p className="font-medium">
							{client.firstName} {client.lastName}
						</p>
						<p className="text-muted-foreground text-xs">{client.email}</p>
						<p className="text-muted-foreground text-xs">{client.phone}</p>
					</div>
				))}
			</div>
		),
	},
];

export default function ProjectsList({
	searchQuery = '',
}: {
	searchQuery?: string;
}) {
	const router = useRouter();
	const trimmedSearch = searchQuery.trim();

	const [{ pageIndex, pageSize }, setPagination] = useState({
		pageIndex: 0,
		pageSize: 20,
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: trimmedSearch is the trigger to reset pagination, not a value consumed inside the callback
	useEffect(() => {
		setPagination((prev) => ({ ...prev, pageIndex: 0 }));
	}, [trimmedSearch]);

	const listResults = useQuery(
		api.projects.list.list,
		trimmedSearch === '' ? {} : 'skip'
	);
	const searchResults = useQuery(
		api.projects.search.search,
		trimmedSearch !== '' ? { query: trimmedSearch } : 'skip'
	);
	const projects = trimmedSearch === '' ? listResults : searchResults;

	if (FORCE_SHOW_PROJECTS_EMPTY_FOR_TESTING) {
		return <NoProjectsYetEmpty />;
	}

	if (projects === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading projects…</div>
		);
	}

	if (projects.length === 0) {
		if (trimmedSearch === '') {
			return <NoProjectsYetEmpty />;
		}
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

	const pageCount = Math.ceil(projects.length / pageSize);
	const pageData = projects.slice(
		pageIndex * pageSize,
		(pageIndex + 1) * pageSize
	);

	return (
		<DataTable
			columns={columns}
			data={pageData}
			emptyMessage="No matching projects."
			manualPagination
			onPaginationChange={setPagination}
			onRowClick={(project) => router.push(`/projects/${project._id}` as Route)}
			pagination={{ pageIndex, pageSize, pageCount }}
			totalCount={projects.length}
		/>
	);
}
