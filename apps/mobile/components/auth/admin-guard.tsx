import { useClerk, useUser } from '@clerk/clerk-expo';
import { ShieldX } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { getRoles, isAdmin } from '@/lib/roles';
import { brand } from '@/lib/theme';

function AccessDenied() {
	const { signOut } = useClerk();
	const { user } = useUser();
	const insets = useSafeAreaInsets();

	return (
		<View
			className="flex-1 items-center justify-center gap-4 bg-primary px-8"
			style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
		>
			<View className="h-16 w-16 items-center justify-center rounded-full bg-white/10">
				<ShieldX color={brand.linen} size={30} strokeWidth={1.75} />
			</View>
			<Text className="text-center font-sans-bold text-primary-foreground text-xl">
				Access restricted
			</Text>
			<Text className="text-center font-sans text-base text-white/70">
				This app is for the Luxuria Homes builder team.
				{user?.primaryEmailAddress
					? ` ${user.primaryEmailAddress.emailAddress} does not have admin access.`
					: ''}
			</Text>
			<Button
				className="mt-4 bg-linen"
				onPress={() => signOut()}
				variant="primary"
			>
				<Text className="font-sans-semibold text-base text-ink">Sign out</Text>
			</Button>
		</View>
	);
}

export function AdminGuard({ children }: { children: ReactNode }) {
	const { user, isLoaded } = useUser();

	if (!isLoaded) {
		return null;
	}

	const roles = getRoles(user?.publicMetadata);
	if (!isAdmin(roles)) {
		return <AccessDenied />;
	}

	return <>{children}</>;
}
