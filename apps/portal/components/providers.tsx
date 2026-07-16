'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { env } from '@workspace/env/portal';
import {
	AnchoredToastProvider,
	ToastProvider,
} from '@workspace/ui/components/toast';
import { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps, ReactNode } from 'react';

const convex = new ConvexReactClient(env.NEXT_PUBLIC_CONVEX_URL || '');

function ThemeProvider({
	children,
	...props
}: ComponentProps<typeof NextThemesProvider>) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export default function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="light"
			disableTransitionOnChange
			enableSystem
		>
			<ToastProvider>
				<AnchoredToastProvider>
					<ClerkProvider
						appearance={{
							layout: {
								logoImageUrl: '/logo-ink.svg',
							},
							variables: {
								colorPrimary: env.NEXT_PUBLIC_APP_PRIMARY_COLOR,
								colorPrimaryForeground:
									env.NEXT_PUBLIC_APP_PRIMARY_FOREGROUND_COLOR,
								colorBackground: '#f5ebe0',
								colorForeground: '#2b2927',
								colorInput: '#ffffff',
								colorInputForeground: '#2b2927',
								colorNeutral: '#2b2927',
								borderRadius: '0.375rem',
							},
						}}
						localization={{
							signIn: {
								start: {
									title: 'Welcome Back',
									titleCombined: 'Welcome Back',
								},
							},
							// Clerk's restricted sign-up mode returns this error when someone
							// without a provisioned account tries to log in (e.g. via Google).
							// Override the default "New sign-ups are currently restricted." with
							// friendlier, app-specific copy.
							unstable__errors: {
								not_allowed_access:
									'You do not have access to this app. Please contact your administrator.',
							},
						}}
					>
						<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
							{children}
						</ConvexProviderWithClerk>
					</ClerkProvider>
				</AnchoredToastProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}
