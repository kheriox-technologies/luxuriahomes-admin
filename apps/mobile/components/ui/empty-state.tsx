import type { LucideIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';

export function EmptyState({
	icon: Icon,
	title,
	description,
}: {
	icon: LucideIcon;
	title: string;
	description?: string;
}) {
	const colors = useThemeColors();
	return (
		<View className="flex-1 items-center justify-center gap-3 px-8 py-16">
			<View className="h-14 w-14 items-center justify-center rounded-full bg-muted">
				<Icon color={colors.mutedForeground} size={26} strokeWidth={1.75} />
			</View>
			<Text className="text-center font-sans-semibold text-base text-foreground">
				{title}
			</Text>
			{description ? (
				<Text className="text-center font-sans text-muted-foreground text-sm">
					{description}
				</Text>
			) : null}
		</View>
	);
}
