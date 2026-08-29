import '@/lib/crypto-polyfill';
import '../global.css';

import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from '@expo-google-fonts/inter';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { ThemeProvider } from '@/components/theme';
import { env } from '@/lib/env';
import { palette } from '@/lib/theme';

const convex = new ConvexReactClient(env.convexUrl, {
	unsavedChangesWarning: false,
});

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
	const { colorScheme } = useColorScheme();
	const isDark = colorScheme === 'dark';
	const colors = palette[isDark ? 'dark' : 'light'];

	return (
		<>
			<StatusBar style={isDark ? 'light' : 'dark'} />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: colors.background },
				}}
			/>
		</>
	);
}

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
		// The quotation signature faces. Registered under the same names the PDF
		// renderer uses (`pdfFont` in the shared signature-styles registry) so a
		// signer's on-screen preview is the face the document ends up carrying.
		Caveat: require('../assets/fonts/Caveat-Regular.ttf'),
		DancingScript: require('../assets/fonts/DancingScript-Regular.ttf'),
		GreatVibes: require('../assets/fonts/GreatVibes-Regular.ttf'),
	});

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) {
		return null;
	}

	return (
		<ClerkProvider
			publishableKey={env.clerkPublishableKey}
			tokenCache={tokenCache}
		>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<ThemeProvider>
					<GestureHandlerRootView className="flex-1">
						<KeyboardProvider>
							<BottomSheetModalProvider>
								<AppNavigator />
							</BottomSheetModalProvider>
						</KeyboardProvider>
					</GestureHandlerRootView>
				</ThemeProvider>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	);
}
