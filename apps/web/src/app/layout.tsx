import type { Metadata } from 'next';
import { Noto_Sans } from 'next/font/google';

import '@/globals.css';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Providers from '@/components/providers';
import { cn } from '@/lib/utils';

const notoSans = Noto_Sans({ variable: '--font-sans' });

export const metadata: Metadata = {
	title: 'monorepo-template',
	description: 'monorepo-template',
};

type RootLayoutProps = Readonly<{
	children: React.ReactNode;
}>;

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={cn(notoSans.className, 'min-h-screen')}>
				<Providers>
					<div className="flex h-screen flex-col overflow-hidden">
						<Header />
						<main className="min-h-0 flex-1 overflow-auto p-4">{children}</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	);
}
