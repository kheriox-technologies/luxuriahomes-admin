import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ScreenHeader({
	title,
	subtitle,
	rightSlot,
}: {
	title: string;
	subtitle?: string;
	rightSlot?: ReactNode;
}) {
	const insets = useSafeAreaInsets();
	return (
		<View
			className="flex-row items-end justify-between bg-background px-4 pb-3"
			style={{ paddingTop: insets.top + 8 }}
		>
			<View className="flex-1 gap-0.5">
				<Text className="font-sans-bold text-2xl text-foreground">{title}</Text>
				{subtitle ? (
					<Text className="font-sans text-muted-foreground text-sm">
						{subtitle}
					</Text>
				) : null}
			</View>
			{rightSlot}
		</View>
	);
}
