'use client';
// React Compiler can't track mutations on the TanStack Table instance (setOptions during render).
'use no memo';

import type { ColumnDef } from '@tanstack/react-table';
import type { Doc } from '@workspace/backend/dataModel';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { MailOpen, MailX } from 'lucide-react';
import { formatRelativeTime } from './format-relative-time';

type Lead = Doc<'leads'>;

const EM_DASH = '—';

export function getLeadColumns(
	onToggleRead: (lead: Lead, read: boolean) => void
): ColumnDef<Lead>[] {
	return [
		{
			id: 'status',
			header: 'Received',
			size: 160,
			cell: ({ row }) => {
				const isRead = row.original.read === true;
				return (
					<div className="flex items-center gap-2">
						<span
							aria-label={isRead ? 'Read' : 'New'}
							className={cn(
								'size-2.5 shrink-0 rounded-full',
								isRead ? 'bg-green-500' : 'bg-red-500'
							)}
							role="img"
						/>
						<span className="whitespace-nowrap text-muted-foreground text-sm">
							{formatRelativeTime(row.original.createdAt)}
						</span>
					</div>
				);
			},
		},
		{
			id: 'from',
			header: 'From',
			size: 240,
			cell: ({ row }) => {
				const name =
					`${row.original.firstName} ${row.original.lastName}`.trim();
				return (
					<div className="flex flex-col gap-0.5">
						<span
							className={cn(
								'font-medium',
								row.original.read && 'text-muted-foreground'
							)}
						>
							{name || EM_DASH}
						</span>
						<a
							className="text-primary text-sm hover:underline"
							href={`mailto:${row.original.email}`}
						>
							{row.original.email || EM_DASH}
						</a>
						{row.original.phone ? (
							<span className="text-muted-foreground text-sm">
								{row.original.phone}
							</span>
						) : null}
					</div>
				);
			},
		},
		{
			accessorKey: 'message',
			header: 'Message',
			cell: ({ row }) => (
				<p className="whitespace-normal break-words text-muted-foreground text-sm">
					{row.original.message || EM_DASH}
				</p>
			),
		},
		{
			id: 'actions',
			header: '',
			size: 150,
			cell: ({ row }) => {
				const isRead = row.original.read === true;
				return (
					<div className="flex justify-end">
						<Button
							onClick={() => onToggleRead(row.original, !isRead)}
							size="sm"
							type="button"
							variant="outline"
						>
							{isRead ? (
								<>
									<MailX />
									Mark as unread
								</>
							) : (
								<>
									<MailOpen />
									Mark as read
								</>
							)}
						</Button>
					</div>
				);
			},
		},
	];
}
