import { View } from 'react-native';
import { MenuButton } from '@/components/navigation/menu-button';
import { NotificationBell } from '@/components/notifications/notification-bell';

export function HeaderActions() {
	return (
		<View className="flex-row items-center gap-2">
			<MenuButton />
			<NotificationBell />
		</View>
	);
}
