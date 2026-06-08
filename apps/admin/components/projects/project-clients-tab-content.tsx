'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Doc } from '@workspace/backend/dataModel';
import { DataTable } from '@workspace/ui/components/data-table';
import {
	projectClientAddressLine,
	projectClientDisplayName,
} from '@/components/projects/project-form-shared';

type ProjectClient = Doc<'projects'>['clients'][number];

const columns: ColumnDef<ProjectClient>[] = [
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
];

export default function ProjectClientsTabContent({
	clients,
}: {
	clients: ProjectClient[];
}) {
	return (
		<DataTable
			columns={columns}
			data={clients}
			emptyMessage="No clients have been added to this project yet."
			showPagination={false}
		/>
	);
}
