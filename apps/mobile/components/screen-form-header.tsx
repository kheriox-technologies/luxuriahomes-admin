import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';

/** Header with a back button + title for pushed full-screen forms. */
export function ScreenFormHeader({ title }: { title: string }) {
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();
	const router = useRouter();
	return (
		<View
			className="flex-row items-center gap-3 bg-background px-4 pb-3"
			style={{ paddingTop: insets.top + 8 }}
		>
			<Pressable
				accessibilityLabel="Go back"
				accessibilityRole="button"
				className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
				hitSlop={4}
				onPress={() => router.back()}
			>
				<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
			</Pressable>
			<Text
				className="flex-1 font-sans-bold text-foreground text-xl"
				numberOfLines={1}
			>
				{title}
			</Text>
		</View>
	);
}
