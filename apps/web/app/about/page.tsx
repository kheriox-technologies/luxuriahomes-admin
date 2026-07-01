import { api } from '@workspace/backend/api';
import { fetchQuery } from 'convex/nextjs';
import type { Metadata } from 'next';
import { AboutSection } from '@/components/home/about-section';
import { CtaBand } from '@/components/home/cta-band';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { PageHero } from '@/components/page-hero';
import { SectionHeading } from '@/components/section-heading';
import { resolveCardImageKey } from '@/lib/projects';
import { SERVICE_AREAS } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = {
	title: 'About Us',
	description:
		'Luxuria Homes Australia is a leading construction firm recognised for innovation, quality craftsmanship and dedication to customer satisfaction across South East Queensland.',
};

export default async function AboutPage() {
	const completed = await fetchQuery(api.web.projects.listCompleted, {});
	const aboutImageKey = completed.map(resolveCardImageKey).find(Boolean);

	return (
		<>
			<PageHero
				crumbs={[{ label: 'Home', href: '/' }, { label: 'About Us' }]}
				eyebrow="About Luxuria Homes"
				subtitle="Your trusted partner in crafting luxury living spaces — built with integrity, creativity and precision."
				title="Where elegance meets construction excellence"
			/>

			<AboutSection full imageKey={aboutImageKey} />

			<section className="bg-background py-20 sm:py-28">
				<div className="mx-auto max-w-7xl px-6">
					<SectionHeading
						align="center"
						eyebrow="What We Build"
						subtext="From bespoke residences to commercial and industrial projects, our expertise spans every sector."
						title="Our areas of expertise"
					/>
					<div className="mt-14 grid gap-6 md:grid-cols-3">
						{SERVICE_AREAS.map((area, index) => (
							<div
								className="flex flex-col gap-4 rounded-xl border border-border bg-card p-8"
								key={area.title}
							>
								<span className="font-display text-4xl text-brand-accent/40">
									0{index + 1}
								</span>
								<h3 className="font-display text-foreground text-xl">
									{area.title}
								</h3>
								<p className="text-muted-foreground leading-relaxed">
									{area.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<WhyChooseUs />
			<CtaBand />
		</>
	);
}
