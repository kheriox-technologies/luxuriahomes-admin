import { useRouter } from 'expo-router';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ClientQuotationsList } from '@/components/client-quotations/client-quotations-list';
import { useThemeColors } from '@/components/theme';

export default function QuotationsScreen() {
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	return (
		<View className="flex-1 bg-background">
			<View
				className="flex-row items-center gap-3 bg-background px-4 pb-3"
				style={{ paddingTop: insets.top + 8 }}
			>
				<Pressable
					accessibilityLabel="Back"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
					hitSlop={4}
					onPress={() => router.back()}
				>
					<ArrowLeft color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
				<Text className="flex-1 font-sans-bold text-2xl text-foreground">
					Quotations
				</Text>
				<Pressable
					accessibilityLabel="Add quotation"
					accessibilityRole="button"
					className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card active:bg-muted"
					hitSlop={4}
					onPress={() => router.push('/(app)/quotations/new')}
				>
					<Plus color={colors.foreground} size={20} strokeWidth={2} />
				</Pressable>
			</View>

			<ClientQuotationsList surface="admin" />
		</View>
	);
}
