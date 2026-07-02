'use client';

import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Menu, MenuPopup, MenuTrigger } from '@workspace/ui/components/menu';
import { toastManager } from '@workspace/ui/components/toast';
import { useMutation, useQuery } from 'convex/react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import { getConvexErrorMessage } from '@/lib/convex-errors';
import { formatNotificationTime } from './format-notification-time';

const UNREAD_BADGE_CAP = 9;

type Notification = Doc<'notifications'>;

export default function NotificationBell() {
	const unreadCount = useQuery(api.notifications.unreadCount.unreadCount, {});
	const unread = useQuery(api.notifications.listUnread.listUnread, {});
	const markRead = useMutation(api.notifications.markRead.markRead);
	const markAllRead = useMutation(api.notifications.markAllRead.markAllRead);

	const count = unreadCount ?? 0;
	const hasUnread = count > 0;
	const badgeLabel = count > UNREAD_BADGE_CAP ? `${UNREAD_BADGE_CAP}+` : count;

	const onNotificationClick = async (notification: Notification) => {
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
		if (notification.link) {
			window.open(notification.link, '_blank', 'noopener');
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

	return (
		<Menu>
			<MenuTrigger
				render={
					<Button
						aria-label="Notifications"
						className="relative"
						size="icon"
						type="button"
						variant="ghost"
					/>
				}
			>
				<Bell />
				{hasUnread ? (
					<Badge
						className="absolute -top-1 -right-1 px-1"
						size="sm"
						variant="destructive"
					>
						{badgeLabel}
					</Badge>
				) : null}
			</MenuTrigger>
			<MenuPopup align="end" className="w-96 max-w-[calc(100vw-2rem)]">
				<div className="flex items-center justify-between gap-2 px-2 py-1.5">
					<span className="font-medium text-sm">Notifications</span>
					{hasUnread ? (
						<Button
							onClick={onMarkAllRead}
							size="sm"
							type="button"
							variant="ghost"
						>
							Mark all as read
						</Button>
					) : null}
				</div>
				<div className="my-1 h-px bg-border" />
				<div className="max-h-96 overflow-y-auto">
					{unread === undefined && (
						<div className="px-2 py-6 text-center text-muted-foreground text-sm">
							Loading…
						</div>
					)}
					{unread !== undefined && unread.length === 0 && (
						<div className="px-2 py-6 text-center text-muted-foreground text-sm">
							You're all caught up.
						</div>
					)}
					{unread?.map((notification) => (
						<button
							className="flex w-full flex-col gap-1 rounded-sm px-2 py-2 text-left hover:bg-accent"
							key={notification._id}
							onClick={() => onNotificationClick(notification)}
							type="button"
						>
							<span className="text-sm">{notification.message}</span>
							<span className="text-muted-foreground text-xs">
								{notification.fromName}
								{notification.fromEmail ? ` · ${notification.fromEmail}` : ''}
							</span>
							<span className="text-muted-foreground text-xs">
								{formatNotificationTime(notification._creationTime)}
							</span>
						</button>
					))}
				</div>
				<div className="my-1 h-px bg-border" />
				<Link
					className="flex justify-center rounded-sm px-2 py-2 text-primary text-sm hover:bg-accent"
					href="/notifications"
				>
					View All Notifications
				</Link>
			</MenuPopup>
		</Menu>
	);
}
