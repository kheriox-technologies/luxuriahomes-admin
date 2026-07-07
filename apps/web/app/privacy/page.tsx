import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/page-hero';
import { CONTACT } from '@/lib/contact';

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description:
		'How Luxuria Homes Australia collects, uses, discloses and protects your personal information in accordance with the Australian Privacy Principles.',
};

interface PolicySection {
	bullets?: string[];
	paragraphs: string[];
	title: string;
}

const SECTIONS: PolicySection[] = [
	{
		title: 'Introduction',
		paragraphs: [
			'Luxuria Homes Australia ("we", "us" or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose and safeguard your personal information when you visit our website, enquire about our services, or engage us to design and build your home.',
			'We handle personal information in accordance with the Privacy Act 1988 (Cth) and the Australian Privacy Principles (APPs). By using our website or providing us with your information, you consent to the practices described in this policy.',
		],
	},
	{
		title: 'Information We Collect',
		paragraphs: [
			'We collect personal information that is reasonably necessary to provide our services and respond to your enquiries. This may include:',
		],
		bullets: [
			'Your name, email address, phone number and postal address.',
			'Details about your project, property, budget and design preferences.',
			'Information you provide when you complete a contact or enquiry form.',
			'Records of our correspondence and communications with you.',
			'Technical data such as your IP address, browser type and pages visited, collected automatically when you use our website.',
		],
	},
	{
		title: 'How We Use Your Information',
		paragraphs: ['We use the personal information we collect to:'],
		bullets: [
			'Respond to your enquiries and provide quotes or consultations.',
			'Design, plan, deliver and manage construction projects.',
			'Communicate with you about your project and our services.',
			'Improve our website, services and customer experience.',
			'Meet our legal, regulatory and contractual obligations.',
		],
	},
	{
		title: 'Disclosure of Your Information',
		paragraphs: [
			'We do not sell or rent your personal information. We may disclose it to trusted third parties who help us operate our business and deliver our services — such as contractors, suppliers, consultants and technology providers — and only to the extent necessary for those purposes.',
			'We may also disclose your information where required or authorised by law, or to protect our legal rights.',
		],
	},
	{
		title: 'Data Security',
		paragraphs: [
			'We take reasonable steps to protect your personal information from misuse, interference, loss, and unauthorised access, modification or disclosure. However, no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.',
		],
	},
	{
		title: 'Cookies and Analytics',
		paragraphs: [
			'Our website may use cookies and similar technologies to understand how visitors use our site and to improve your browsing experience. You can control or disable cookies through your browser settings, though some parts of the website may not function as intended if you do so.',
		],
	},
	{
		title: 'Accessing and Correcting Your Information',
		paragraphs: [
			'You may request access to the personal information we hold about you, and ask us to correct it if it is inaccurate, out of date or incomplete. To make a request, please contact us using the details below. We may need to verify your identity before actioning your request.',
		],
	},
	{
		title: 'Changes to This Policy',
		paragraphs: [
			'We may update this Privacy Policy from time to time to reflect changes in our practices or legal obligations. Any updates will be published on this page, so we encourage you to review it periodically.',
		],
	},
];

export default function PrivacyPage() {
	return (
		<>
			<PageHero
				crumbs={[{ label: 'Home', href: '/' }, { label: 'Privacy Policy' }]}
				eyebrow="Privacy Policy"
				subtitle="Our commitment to protecting your personal information and respecting your privacy."
				title="Your privacy matters"
			/>

			<section className="bg-background py-20 sm:py-28">
				<div className="mx-auto max-w-3xl px-6">
					<div className="flex flex-col gap-12">
						{SECTIONS.map((section) => (
							<div className="flex flex-col gap-4" key={section.title}>
								<h2 className="font-display text-2xl text-foreground leading-tight tracking-tight sm:text-3xl">
									{section.title}
								</h2>
								{section.paragraphs.map((paragraph) => (
									<p
										className="text-base text-muted-foreground leading-relaxed"
										key={paragraph}
									>
										{paragraph}
									</p>
								))}
								{section.bullets ? (
									<ul className="flex flex-col gap-3">
										{section.bullets.map((bullet) => (
											<li
												className="flex items-start gap-3 text-base text-muted-foreground leading-relaxed"
												key={bullet}
											>
												<span
													aria-hidden="true"
													className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-accent"
												/>
												<span>{bullet}</span>
											</li>
										))}
									</ul>
								) : null}
							</div>
						))}

						<div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8">
							<h2 className="font-display text-2xl text-foreground leading-tight tracking-tight sm:text-3xl">
								Contact Us
							</h2>
							<p className="text-base text-muted-foreground leading-relaxed">
								If you have any questions about this Privacy Policy, or wish to
								access or correct the personal information we hold about you,
								please get in touch:
							</p>
							<ul className="flex flex-col gap-2 text-base text-muted-foreground">
								<li>
									<span className="font-medium text-foreground">Email: </span>
									<a
										className="text-brand-accent transition-colors hover:text-foreground"
										href={`mailto:${CONTACT.email}`}
									>
										{CONTACT.email}
									</a>
								</li>
								<li>
									<span className="font-medium text-foreground">Address: </span>
									{CONTACT.address}
								</li>
							</ul>
							<p className="text-base text-muted-foreground leading-relaxed">
								You can also reach us via our{' '}
								<Link
									className="text-brand-accent transition-colors hover:text-foreground"
									href="/contact"
								>
									contact page
								</Link>
								.
							</p>
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
