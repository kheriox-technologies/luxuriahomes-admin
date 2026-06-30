import { Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';
import type { Metadata } from 'next';
import { ContactForm } from '@/components/contact/contact-form';
import { PageHero } from '@/components/page-hero';
import { CONTACT, PHONES, telHref } from '@/lib/contact';

export const metadata: Metadata = {
	title: 'Contact Us',
	description:
		'Get in touch with Luxuria Homes Australia to start building your dream home. Call, email, or send us an enquiry online.',
};

const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
	CONTACT.address
)}&output=embed`;

export default function ContactPage() {
	return (
		<>
			<PageHero
				crumbs={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
				eyebrow="Get in Touch"
				subtitle="Ready to build your dream home? Reach out for a no-obligation consultation — our team would love to hear about your project."
				title="Let’s build together"
			/>

			<section className="bg-background py-16 sm:py-20">
				<div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
					<div className="flex flex-col gap-8">
						<div className="flex flex-col gap-6">
							<ContactDetail icon={MapPin} title="Visit Us">
								{CONTACT.address}
							</ContactDetail>
							<ContactDetail icon={Phone} title="Call Us">
								<span className="flex flex-wrap items-center gap-2">
									{PHONES.map((phone, index) => (
										<span className="flex items-center gap-2" key={phone}>
											{index > 0 ? (
												<span className="text-brand-navy/30">·</span>
											) : null}
											<a
												className="transition-colors hover:text-brand-gold"
												href={telHref(phone)}
											>
												{phone}
											</a>
										</span>
									))}
								</span>
							</ContactDetail>
							<ContactDetail icon={Mail} title="Email Us">
								<a
									className="transition-colors hover:text-brand-gold"
									href={`mailto:${CONTACT.email}`}
								>
									{CONTACT.email}
								</a>
							</ContactDetail>
							{CONTACT.qbccLicence ? (
								<ContactDetail icon={ShieldCheck} title="QBCC Licence">
									{CONTACT.qbccLicence}
								</ContactDetail>
							) : null}
						</div>

						<div className="overflow-hidden rounded-xl border border-border">
							<iframe
								className="h-64 w-full"
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								src={mapSrc}
								title="Luxuria Homes office location"
							/>
						</div>
					</div>

					<div className="rounded-2xl border border-border bg-card p-7 shadow-sm sm:p-9">
						<h2 className="font-display text-2xl text-foreground">
							Send us a message
						</h2>
						<p className="mt-2 text-muted-foreground text-sm">
							Fill in the form and we’ll get back to you as soon as possible.
						</p>
						<div className="mt-7">
							<ContactForm />
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

function ContactDetail({
	icon: Icon,
	title,
	children,
}: {
	icon: typeof MapPin;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div className="flex items-start gap-4">
			<span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-brand-cream">
				<Icon className="size-5" />
			</span>
			<div className="flex flex-col gap-1">
				<h3 className="font-display text-foreground text-lg">{title}</h3>
				<div className="text-muted-foreground leading-relaxed">{children}</div>
			</div>
		</div>
	);
}
