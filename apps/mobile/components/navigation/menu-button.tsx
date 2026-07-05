import { Menu } from 'lucide-react-native';
import { Pressable } from 'react-native';
import { useAppDrawer } from '@/components/navigation/app-drawer';
import { useThemeColors } from '@/components/theme';

export function MenuButton() {
	const colors = useThemeColors();
	const { open } = useAppDrawer();

	return (
		<Pressable
			accessibilityLabel="Open menu"
			accessibilityRole="button"
			className="h-10 w-10 items-center justify-center rounded-lg border border-border bg-card"
			hitSlop={4}
			onPress={open}
		>
			<Menu color={colors.foreground} size={20} strokeWidth={2} />
		</Pressable>
	);
}
