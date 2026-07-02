'use client';
// React Compiler can't track mutations on the TanStack Table instance (setOptions during render).
'use no memo';

import type { ColumnDef } from '@tanstack/react-table';
import { api } from '@workspace/backend/api';
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
import { toastManager } from '@workspace/ui/components/toast';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@workspace/ui/components/toggle-group';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import { Bell, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import PageHeading from '@/components/page-heading';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { formatNotificationTime } from './format-notification-time';

type Notification = Doc<'notifications'>;
type NotificationFilter = 'all' | 'unread';

function buildColumns(
	onMarkRead: (notification: Notification) => void
): ColumnDef<Notification>[] {
	return [
		{
			id: 'status',
			header: 'Status',
			size: 80,
			cell: ({ row }) =>
				row.original.read ? (
					<Badge size="lg" variant="outline">
						Read
					</Badge>
				) : (
					<Badge size="lg" variant="info">
						Unread
					</Badge>
				),
		},
		{
			accessorKey: 'message',
			header: 'Notification',
			cell: ({ row }) => (
				<span
					className={cn(
						'text-sm',
						row.original.read ? 'text-muted-foreground' : 'font-medium'
					)}
				>
					{row.original.message}
				</span>
			),
		},
		{
			id: 'from',
			header: 'From',
			cell: ({ row }) => (
				<div className="flex flex-col">
					<span className="text-sm">{row.original.fromName}</span>
					{row.original.fromEmail ? (
						<span className="text-muted-foreground text-xs">
							{row.original.fromEmail}
						</span>
					) : null}
				</div>
			),
		},
		{
			id: 'received',
			header: 'Received',
			cell: ({ row }) => (
				<span className="text-muted-foreground text-sm">
					{formatNotificationTime(row.original._creationTime)}
				</span>
			),
		},
		{
			id: 'link',
			header: 'Link',
			cell: ({ row }) =>
				row.original.link ? (
					<a
						className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
						href={row.original.link}
						rel="noopener noreferrer"
						target="_blank"
					>
						<ExternalLink className="size-3 shrink-0" />
						<span>Open</span>
					</a>
				) : null,
		},
		{
			id: 'actions',
			header: '',
			size: 80,
			cell: ({ row }) =>
				row.original.read ? null : (
					<div className="flex justify-end">
						<Button
							onClick={() => onMarkRead(row.original)}
							size="sm"
							type="button"
							variant="outline"
						>
							Mark as read
						</Button>
					</div>
				),
		},
	];
}

function EmptyNotificationsState({ filter }: { filter: NotificationFilter }) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Bell aria-hidden />
				</EmptyMedia>
				<EmptyTitle>
					{filter === 'unread' ? 'No unread notifications' : 'No notifications'}
				</EmptyTitle>
				<EmptyDescription>
					{filter === 'unread'
						? 'You have read all of your notifications.'
						: 'Notifications from the client portal will appear here.'}
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function NotificationsPageContent() {
	const [filter, setFilter] = useState<NotificationFilter>('all');
	const notifications = useQuery(api.notifications.list.list, {});
	const markRead = useMutation(api.notifications.markRead.markRead);
	const markAllRead = useMutation(api.notifications.markAllRead.markAllRead);

	const onMarkRead = async (notification: Notification) => {
		try {
			await markRead({ notificationId: notification._id });
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update the notification. Please try again in a moment.'
				),
				title: 'Could not mark as read',
				type: 'error',
			});
		}
	};

	const onMarkAllRead = async () => {
		try {
			await markAllRead({});
		} catch (error) {
			toastManager.add({
				description: getConvexErrorMessage(
					error,
					'Could not update notifications. Please try again in a moment.'
				),
				title: 'Could not mark all as read',
				type: 'error',
			});
		}
	};

	const onFilterChange = (next: string[]) => {
		const value = next.at(-1);
		if (value === 'all' || value === 'unread') {
			setFilter(value);
		}
	};

	const columns = buildColumns(onMarkRead);

	let filtered: Notification[] | undefined;
	if (notifications === undefined) {
		filtered = undefined;
	} else if (filter === 'unread') {
		filtered = notifications.filter((notification) => !notification.read);
	} else {
		filtered = notifications;
	}

	const hasUnread = notifications?.some((notification) => !notification.read);

	let content: React.ReactNode;
	if (filtered === undefined) {
		content = (
			<div className="text-muted-foreground text-sm">
				Loading notifications…
			</div>
		);
	} else if (filtered.length === 0) {
		content = <EmptyNotificationsState filter={filter} />;
	} else {
		content = <DataTable columns={columns} data={filtered} key={filter} />;
	}

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Notifications"
				icon={Bell}
				rightSlot={
					hasUnread ? (
						<Button onClick={onMarkAllRead} type="button" variant="outline">
							Mark all as read
						</Button>
					) : null
				}
			/>
			<ToggleGroup
				aria-label="Filter notifications"
				onValueChange={onFilterChange}
				value={[filter]}
				variant="outline"
			>
				<ToggleGroupItem value="all">All</ToggleGroupItem>
				<ToggleGroupItem value="unread">Unread</ToggleGroupItem>
			</ToggleGroup>
			{content}
		</div>
	);
}
