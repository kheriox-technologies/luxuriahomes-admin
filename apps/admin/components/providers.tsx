'use client';

import { ClerkProvider, useAuth } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { env } from '@workspace/env/admin';
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
			defaultTheme="system"
			disableTransitionOnChange
			enableSystem
		>
			<ToastProvider>
				<AnchoredToastProvider>
					<ClerkProvider
						appearance={{
							theme: dark,
							variables: { colorPrimary: env.NEXT_PUBLIC_APP_PRIMARY_COLOR },
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
