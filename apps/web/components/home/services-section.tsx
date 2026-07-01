import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionHeading } from '@/components/section-heading';
import { SERVICES, SITE_COPY } from '@/lib/site';

export function ServicesSection() {
	return (
		<section className="bg-background py-20 sm:py-28" id="services">
			<div className="mx-auto max-w-7xl px-6">
				<SectionHeading
					align="center"
					eyebrow={SITE_COPY.servicesEyebrow}
					subtext={SITE_COPY.servicesSubtext}
					title={SITE_COPY.servicesTitle}
				/>

				<div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{SERVICES.map((service) => (
						<div
							className="group relative flex flex-col gap-5 overflow-hidden rounded-xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-accent/40 hover:shadow-lg"
							key={service.title}
						>
							<span className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-brand-accent transition-transform duration-300 group-hover:scale-x-100" />
							<span className="flex size-14 items-center justify-center rounded-lg bg-brand-primary text-primary-foreground transition-colors duration-300 group-hover:bg-brand-accent group-hover:text-brand-accent-foreground">
								<service.icon className="size-7" />
							</span>
							<div className="flex flex-col gap-2">
								<h3 className="font-display text-foreground text-lg leading-snug">
									{service.title}
								</h3>
								<p className="text-muted-foreground text-sm leading-relaxed">
									{service.description}
								</p>
							</div>
							<Link
								className="mt-auto inline-flex items-center gap-1.5 font-medium text-brand-accent text-sm transition-colors hover:text-brand-primary"
								href="/contact"
							>
								Enquire now
								<ArrowRight className="size-4" />
							</Link>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
