import { useUser } from '@clerk/clerk-expo';
import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { cn } from '@/lib/cn';
import { getInitials } from '@/lib/format';

export function TabAvatarIcon({
	size,
	focused,
}: {
	size: number;
	focused: boolean;
}) {
	const { user } = useUser();
	const fullName = user?.fullName ?? 'User';
	const ringClass = focused ? 'border-2 border-primary' : 'border-0';

	if (user?.imageUrl) {
		return (
			<Image
				accessibilityLabel={`${fullName} profile photo`}
				contentFit="cover"
				source={{ uri: user.imageUrl }}
				style={{ width: size, height: size, borderRadius: size / 2 }}
			/>
		);
	}

	return (
		<View
			className={cn(
				'items-center justify-center rounded-full bg-primary',
				ringClass
			)}
			style={{ width: size, height: size }}
		>
			<Text className="font-sans-semibold text-[10px] text-primary-foreground">
				{getInitials(fullName)}
			</Text>
		</View>
	);
}
