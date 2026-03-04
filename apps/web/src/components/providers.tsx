'use client';

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
				<AnchoredToastProvider>{children}</AnchoredToastProvider>
			</ToastProvider>
		</ThemeProvider>
	);
}
