'use no memo';
'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Doc, Id } from '@workspace/backend/dataModel';
import { DataTable } from '@workspace/ui/components/data-table';
import { Circle } from 'lucide-react';
import ClientPortalActionsCell from '@/components/projects/client-portal-actions-cell';
import {
	projectClientAddressLine,
	projectClientDisplayName,
} from '@/components/projects/project-form-shared';

type ProjectClient = Doc<'projects'>['clients'][number];

const baseColumns: ColumnDef<ProjectClient>[] = [
	{
		id: 'name',
		header: 'Name',
		cell: ({ row }) => (
			<span className="font-medium">
				{projectClientDisplayName(row.original)}
			</span>
		),
	},
	{
		accessorKey: 'email',
		header: 'Email',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.email}
			</span>
		),
	},
	{
		accessorKey: 'phone',
		header: 'Phone',
		cell: ({ row }) => (
			<span className="text-muted-foreground text-sm">
				{row.original.phone}
			</span>
		),
	},
	{
		id: 'company',
		header: 'Company',
		cell: ({ row }) =>
			row.original.company ? (
				<span className="text-sm">{row.original.company}</span>
			) : null,
	},
	{
		id: 'address',
		header: 'Address',
		cell: ({ row }) => {
			const line = projectClientAddressLine(row.original);
			return line ? (
				<span className="text-muted-foreground text-sm">{line}</span>
			) : null;
		},
	},
	{
		id: 'clientAccess',
		header: 'Client Access',
		cell: ({ row }) => {
			const hasAccess = Boolean(row.original.portalUserId);
			return (
				<Circle
					aria-label={hasAccess ? 'Has portal access' : 'No portal access'}
					className={
						hasAccess
							? 'size-3 fill-current text-green-500'
							: 'size-3 fill-current text-red-500'
					}
				/>
			);
		},
	},
];

export default function ProjectClientsTabContent({
	clients,
	projectId,
}: {
	clients: ProjectClient[];
	projectId: Id<'projects'>;
}) {
	const columns: ColumnDef<ProjectClient>[] = [
		...baseColumns,
		{
			id: 'actions',
			header: '',
			size: 64,
			cell: ({ row }) => (
				<ClientPortalActionsCell client={row.original} projectId={projectId} />
			),
		},
	];

	return (
		<DataTable
			columns={columns}
			data={clients}
			emptyMessage="No clients have been added to this project yet."
			showPagination={false}
		/>
	);
}
