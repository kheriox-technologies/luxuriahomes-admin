import { Button } from '@workspace/ui/components/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SITE_COPY } from '@/lib/site';
import { HeroSlider } from './hero-slider';

interface HeroProps {
	backgroundKeys: string[];
}

export function Hero({ backgroundKeys }: HeroProps) {
	const headlineLines = SITE_COPY.heroHeadline.split('\n');

	return (
		<section className="relative isolate overflow-hidden bg-brand-navy">
			<HeroSlider imageKeys={backgroundKeys} />
			<div className="absolute inset-0 bg-gradient-to-r from-brand-navy/85 via-brand-navy/45 to-brand-navy/20" />
			<div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent" />

			<div className="relative mx-auto flex max-w-7xl flex-col px-6 pt-24 pb-16 sm:pt-32 lg:pt-40">
				<div className="max-w-3xl">
					<span className="eyebrow eyebrow--cream">
						{SITE_COPY.heroEyebrow}
					</span>
					<h1 className="mt-6 font-display text-4xl text-white leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
						{headlineLines.map((line, index) => (
							<span className="block" key={line}>
								{index === headlineLines.length - 1 ? (
									<span className="text-brand-cream">{line}</span>
								) : (
									line
								)}
							</span>
						))}
					</h1>
					<p className="mt-6 max-w-xl text-base text-white/75 leading-relaxed sm:text-lg">
						{SITE_COPY.heroSubtext}
					</p>
					<div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
						<Button
							className="bg-brand-gold text-brand-navy hover:bg-brand-gold/90"
							render={<Link href="/projects" />}
							size="xl"
						>
							View Our Projects
							<ArrowRight />
						</Button>
						<Button
							className="border-white/30 bg-white/5 text-white hover:bg-white/10"
							render={<Link href="/contact" />}
							size="xl"
							variant="outline"
						>
							Start Building
						</Button>
					</div>
				</div>
			</div>
		</section>
	);
}
