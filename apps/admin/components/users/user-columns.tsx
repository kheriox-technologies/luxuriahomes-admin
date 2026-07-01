'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Button } from '@workspace/ui/components/button';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import { Pencil, Trash2 } from 'lucide-react';
import DeleteUser from './delete-user';
import EditUser from './edit-user';
import { formatRelativeTime } from './format-relative-time';
import type { UserRow } from './types';
import { formatRoleLabel } from './use-role-options';

const EM_DASH = '—';

export function getUserColumns(reload: () => void): ColumnDef<UserRow>[] {
	return [
		{
			accessorKey: 'fullName',
			header: 'Name',
			cell: ({ row }) => (
				<span className="font-medium">{row.original.fullName || EM_DASH}</span>
			),
		},
		{
			accessorKey: 'email',
			header: 'Email',
			cell: ({ row }) => (
				<span className="text-sm">{row.original.email || EM_DASH}</span>
			),
		},
		{
			accessorKey: 'phoneNumber',
			header: 'Phone',
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{row.original.phoneNumber || EM_DASH}
				</span>
			),
		},
		{
			accessorKey: 'roles',
			header: 'Roles',
			cell: ({ row }) => (
				<span className="text-sm">
					{row.original.roles.length > 0
						? row.original.roles.map(formatRoleLabel).join(', ')
						: EM_DASH}
				</span>
			),
		},
		{
			id: 'lastActive',
			header: 'Last active',
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{formatRelativeTime(
						row.original.lastActiveAt ?? row.original.lastSignInAt
					)}
				</span>
			),
		},
		{
			id: 'actions',
			header: '',
			size: 100,
			cell: ({ row }) => {
				const label =
					row.original.fullName || row.original.email || 'this user';
				return (
					<div className="flex justify-end">
						<Group>
							<EditUser
								onUpdated={reload}
								trigger={
									<Button
										aria-label="Edit user"
										size="icon"
										type="button"
										variant="outline"
									>
										<Pencil />
									</Button>
								}
								user={row.original}
							/>
							<GroupSeparator />
							<DeleteUser
								onDeleted={reload}
								trigger={
									<Button
										aria-label="Delete user"
										size="icon"
										type="button"
										variant="destructive-outline"
									>
										<Trash2 />
									</Button>
								}
								userId={row.original.userId}
								userLabel={label}
							/>
						</Group>
					</div>
				);
			},
		},
	];
}
