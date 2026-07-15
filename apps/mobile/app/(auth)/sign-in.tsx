import {
	isClerkAPIResponseError,
	useAuth,
	useSignIn,
	useSSO,
} from '@clerk/clerk-expo';
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

// How long a lingering Clerk session may sit on the sign-in screen before we
// treat it as stale and clear it. A freshly-created session (e.g. just after
// MFA) makes Convex authenticate and unmount this screen well within this
// window, so the timer is cleared before it can reap a valid session; only a
// genuinely dead/timed-out session survives long enough to be signed out.
const STALE_SESSION_GRACE_MS = 4000;

// Clerk throws this code when a session already exists on the client (single-
// session mode). It surfaces on the sign-in screen when a timed-out session
// hasn't been cleared from the Clerk client yet.
function isSessionExistsError(err: unknown): boolean {
	return (
		isClerkAPIResponseError(err) &&
		err.errors.some((e) => e.code === 'session_exists')
	);
}

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
	const { isLoaded: authLoaded, isSignedIn, signOut } = useAuth();

	// This screen only renders when Convex is unauthenticated. If Clerk still
	// holds a session here it's usually a timed-out/stale one that blocks a fresh
	// SSO flow (single-session mode → `session_exists`) — clear it so the next tap
	// works without an app restart.
	//
	// But right after a successful login (including MFA) Clerk flips `isSignedIn`
	// to true while Convex is still authenticating, and this screen can briefly
	// (re)mount in that window. Signing out immediately would destroy that valid
	// new session and bounce the user back here. So we wait out a grace period: a
	// real session makes Convex authenticate and unmount this screen (clearing the
	// timer) before it fires; only a dead session survives long enough to be reaped.
	useEffect(() => {
		if (!(authLoaded && isSignedIn)) {
			return;
		}
		const timer = setTimeout(() => {
			signOut();
		}, STALE_SESSION_GRACE_MS);
		return () => clearTimeout(timer);
	}, [authLoaded, isSignedIn, signOut]);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState<string | null>(null);
	const [emailLoading, setEmailLoading] = useState(false);
	const [googleLoading, setGoogleLoading] = useState(false);

	// Second step for Clerk's email-code verification (MFA). `factorKind` records
	// whether the code satisfies a first- or second-factor challenge so the verify
	// handler calls the matching attempt method.
	const [step, setStep] = useState<'credentials' | 'verify'>('credentials');
	const [factorKind, setFactorKind] = useState<'first' | 'second'>('second');
	const [code, setCode] = useState('');
	const [codeLoading, setCodeLoading] = useState(false);

	const onGooglePress = useCallback(async () => {
		setError(null);
		setGoogleLoading(true);
		try {
			const {
				createdSessionId,
				setActive: setActiveSso,
				signIn: ssoSignIn,
				signUp: ssoSignUp,
			} = await startSSOFlow({
				strategy: 'oauth_google',
				redirectUrl: makeRedirectUri({
					scheme: 'luxuriahomes',
					path: 'sso-callback',
				}),
			});
			// On re-login after sign-out, Clerk can complete the flow without a
			// top-level createdSessionId — the session id lives on signIn/signUp.
			const sessionId =
				createdSessionId ??
				ssoSignIn?.createdSessionId ??
				ssoSignUp?.createdSessionId;
			if (sessionId && setActiveSso) {
				await setActiveSso({ session: sessionId });
				router.replace('/');
			} else {
				setError('Google sign-in did not complete. Please try again.');
			}
		} catch (err) {
			// A stale/timed-out session can still slip through (e.g. mid-refresh).
			// Clear it so the user's next tap starts from a clean state.
			if (isSessionExistsError(err)) {
				await signOut();
				setError('Please tap Continue with Google again.');
			} else {
				setError('Google sign-in failed. Please try again.');
			}
		} finally {
			setGoogleLoading(false);
		}
	}, [router, signOut, startSSOFlow]);

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
				router.replace('/');
				return;
			}
			if (attempt.status === 'needs_second_factor') {
				const factor = attempt.supportedSecondFactors?.find(
					(f) => f.strategy === 'email_code'
				);
				if (factor) {
					await signIn.prepareSecondFactor({
						strategy: 'email_code',
						emailAddressId: factor.emailAddressId,
					});
					setFactorKind('second');
					setCode('');
					setStep('verify');
					return;
				}
			}
			if (attempt.status === 'needs_first_factor') {
				const factor = attempt.supportedFirstFactors?.find(
					(f) => f.strategy === 'email_code'
				);
				if (factor) {
					await signIn.prepareFirstFactor({
						strategy: 'email_code',
						emailAddressId: factor.emailAddressId,
					});
					setFactorKind('first');
					setCode('');
					setStep('verify');
					return;
				}
			}
			setError('Additional verification required. Use the web portal.');
		} catch (err) {
			if (isClerkAPIResponseError(err)) {
				setError(err.errors.at(0)?.longMessage ?? 'Invalid email or password.');
			} else {
				setError('Invalid email or password.');
			}
		} finally {
			setEmailLoading(false);
		}
	}, [email, isLoaded, password, router, setActive, signIn]);

	const onVerifyPress = useCallback(async () => {
		if (!(isLoaded && code)) {
			return;
		}
		setError(null);
		setCodeLoading(true);
		try {
			const attempt =
				factorKind === 'second'
					? await signIn.attemptSecondFactor({ strategy: 'email_code', code })
					: await signIn.attemptFirstFactor({ strategy: 'email_code', code });
			if (attempt.status === 'complete') {
				await setActive({ session: attempt.createdSessionId });
				router.replace('/');
			} else {
				setError('That code was not accepted. Please try again.');
			}
		} catch (err) {
			if (isClerkAPIResponseError(err)) {
				setError(err.errors.at(0)?.longMessage ?? 'Incorrect code.');
			} else {
				setError('Incorrect code. Please try again.');
			}
		} finally {
			setCodeLoading(false);
		}
	}, [code, factorKind, isLoaded, router, setActive, signIn]);

	const onUseDifferentAccount = useCallback(() => {
		setStep('credentials');
		setCode('');
		setPassword('');
		setError(null);
	}, []);

	return (
		<View
			className="flex-1 bg-primary-foreground"
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
				</Animated.View>

				<Animated.View
					className="gap-4 rounded-2xl border border-ink/10 bg-white/60 p-5"
					entering={FadeInDown.delay(120).duration(500)}
				>
					{step === 'verify' ? (
						<>
							<View className="gap-1.5">
								<Text className="font-sans-medium text-ink/70 text-sm">
									Enter the code sent to {email}
								</Text>
								<TextInput
									accessibilityLabel="Verification code"
									autoComplete="one-time-code"
									className="min-h-[48px] rounded-lg border border-ink/15 bg-white px-4 text-center font-sans text-base text-ink tracking-[8px]"
									inputMode="numeric"
									keyboardType="number-pad"
									maxLength={6}
									onChangeText={setCode}
									onSubmitEditing={onVerifyPress}
									placeholder="000000"
									placeholderTextColor="rgba(43,41,39,0.4)"
									value={code}
								/>
							</View>

							{error ? (
								<Text
									accessibilityRole="alert"
									className="font-sans text-destructive text-sm"
								>
									{error}
								</Text>
							) : null}

							<Button
								className="active:opacity-90"
								disabled={!code}
								loading={codeLoading}
								onPress={onVerifyPress}
								variant="primary"
							>
								<Text className="font-sans-semibold text-base text-primary-foreground">
									Verify
								</Text>
							</Button>

							<Button onPress={onUseDifferentAccount} variant="ghost">
								<Text className="font-sans-semibold text-base text-ink/70">
									Use a different account
								</Text>
							</Button>
						</>
					) : (
						<>
							<View className="gap-1.5">
								<Text className="font-sans-medium text-ink/70 text-sm">
									Email
								</Text>
								<TextInput
									accessibilityLabel="Email"
									autoCapitalize="none"
									autoComplete="email"
									className="min-h-[48px] rounded-lg border border-ink/15 bg-white px-4 font-sans text-base text-ink"
									inputMode="email"
									onChangeText={setEmail}
									placeholder="you@example.com"
									placeholderTextColor="rgba(43,41,39,0.4)"
									value={email}
								/>
							</View>
							<View className="gap-1.5">
								<Text className="font-sans-medium text-ink/70 text-sm">
									Password
								</Text>
								<TextInput
									accessibilityLabel="Password"
									autoComplete="current-password"
									className="min-h-[48px] rounded-lg border border-ink/15 bg-white px-4 font-sans text-base text-ink"
									onChangeText={setPassword}
									onSubmitEditing={onEmailPress}
									placeholder="••••••••"
									placeholderTextColor="rgba(43,41,39,0.4)"
									secureTextEntry
									value={password}
								/>
							</View>

							{error ? (
								<Text
									accessibilityRole="alert"
									className="font-sans text-destructive text-sm"
								>
									{error}
								</Text>
							) : null}

							<Button
								className="active:opacity-90"
								disabled={!(email && password)}
								loading={emailLoading}
								onPress={onEmailPress}
								variant="primary"
							>
								<Text className="font-sans-semibold text-base text-primary-foreground">
									Sign in
								</Text>
							</Button>

							<View className="flex-row items-center gap-3 py-1">
								<View className="h-px flex-1 bg-ink/15" />
								<Text className="font-sans text-ink/50 text-xs">or</Text>
								<View className="h-px flex-1 bg-ink/15" />
							</View>

							<Button
								className="border-ink/15 bg-white"
								loading={googleLoading}
								onPress={onGooglePress}
								variant="secondary"
							>
								<Text
									className="font-sans-semibold text-base"
									style={{ color: brand.ink }}
								>
									Continue with Google
								</Text>
							</Button>
						</>
					)}
				</Animated.View>
			</KeyboardAvoidingView>
		</View>
	);
}
