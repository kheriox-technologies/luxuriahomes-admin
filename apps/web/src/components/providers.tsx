'use client';

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { env } from '@workspace/env/web';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ComponentProps, ReactNode } from 'react';
import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast';

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
						{children}
					</ClerkProvider>
				</AnchoredToastProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}
