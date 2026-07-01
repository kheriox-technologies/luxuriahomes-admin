import { Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import { CONTACT, PHONES, telHref } from '@/lib/contact';
import { NAV_LINKS, SERVICES } from '@/lib/site';
import { BrandLogo } from './brand-logo';

const currentYear = new Date().getFullYear();

export function SiteFooter() {
	return (
		<footer className="bg-brand-primary text-white/75">
			<div className="mx-auto max-w-7xl px-6 py-16">
				<div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
					<div className="flex flex-col gap-5">
						<BrandLogo
							className="h-10 self-start text-white"
							label="Luxuria Homes"
						/>
						<p className="max-w-sm text-sm leading-relaxed">
							Crafting unparalleled luxury living spaces across South East
							Queensland. Where elegance meets construction excellence.
						</p>
						{CONTACT.qbccLicence ? (
							<p className="text-white/50 text-xs">
								QBCC Licence {CONTACT.qbccLicence}
							</p>
						) : null}
					</div>

					<div>
						<h3 className="font-display text-brand-surface text-sm uppercase tracking-[0.2em]">
							Explore
						</h3>
						<ul className="mt-5 flex flex-col gap-3 text-sm">
							{NAV_LINKS.map((link) => (
								<li key={link.href}>
									<Link
										className="transition-colors hover:text-brand-surface"
										href={link.href}
									>
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-display text-brand-surface text-sm uppercase tracking-[0.2em]">
							Services
						</h3>
						<ul className="mt-5 flex flex-col gap-3 text-sm">
							{SERVICES.map((service) => (
								<li key={service.title}>
									<Link
										className="transition-colors hover:text-brand-surface"
										href="/contact"
									>
										{service.title}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="font-display text-brand-surface text-sm uppercase tracking-[0.2em]">
							Get in Touch
						</h3>
						<ul className="mt-5 flex flex-col gap-4 text-sm">
							<li className="flex items-start gap-3">
								<MapPin className="mt-0.5 size-4 shrink-0 text-brand-accent" />
								<span>{CONTACT.address}</span>
							</li>
							<li className="flex items-start gap-3">
								<Mail className="mt-0.5 size-4 shrink-0 text-brand-accent" />
								<a
									className="transition-colors hover:text-brand-surface"
									href={`mailto:${CONTACT.email}`}
								>
									{CONTACT.email}
								</a>
							</li>
							<li className="flex items-start gap-3">
								<Phone className="mt-0.5 size-4 shrink-0 text-brand-accent" />
								<span className="flex flex-wrap items-center gap-2">
									{PHONES.map((phone, index) => (
										<span className="flex items-center gap-2" key={phone}>
											{index > 0 ? (
												<span className="text-brand-surface/30">·</span>
											) : null}
											<a
												className="transition-colors hover:text-brand-surface"
												href={telHref(phone)}
											>
												{phone}
											</a>
										</span>
									))}
								</span>
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="border-white/10 border-t">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-white/50 text-xs sm:flex-row">
					<p>© {currentYear} Luxuria Homes Australia. All Rights Reserved.</p>
					<p>Designing dreams, building lifestyles.</p>
				</div>
			</div>
		</footer>
	);
}
