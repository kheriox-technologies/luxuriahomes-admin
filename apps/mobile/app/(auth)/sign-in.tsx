import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { makeRedirectUri } from 'expo-auth-session';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import {
	coolDownAsync,
	maybeCompleteAuthSession,
	warmUpAsync,
} from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	View,
} from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { brand } from '@/lib/theme';

maybeCompleteAuthSession();

function useWarmUpBrowser() {
	useEffect(() => {
		if (Platform.OS !== 'android') {
			return;
		}
		warmUpAsync();
		return () => {
			coolDownAsync();
		};
	}, []);
}

export default function SignInScreen() {
	useWarmUpBrowser();
	const insets = useSafeAreaInsets();
	const router = useRouter();
	const { signIn, setActive, isLoaded } = useSignIn();
	const { startSSOFlow } = useSSO();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [emailLoading, setEmailLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	const onGooglePress = useCallback(async () => {
		setError(null);
		setGoogleLoading(true);
		try {
			const { createdSessionId, setActive: setActiveSso } = await startSSOFlow({
				strategy: 'oauth_google',
				redirectUrl: makeRedirectUri({
					scheme: 'luxuriahomes',
					path: 'sso-callback',
				}),
			});
			if (createdSessionId && setActiveSso) {
				await setActiveSso({ session: createdSessionId });
				router.replace('/(app)/(tabs)/dashboard');
			}
		} catch {
			setError('Google sign-in failed. Please try again.');
		} finally {
			setGoogleLoading(false);
		}
	}, [router, startSSOFlow]);

	const onEmailPress = useCallback(async () => {
		if (!(isLoaded && email && password)) {
			return;
		}
		setError(null);
		setEmailLoading(true);
		try {
			const attempt = await signIn.create({ identifier: email, password });
			if (attempt.status === 'complete') {
				await setActive({ session: attempt.createdSessionId });
				router.replace('/(app)/(tabs)/dashboard');
			} else {
				setError('Additional verification required. Use the web portal.');
			}
		} catch {
			setError('Invalid email or password.');
		} finally {
			setEmailLoading(false);
		}
	}, [email, isLoaded, password, router, setActive, signIn]);

	return (
		<View
			className="flex-1 bg-primary"
			style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				className="flex-1 justify-center px-6"
			>
				<Animated.View
					className="items-center gap-2 pb-10"
					entering={FadeInDown.duration(500)}
				>
					<Image
						accessibilityLabel="Luxuria Homes logo"
						contentFit="contain"
						source={require('../../assets/splash-icon.png')}
						style={{ width: 180, height: 90 }}
					/>
					<Text className="font-sans text-primary-foreground/70 text-sm">
						Builder Portal
					</Text>
				</Animated.View>

				<Animated.View
					className="gap-4 rounded-2xl bg-white/5 p-5"
					entering={FadeInDown.delay(120).duration(500)}
				>
					<View className="gap-1.5">
						<Text className="font-sans-medium text-primary-foreground/80 text-sm">
							Email
						</Text>
						<TextInput
							accessibilityLabel="Email"
							autoCapitalize="none"
							autoComplete="email"
							className="min-h-[48px] rounded-lg border border-white/15 bg-white/10 px-4 font-sans text-base text-white"
							inputMode="email"
							onChangeText={setEmail}
							placeholder="you@example.com"
							placeholderTextColor="rgba(255,255,255,0.4)"
							value={email}
						/>
					</View>
					<View className="gap-1.5">
						<Text className="font-sans-medium text-primary-foreground/80 text-sm">
							Password
						</Text>
						<TextInput
							accessibilityLabel="Password"
							autoComplete="current-password"
							className="min-h-[48px] rounded-lg border border-white/15 bg-white/10 px-4 font-sans text-base text-white"
							onChangeText={setPassword}
							onSubmitEditing={onEmailPress}
							placeholder="••••••••"
							placeholderTextColor="rgba(255,255,255,0.4)"
							secureTextEntry
							value={password}
						/>
					</View>

					{error ? (
						<Text
							accessibilityRole="alert"
							className="font-sans text-red-300 text-sm"
						>
							{error}
						</Text>
					) : null}

					<Button
						className="bg-gold active:opacity-90"
						disabled={!(email && password)}
						loading={emailLoading}
						onPress={onEmailPress}
						variant="primary"
					>
						<Text className="font-sans-semibold text-base text-navy">
							Sign in
						</Text>
					</Button>

					<View className="flex-row items-center gap-3 py-1">
						<View className="h-px flex-1 bg-white/15" />
						<Text className="font-sans text-white/50 text-xs">or</Text>
						<View className="h-px flex-1 bg-white/15" />
					</View>

					<Button
						className="border-white/20 bg-white"
						loading={googleLoading}
						onPress={onGooglePress}
						variant="secondary"
					>
						<Text
							className="font-sans-semibold text-base"
							style={{ color: brand.navy }}
						>
							Continue with Google
						</Text>
					</Button>
				</Animated.View>
			</KeyboardAvoidingView>
		</View>
	);
}
