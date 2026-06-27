import { useSignIn, useSSO } from '@clerk/clerk-expo';
import { makeRedirectUri } from 'expo-auth-session';
import { useRouter } from 'expo-router';
import {
	coolDownAsync,
	maybeCompleteAuthSession,
	warmUpAsync,
} from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	KeyboardAvoidingView,
	Platform,
	Pressable,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Required so the in-app browser can dismiss itself and return to the app after
// the OAuth redirect completes.
maybeCompleteAuthSession();

function getClerkErrorMessage(err: unknown): string {
	if (typeof err === 'object' && err !== null && 'errors' in err) {
		const { errors } = err as { errors?: Array<{ message?: string }> };
		return errors?.[0]?.message ?? 'Unable to sign in.';
	}
	return 'Unable to sign in.';
}

export default function SignInScreen() {
	const { signIn, setActive, isLoaded } = useSignIn();
	const { startSSOFlow } = useSSO();
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);
	const [oauthPending, setOauthPending] = useState(false);

	// Warm up the browser on Android for a faster OAuth handoff.
	useEffect(() => {
		warmUpAsync().catch(() => undefined);
		return () => {
			coolDownAsync().catch(() => undefined);
		};
	}, []);

	const onGoogleSignIn = useCallback(async () => {
		if (oauthPending) {
			return;
		}
		setOauthPending(true);
		setError(null);
		try {
			const { createdSessionId, setActive: setOAuthActive } =
				await startSSOFlow({
					strategy: 'oauth_google',
					redirectUrl: makeRedirectUri(),
				});
			if (createdSessionId && setOAuthActive) {
				await setOAuthActive({ session: createdSessionId });
				router.replace('/projects');
			}
		} catch (err) {
			setError(getClerkErrorMessage(err));
		} finally {
			setOauthPending(false);
		}
	}, [oauthPending, startSSOFlow, router]);

	const onSignIn = async () => {
		if (!isLoaded || submitting) {
			return;
		}
		setSubmitting(true);
		setError(null);
		try {
			const attempt = await signIn.create({ identifier: email, password });
			if (attempt.status === 'complete') {
				await setActive({ session: attempt.createdSessionId });
				router.replace('/projects');
			} else {
				setError('Additional verification is required to sign in.');
			}
		} catch (err) {
			setError(getClerkErrorMessage(err));
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SafeAreaView className="flex-1 bg-background">
			<KeyboardAvoidingView
				behavior={Platform.OS === 'ios' ? 'padding' : undefined}
				className="flex-1 justify-center px-6"
			>
				<View className="gap-2">
					<Text className="font-bold text-3xl text-foreground tracking-tight">
						Welcome back
					</Text>
					<Text className="text-base text-muted-foreground">
						Sign in to your Luxuria Homes client portal.
					</Text>
				</View>

				<View className="mt-8 gap-4">
					<Pressable
						className="flex-row items-center justify-center gap-2 rounded-md border border-input bg-card py-3.5 active:opacity-80"
						disabled={oauthPending}
						onPress={onGoogleSignIn}
					>
						{oauthPending ? (
							<ActivityIndicator />
						) : (
							<Text className="font-semibold text-base text-card-foreground">
								Continue with Google
							</Text>
						)}
					</Pressable>

					<View className="flex-row items-center gap-3">
						<View className="h-px flex-1 bg-border" />
						<Text className="text-muted-foreground text-xs uppercase">or</Text>
						<View className="h-px flex-1 bg-border" />
					</View>

					<View className="gap-1.5">
						<Text className="font-medium text-foreground text-sm">Email</Text>
						<TextInput
							autoCapitalize="none"
							autoComplete="email"
							className="rounded-md border border-input bg-card px-3 py-3 text-base text-foreground"
							keyboardType="email-address"
							onChangeText={setEmail}
							placeholder="you@example.com"
							placeholderTextColor="#737373"
							value={email}
						/>
					</View>

					<View className="gap-1.5">
						<Text className="font-medium text-foreground text-sm">
							Password
						</Text>
						<TextInput
							autoCapitalize="none"
							className="rounded-md border border-input bg-card px-3 py-3 text-base text-foreground"
							onChangeText={setPassword}
							placeholder="••••••••"
							placeholderTextColor="#737373"
							secureTextEntry
							value={password}
						/>
					</View>

					{error ? (
						<Text className="text-destructive text-sm">{error}</Text>
					) : null}

					<Pressable
						className="mt-2 items-center rounded-md bg-primary py-3.5 active:opacity-90"
						disabled={submitting || !isLoaded}
						onPress={onSignIn}
					>
						{submitting ? (
							<ActivityIndicator color="#fff0a9" />
						) : (
							<Text className="font-semibold text-base text-primary-foreground">
								Sign in
							</Text>
						)}
					</Pressable>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	);
}
