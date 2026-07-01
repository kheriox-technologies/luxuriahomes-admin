import { env } from '@workspace/env/web';
import '@workspace/ui/globals.css';
import './site.css';
import { cn } from '@workspace/ui/lib/utils';
import type { Metadata } from 'next';
import { Cinzel, Inter } from 'next/font/google';
import { SiteFooter } from '@/components/layout/site-footer';
import { SiteHeader } from '@/components/layout/site-header';
import { PaletteSwitcher } from '@/components/palette-switcher';
import Providers from '@/components/providers';
import { paletteVarsForKey } from '@/lib/palettes';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_WEB_URL),
	title: {
		default: 'Luxuria Homes Australia | Luxury Home Builders',
		template: '%s | Luxuria Homes Australia',
	},
	description:
		'Luxuria Homes Australia crafts unparalleled luxury living spaces — custom homes, house & land packages, knock-down rebuilds, duplexes and town houses across South East Queensland.',
	openGraph: {
		title: 'Luxuria Homes Australia | Luxury Home Builders',
		description:
			'Designing dreams, building lifestyles. Where elegance meets construction excellence.',
		url: env.NEXT_PUBLIC_WEB_URL,
		siteName: 'Luxuria Homes Australia',
		type: 'website',
	},
};

type RootLayoutProps = Readonly<{ children: React.ReactNode }>;

export default function RootLayout({ children }: RootLayoutProps) {
	// Persisted brand palette, baked in server-side so it shows on first paint
	// with no flash. Unset falls back to the defaults in app/site.css.
	const palette = paletteVarsForKey(env.NEXT_PUBLIC_BRAND_PALETTE);
	// The palette switcher is a dev-only preview tool; hide it in production.
	const showPaletteSwitcher = env.ENV !== 'prod';

	return (
		<html
			className="light"
			data-palette-tone={palette?.tone}
			lang="en"
			style={palette?.vars as React.CSSProperties | undefined}
		>
			<body
				className={cn(
					inter.variable,
					cinzel.variable,
					inter.className,
					'min-h-screen bg-background text-foreground antialiased'
				)}
			>
				<Providers>
					<div className="flex min-h-screen flex-col">
						<SiteHeader />
						<main className="flex-1">{children}</main>
						<SiteFooter />
					</div>
					{showPaletteSwitcher ? <PaletteSwitcher /> : null}
				</Providers>
			</body>
		</html>
	);
}
