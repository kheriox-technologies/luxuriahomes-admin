import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { DIFFERENTIATORS, SITE_COPY } from '@/lib/site';
import { staticCdnUrl } from '@/lib/static-cdn';

interface AboutSectionProps {
	/** Full variant (about page) shows the differentiators grid and no CTA. */
	full?: boolean;
	imageKey?: string;
}

export function AboutSection({ imageKey, full = false }: AboutSectionProps) {
	const imageSrc = imageKey ? staticCdnUrl(imageKey) : null;

	return (
		<section className="bg-muted/40 py-20 sm:py-28" id="about">
			<div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16">
				<div className="relative order-2 lg:order-1">
					<div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-brand-navy shadow-xl sm:aspect-[5/4] lg:aspect-[4/5]">
						{imageSrc ? (
							<Image
								alt="A Luxuria Homes residence"
								className="object-cover"
								fill
								sizes="(max-width: 1024px) 100vw, 50vw"
								src={imageSrc}
							/>
						) : (
							<div className="flex h-full flex-col items-center justify-center gap-6 p-10 text-center">
								<Image
									alt="Luxuria Homes"
									className="h-12 w-auto"
									height={48}
									src="/logo-light.png"
									width={120}
								/>
								<p className="font-display text-brand-cream/80 text-sm uppercase tracking-[0.25em]">
									Est. South East Queensland
								</p>
							</div>
						)}
					</div>
				</div>

				<div className="order-1 flex flex-col gap-6 lg:order-2">
					<div className="flex flex-col gap-4">
						<span className="eyebrow">{SITE_COPY.aboutEyebrow}</span>
						<h2 className="font-display text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
							{SITE_COPY.aboutTitle}
						</h2>
					</div>
					<p className="text-foreground text-lg leading-relaxed">
						{SITE_COPY.aboutLead}
					</p>
					<p className="text-muted-foreground leading-relaxed">
						{SITE_COPY.aboutBody}
					</p>
					<blockquote className="border-brand-gold border-l-2 pl-5 text-foreground italic leading-relaxed">
						{SITE_COPY.mission}
					</blockquote>

					{full ? (
						<div className="mt-2 grid gap-5 sm:grid-cols-2">
							{DIFFERENTIATORS.map((item) => (
								<div className="flex items-start gap-3" key={item.title}>
									<span
										className={cn(
											'flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy text-brand-cream'
										)}
									>
										<item.icon className="size-5" />
									</span>
									<div className="flex flex-col gap-1">
										<h3 className="font-medium text-foreground">
											{item.title}
										</h3>
										<p className="text-muted-foreground text-sm leading-relaxed">
											{item.description}
										</p>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="mt-2">
							<Button render={<Link href="/about" />} size="lg">
								More About Us
								<ArrowRight />
							</Button>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}
