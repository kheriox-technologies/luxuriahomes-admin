import { Authenticated, AuthLoading, Unauthenticated } from 'convex/react';
import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { ClientGuard } from '@/components/auth/client-guard';
import { brand } from '@/lib/theme';

function LoadingScreen() {
	return (
		<View className="flex-1 items-center justify-center bg-primary">
			<ActivityIndicator color={brand.linen} size="large" />
		</View>
	);
}

export default function ClientLayout() {
	return (
		<>
			<AuthLoading>
				<LoadingScreen />
			</AuthLoading>
			<Unauthenticated>
				<Redirect href="/(auth)/sign-in" />
			</Unauthenticated>
			<Authenticated>
				<ClientGuard>
					<Stack screenOptions={{ headerShown: false }} />
				</ClientGuard>
			</Authenticated>
		</>
	);
}
