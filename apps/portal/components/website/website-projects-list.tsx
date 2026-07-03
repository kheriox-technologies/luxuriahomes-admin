'use no memo';
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import {
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import {
	EllipsisVertical,
	Globe,
	Pencil,
	SearchIcon,
	Trash2,
} from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import DeleteWebsiteProject from './delete-website-project';
import EditWebsiteProjectForm from './edit-website-project';
import {
	type WebsiteProject,
	websiteProjectStatusBadge,
} from './website-project-form-shared';
import { WebsiteProjectSpecs } from './website-project-specs';

function WebsiteProjectActionsCell({ project }: { project: WebsiteProject }) {
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noNoninteractiveElementInteractions: stopPropagation wrapper, not interactive
		// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper, not interactive
		<div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label="Project actions"
							size="icon-sm"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditWebsiteProjectForm
				onOpenChange={setEditOpen}
				open={editOpen}
				project={project}
				websiteProjectId={project._id}
			/>
			<DeleteWebsiteProject
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				projectName={project.name}
				redirectOnDelete={false}
				websiteProjectId={project._id}
			/>
		</div>
	);
}

function NoProjectsYetEmpty() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Globe aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No website projects yet</EmptyTitle>
					<EmptyDescription>
						Add a project to showcase it on your public website. Use the Add
						Project button above to get started.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

function NoMatchEmpty() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<SearchIcon aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching projects</EmptyTitle>
					<EmptyDescription>Try another project name.</EmptyDescription>
				</EmptyHeader>
			</Empty>
		</div>
	);
}

const columns: ColumnDef<WebsiteProject>[] = [
	{
		accessorKey: 'name',
		header: 'Project',
		cell: ({ row }) => {
			const { name, description } = row.original;
			return (
				<div className="min-w-0 space-y-0.5">
					<p className="truncate font-medium">{name}</p>
					{description ? (
						<p className="truncate text-muted-foreground text-xs">
							{description}
						</p>
					) : null}
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		size: 140,
		cell: ({ row }) => {
			const badge = websiteProjectStatusBadge(row.original.status);
			return (
				<Badge size="lg" variant={badge.variant}>
					<span
						aria-hidden
						className="size-1.5 rounded-full bg-current opacity-70"
					/>
					{badge.label}
				</Badge>
			);
		},
	},
	{
		accessorKey: 'include',
		header: 'Website',
		size: 120,
		cell: ({ row }) =>
			row.original.include ? (
				<Badge size="lg" variant="success">
					Included
				</Badge>
			) : (
				<Badge size="lg" variant="outline">
					Hidden
				</Badge>
			),
	},
	{
		accessorKey: 'completedYear',
		header: 'Year',
		size: 90,
		cell: ({ row }) => {
			const { completedYear } = row.original;
			return completedYear === undefined ? (
				<span className="text-muted-foreground">—</span>
			) : (
				<span className="tabular-nums">{completedYear}</span>
			);
		},
	},
	{
		id: 'specs',
		header: 'Details',
		size: 280,
		cell: ({ row }) => <WebsiteProjectSpecs project={row.original} />,
	},
	{
		id: 'actions',
		header: '',
		size: 60,
		cell: ({ row }) => <WebsiteProjectActionsCell project={row.original} />,
	},
];

export default function WebsiteProjectsList({
	projects,
	isFiltered,
	resetKey = '',
}: {
	projects: WebsiteProject[] | undefined;
	isFiltered: boolean;
	resetKey?: string;
}) {
	const router = useRouter();

	if (projects === undefined) {
		return (
			<div className="text-muted-foreground text-sm">Loading projects…</div>
		);
	}

	if (projects.length === 0) {
		return isFiltered ? <NoMatchEmpty /> : <NoProjectsYetEmpty />;
	}

	return (
		<DataTable
			columns={columns}
			data={projects}
			emptyMessage="No matching projects."
			key={resetKey}
			onRowClick={(project) => router.push(`/website/${project._id}` as Route)}
			stickyHeader
			verticalAlign="top"
		/>
	);
}
