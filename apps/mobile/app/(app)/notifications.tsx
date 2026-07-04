import { api } from '@workspace/backend/api';
import type { Doc } from '@workspace/backend/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Bell, CheckCheck } from 'lucide-react-native';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { PressableCard } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { ListSkeleton } from '@/components/ui/skeleton';
import { formatNotificationTime } from '@/lib/format-notification-time';

type Notification = Doc<'notifications'>;

function NotificationCard({
	notification,
	onPress,
}: {
	notification: Notification;
	onPress: () => void;
}) {
	const { message, fromName, fromEmail, read, _creationTime } = notification;
	const from = fromEmail ? `${fromName} · ${fromEmail}` : fromName;
	return (
		<PressableCard
			accessibilityLabel={`Notification from ${fromName}. ${read ? 'Read' : 'Unread'}. Tap to mark as read.`}
			className="mx-4 mb-3 gap-1.5 p-4"
			onPress={onPress}
		>
			<View className="flex-row items-start gap-2">
				{read ? null : (
					<View className="mt-1.5 h-2 w-2 rounded-full bg-destructive" />
				)}
				<Text
					className={
						read
							? 'flex-1 font-sans text-muted-foreground text-sm'
							: 'flex-1 font-sans-medium text-foreground text-sm'
					}
				>
					{message}
				</Text>
			</View>
			<Text
				className="font-sans text-muted-foreground text-xs"
				numberOfLines={1}
			>
				{from}
			</Text>
			<Text className="font-sans text-muted-foreground text-xs">
				{formatNotificationTime(_creationTime)}
			</Text>
		</PressableCard>
	);
}

export default function NotificationsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const notifications = useQuery(api.notifications.list.list, {});
	const markRead = useMutation(api.notifications.markRead.markRead);
	const markAllRead = useMutation(api.notifications.markAllRead.markAllRead);

	const unreadCount = notifications?.filter((item) => !item.read).length ?? 0;
	const hasUnread = unreadCount > 0;

	return (
		<View className="flex-1 bg-background">
			<View
				className="flex-row items-center gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<Pressable
					accessibilityLabel="Back"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
					hitSlop={4}
					onPress={() => router.back()}
				>
					<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<View className="flex-1">
					<Text className="font-sans-bold text-2xl text-foreground">
						Notifications
					</Text>
					{hasUnread ? (
						<Text className="font-sans text-muted-foreground text-sm">
							{unreadCount} unread
						</Text>
					) : null}
				</View>
				{hasUnread ? (
					<Pressable
						accessibilityLabel="Mark all as read"
						accessibilityRole="button"
						className="h-10 flex-row items-center gap-1.5 rounded-full border border-border bg-card px-3"
						hitSlop={4}
						onPress={() => markAllRead({})}
					>
						<CheckCheck color={colors.foreground} size={16} strokeWidth={2} />
						<Text className="font-sans-medium text-foreground text-sm">
							All read
						</Text>
					</Pressable>
				) : null}
			</View>

			{notifications === undefined ? (
				<ListSkeleton />
			) : (
				<FlatList
					contentContainerClassName="pb-6"
					data={notifications}
					keyExtractor={(item) => item._id}
					ListEmptyComponent={
						<EmptyState
							description="New notifications will appear here."
							icon={Bell}
							title="You're all caught up"
						/>
					}
					renderItem={({ item }) => (
						<NotificationCard
							notification={item}
							onPress={() => {
								if (!item.read) {
									markRead({ notificationId: item._id });
								}
							}}
						/>
					)}
				/>
			)}
		</View>
	);
}
