import { View } from 'react-native';
import { AvatarButton } from '@/components/navigation/avatar-button';
import { NotificationBell } from '@/components/notifications/notification-bell';

export function HeaderActions() {
	return (
		<View className="flex-row items-center gap-2">
			<AvatarButton />
			<NotificationBell />
		</View>
	);
}
