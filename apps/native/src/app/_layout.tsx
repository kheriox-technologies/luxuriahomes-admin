import '../global.css';

import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { env } from '@/env';
import { tokenCache } from '@/lib/token-cache';

const convex = new ConvexReactClient(env.convexUrl);

export default function RootLayout() {
	return (
		<ClerkProvider
			publishableKey={env.clerkPublishableKey}
			tokenCache={tokenCache}
		>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<SafeAreaProvider>
					<StatusBar style="auto" />
					<Slot />
				</SafeAreaProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}
