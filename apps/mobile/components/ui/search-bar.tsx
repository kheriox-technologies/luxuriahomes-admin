import { Search, X } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { CenteredTextInput } from '@/components/ui/centered-text-input';

export function SearchBar({
	value,
	onChangeText,
	placeholder = 'Search',
}: {
	value: string;
	onChangeText: (text: string) => void;
	placeholder?: string;
}) {
	const colors = useThemeColors();
	return (
		<View className="h-9 flex-row items-center gap-2 rounded-xl border border-border bg-card px-3">
			<Search color={colors.mutedForeground} size={18} strokeWidth={2} />
			<CenteredTextInput
				accessibilityLabel={placeholder}
				autoCapitalize="none"
				autoCorrect={false}
				onChangeText={onChangeText}
				placeholder={placeholder}
				returnKeyType="search"
				value={value}
			/>
			{value.length > 0 && (
				<Pressable
					accessibilityLabel="Clear search"
					accessibilityRole="button"
					hitSlop={8}
					onPress={() => onChangeText('')}
				>
					<X color={colors.mutedForeground} size={18} strokeWidth={2} />
				</Pressable>
			)}
		</View>
	);
}
