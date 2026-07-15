import { useClerk } from '@clerk/clerk-expo';
import { AlertTriangle, CircleX } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '@/components/theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DEFAULT_ERROR, ERROR_CODES, type ErrorCode } from '@/lib/error-codes';
import { semantic } from '@/lib/theme';

// Full-screen error state keyed by an error code. Mirrors the portal's
// centered-card error screen (apps/portal/app/(centered)/error/page.tsx),
// rebuilt with the mobile design system.
export function ErrorScreen({ code }: { code?: ErrorCode }) {
	const { signOut } = useClerk();
	const insets = useSafeAreaInsets();
	const colors = useThemeColors();

	const details = (code && ERROR_CODES[code]) || DEFAULT_ERROR;
	const isWarning = details.level === 'warning';
	const Icon = isWarning ? AlertTriangle : CircleX;
	const iconColor = isWarning ? semantic.warning : colors.destructive;

	return (
		<View
			className="flex-1 items-center justify-center bg-background px-6"
			style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
		>
			<Card className="w-full max-w-md items-center gap-4 p-6">
				<View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
					<Icon color={iconColor} size={30} strokeWidth={1.75} />
				</View>
				<Text className="text-center font-sans-bold text-foreground text-xl">
					{details.title}
				</Text>
				<Text className="text-center font-sans text-muted-foreground text-sm">
					{details.message}
				</Text>
				<Button className="mt-2 w-full" onPress={() => signOut()}>
					Sign out
				</Button>
			</Card>
		</View>
	);
}
