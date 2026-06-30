import { Button } from '@workspace/ui/components/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { SITE_COPY } from '@/lib/site';
import { staticCdnUrl } from '@/lib/static-cdn';

interface HeroStat {
	label: string;
	value: string;
}

interface HeroProps {
	backgroundKey?: string;
	completedCount: number;
	inProgressCount: number;
}

export function Hero({
	backgroundKey,
	completedCount,
	inProgressCount,
}: HeroProps) {
	const backgroundSrc = backgroundKey ? staticCdnUrl(backgroundKey) : null;
	const headlineLines = SITE_COPY.heroHeadline.split('\n');

	const stats: HeroStat[] = [
		{
			value: completedCount > 0 ? `${completedCount}+` : 'Bespoke',
			label: completedCount > 0 ? 'Completed Homes' : 'Custom Designs',
		},
		{
			value: inProgressCount > 0 ? `${inProgressCount}` : 'Soon',
			label: 'Under Construction',
		},
		{ value: '100%', label: 'Custom Built' },
		{ value: 'QBCC', label: 'Licensed Builder' },
	];

	return (
		<section className="relative isolate overflow-hidden bg-brand-navy">
			{backgroundSrc ? (
				<Image
					alt=""
					className="object-cover opacity-95"
					fill
					priority
					sizes="100vw"
					src={backgroundSrc}
				/>
			) : null}
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

				<dl className="mt-16 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 lg:mt-24">
					{stats.map((stat) => (
						<div
							className="rounded-xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-sm sm:px-6"
							key={stat.label}
						>
							<dt className="sr-only">{stat.label}</dt>
							<dd className="font-display text-2xl text-brand-cream sm:text-3xl">
								{stat.value}
							</dd>
							<p className="mt-1 text-white/60 text-xs sm:text-sm">
								{stat.label}
							</p>
						</div>
					))}
				</dl>
			</div>
		</section>
	);
}
