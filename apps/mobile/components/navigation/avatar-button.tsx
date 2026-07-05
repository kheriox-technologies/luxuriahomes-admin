import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { useAppDrawer } from '@/components/navigation/app-drawer';
import { Avatar } from '@/components/ui/avatar';

export function AvatarButton() {
	const { user } = useUser();
	const { open } = useAppDrawer();

	const fullName = user?.fullName ?? 'User';

	return (
		<Pressable
			accessibilityLabel="Open menu"
			accessibilityRole="button"
			hitSlop={4}
			onPress={open}
		>
			{user?.imageUrl ? (
				<Image
					accessibilityLabel={`${fullName} profile photo`}
					contentFit="cover"
					source={{ uri: user.imageUrl }}
					style={{ width: 40, height: 40, borderRadius: 20 }}
				/>
			) : (
				<Avatar name={fullName} size="md" />
			)}
		</Pressable>
	);
}
