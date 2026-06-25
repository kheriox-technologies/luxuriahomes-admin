import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';
import Providers from '@/components/providers';

const inter = Inter({ variable: '--font-sans' });

export const metadata: Metadata = {
	title: 'Web Application',
	description: 'Web Application',
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(inter.className, 'min-h-screen')}>
				<Providers>
					<div className="flex h-screen flex-col overflow-hidden">
						<main className="min-h-0 flex-1 overflow-auto">{children}</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
