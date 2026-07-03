'use no memo';
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Doc } from '@workspace/backend/dataModel';
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
	Building2,
	EllipsisVertical,
	Pencil,
	SearchIcon,
	Trash2,
} from 'lucide-react';
import type { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { formatAud } from '@/lib/currency';
import DeleteProject from './delete-project';
import EditProjectForm from './edit-project';

type Project = Doc<'projects'>;

function ProjectActionsCell({ project }: { project: Project }) {
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
			<EditProjectForm
				onOpenChange={setEditOpen}
				open={editOpen}
				project={project}
				projectId={project._id}
			/>
			<DeleteProject
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				projectId={project._id}
				projectName={project.name}
				redirectOnDelete={false}
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

function NoMatchEmpty() {
	return (
		<div className="flex min-h-0 flex-1 flex-col">
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<SearchIcon aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching projects</EmptyTitle>
					<EmptyDescription>
						Try another name, address, suburb, postcode, or client detail — or
						clear the status filter.
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
		parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
	}
	if (days > 0) {
		parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
	}
	return parts.length > 0 ? parts.join(' ') : 'Today';
}

const RightHeader = ({ label }: { label: string }) => (
	<div className="text-right">{label}</div>
);

function MoneyDelta({
	amount,
	positiveSuffix,
	negativeSuffix,
}: {
	amount: number;
	positiveSuffix: string;
	negativeSuffix: string;
}) {
	const isPositive = amount >= 0;
	return (
		<p
			className={
				isPositive
					? 'text-success-foreground text-xs'
					: 'text-destructive-foreground text-xs'
			}
		>
			{isPositive
				? `${formatAud(amount)} ${positiveSuffix}`
				: `${formatAud(Math.abs(amount))} ${negativeSuffix}`}
		</p>
	);
}

const columns: ColumnDef<Project>[] = [
	{
		accessorKey: 'name',
		header: 'Project',
		cell: ({ row }) => {
			const { name, address } = row.original;
			return (
				<div className="min-w-0 space-y-0.5">
					<p className="truncate font-medium">{name}</p>
					<p className="truncate text-muted-foreground text-xs">
						{address.street}, {address.suburb} {address.state}{' '}
						{address.postcode}
					</p>
				</div>
			);
		},
	},
	{
		accessorKey: 'status',
		header: 'Status',
		size: 150,
		cell: ({ row }) => {
			const { status, startDate } = row.original;
			const badge = statusBadgeProps(status);
			const showDuration = status === 'in_progress' && startDate;
			return (
				<div className="space-y-1">
					<Badge size="lg" variant={badge.variant}>
						<span
							aria-hidden
							className="size-1.5 rounded-full bg-current opacity-70"
						/>
						{badge.label}
					</Badge>
					{showDuration ? (
						<p className="text-muted-foreground text-xs">
							{formatDuration(startDate)}
						</p>
					) : null}
				</div>
			);
		},
	},
	{
		id: 'quotePrice',
		header: () => <RightHeader label="Quote" />,
		size: 130,
		cell: ({ row }) => {
			const { quotePrice, expenses } = row.original;
			if (quotePrice === undefined) {
				return <div className="text-right text-muted-foreground">—</div>;
			}
			const remaining =
				expenses === undefined ? undefined : quotePrice - expenses;
			return (
				<div className="space-y-0.5 text-right tabular-nums">
					<p className="font-medium">{formatAud(quotePrice)}</p>
					{remaining === undefined ? null : (
						<MoneyDelta
							amount={remaining}
							negativeSuffix="over"
							positiveSuffix="left"
						/>
					)}
				</div>
			);
		},
	},
	{
		id: 'expenses',
		header: () => <RightHeader label="Spent" />,
		size: 120,
		cell: ({ row }) => {
			const { expenses } = row.original;
			return (
				<div className="text-right tabular-nums">
					{expenses === undefined ? (
						<span className="text-muted-foreground">—</span>
					) : (
						<span className="font-medium">{formatAud(expenses)}</span>
					)}
				</div>
			);
		},
	},
	{
		id: 'received',
		header: () => <RightHeader label="Received" />,
		size: 130,
		cell: ({ row }) => {
			const { received, expenses } = row.original;
			if (received === undefined) {
				return <div className="text-right text-muted-foreground">—</div>;
			}
			const profit = expenses === undefined ? undefined : received - expenses;
			return (
				<div className="space-y-0.5 text-right tabular-nums">
					<p className="font-medium">{formatAud(received)}</p>
					{profit === undefined ? null : (
						<MoneyDelta
							amount={profit}
							negativeSuffix="loss"
							positiveSuffix="profit"
						/>
					)}
				</div>
			);
		},
	},
	{
		id: 'clients',
		header: 'Client',
		size: 180,
		cell: ({ row }) => {
			const { clients } = row.original;
			const [primary, ...rest] = clients;
			if (!primary) {
				return <span className="text-muted-foreground text-sm">—</span>;
			}
			return (
				<div className="min-w-0 space-y-0.5">
					<p className="truncate font-medium">
						{primary.firstName} {primary.lastName}
					</p>
					<p className="truncate text-muted-foreground text-xs">
						{primary.email}
					</p>
					{rest.length > 0 ? (
						<p className="text-muted-foreground text-xs">
							+{rest.length} more {rest.length === 1 ? 'client' : 'clients'}
						</p>
					) : null}
				</div>
			);
		},
	},
	{
		id: 'actions',
		header: '',
		size: 60,
		cell: ({ row }) => <ProjectActionsCell project={row.original} />,
	},
];

export default function ProjectsList({
	projects,
	isFiltered,
	resetKey = '',
}: {
	projects: Project[] | undefined;
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
			onRowClick={(project) => router.push(`/projects/${project._id}` as Route)}
			stickyHeader
			verticalAlign="top"
		/>
	);
}
