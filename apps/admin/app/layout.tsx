import type { Metadata } from 'next';
import { Raleway } from 'next/font/google';

import '@workspace/ui/globals.css';
import { cn } from '@workspace/ui/lib/utils';
import Footer from '@/components/footer';
import Header from '@/components/header';
import Providers from '@/components/providers';

const raleway = Raleway({ variable: '--font-sans' });

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
			<body className={cn(raleway.className, 'min-h-screen')}>
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
