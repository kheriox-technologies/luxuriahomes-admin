import { api } from '@workspace/backend/api';
import { useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';

const UNREAD_BADGE_CAP = 9;

export function NotificationBell() {
	const router = useRouter();
	const colors = useThemeColors();
	const count = useQuery(api.notifications.unreadCount.unreadCount, {});
	const hasUnread = count !== undefined && count > 0;
	const label =
		count && count > UNREAD_BADGE_CAP
			? `${UNREAD_BADGE_CAP}+`
			: `${count ?? ''}`;

	return (
		<Pressable
			accessibilityLabel={
				hasUnread ? `Notifications, ${count} unread` : 'Notifications'
			}
			accessibilityRole="button"
			className="h-10 w-10 items-center justify-center rounded-full border border-border bg-card"
			hitSlop={4}
			onPress={() => router.push('/(app)/notifications')}
		>
			<Bell color={colors.foreground} size={20} strokeWidth={2} />
			{hasUnread ? (
				<View className="absolute -top-1 -right-1 h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1">
					<Text className="font-sans-bold text-[10px] text-white">{label}</Text>
				</View>
			) : null}
		</Pressable>
	);
}
