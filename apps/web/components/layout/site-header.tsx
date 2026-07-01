'use client';

import { Button } from '@workspace/ui/components/button';
import {
	Sheet,
	SheetClose,
	SheetPopup,
	SheetTitle,
	SheetTrigger,
} from '@workspace/ui/components/sheet';
import { cn } from '@workspace/ui/lib/utils';
import { Menu, Phone } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PHONES, telHref } from '@/lib/contact';
import { NAV_LINKS } from '@/lib/site';
import { BrandLogo } from './brand-logo';
import { TopContactBar } from './top-contact-bar';

function isActive(pathname: string, href: string): boolean {
	if (href === '/') {
		return pathname === '/';
	}
	return pathname === href || pathname.startsWith(`${href}/`);
}

function Logo({ onClick }: { onClick?: () => void }) {
	return (
		<Link
			aria-label="Luxuria Homes — home"
			className="flex shrink-0 items-center"
			href="/"
			onClick={onClick}
		>
			<BrandLogo className="h-16 text-white" />
		</Link>
	);
}

export function SiteHeader() {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	return (
		<header className="sticky top-0 z-50">
			<TopContactBar />
			<div
				className={cn(
					'bg-brand-primary transition-shadow duration-300',
					scrolled && 'shadow-black/20 shadow-lg'
				)}
			>
				<div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
					<Logo />

					<nav className="hidden items-center gap-8 lg:flex">
						{NAV_LINKS.map((link) => {
							const active = isActive(pathname, link.href);
							return (
								<Link
									className={cn(
										'relative font-medium text-sm tracking-wide transition-colors',
										'after:absolute after:-bottom-1.5 after:left-0 after:h-px after:bg-brand-accent after:transition-all after:duration-300',
										active
											? 'text-brand-surface after:w-full'
											: 'text-white/80 after:w-0 hover:text-brand-surface hover:after:w-full'
									)}
									href={link.href}
									key={link.href}
								>
									{link.label}
								</Link>
							);
						})}
					</nav>

					<div className="flex items-center gap-3">
						<Button
							className="hidden bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90 sm:inline-flex"
							render={<Link href="/contact" />}
							size="lg"
						>
							Build With Us
						</Button>

						<Sheet onOpenChange={setOpen} open={open}>
							<SheetTrigger
								render={
									<Button
										aria-label="Open menu"
										className="border-white/20 bg-transparent text-white hover:bg-white/10 lg:hidden"
										size="icon-lg"
										variant="outline"
									/>
								}
							>
								<Menu />
							</SheetTrigger>
							<SheetPopup
								className="bg-brand-primary text-white"
								closeProps={{ className: 'text-white hover:bg-white/10' }}
								side="right"
							>
								<div className="flex flex-col gap-8 p-8">
									<SheetTitle className="text-brand-surface">Menu</SheetTitle>
									<nav className="flex flex-col gap-1">
										{NAV_LINKS.map((link) => {
											const active = isActive(pathname, link.href);
											return (
												<SheetClose
													key={link.href}
													render={
														<Link
															className={cn(
																'rounded-lg px-4 py-3 font-display text-lg tracking-wide transition-colors',
																active
																	? 'bg-white/10 text-brand-surface'
																	: 'text-white/85 hover:bg-white/5 hover:text-brand-surface'
															)}
															href={link.href}
														/>
													}
												>
													{link.label}
												</SheetClose>
											);
										})}
									</nav>
									<div className="flex flex-col gap-3 border-white/10 border-t pt-6">
										<Button
											className="bg-brand-accent text-brand-accent-foreground hover:bg-brand-accent/90"
											render={<Link href="/contact" />}
											size="lg"
										>
											Build With Us
										</Button>
										<div className="flex flex-wrap items-center gap-2 text-sm text-white/80">
											<Phone className="size-4 opacity-80" />
											{PHONES.map((phone, index) => (
												<span className="flex items-center gap-2" key={phone}>
													{index > 0 ? (
														<span className="text-white/30">·</span>
													) : null}
													<a
														className="transition-colors hover:text-brand-surface"
														href={telHref(phone)}
													>
														{phone}
													</a>
												</span>
											))}
										</div>
									</div>
								</div>
							</SheetPopup>
						</Sheet>
					</div>
				</div>
			</div>
		</header>
	);
}
