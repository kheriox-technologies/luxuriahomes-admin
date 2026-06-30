import { Button } from '@workspace/ui/components/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SITE_COPY } from '@/lib/site';

export function CtaBand() {
	return (
		<section className="bg-background py-16 sm:py-20">
			<div className="mx-auto max-w-7xl px-6">
				<div className="relative overflow-hidden rounded-2xl border border-brand-gold/30 bg-brand-cream/30 px-8 py-12 sm:px-14 sm:py-16">
					<div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
						<div className="max-w-2xl">
							<h2 className="font-display text-3xl text-brand-navy leading-tight tracking-tight sm:text-4xl">
								{SITE_COPY.ctaTitle}
							</h2>
							<p className="mt-3 text-brand-navy/80 leading-relaxed">
								{SITE_COPY.ctaSubtext}
							</p>
						</div>
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<Button
								className="bg-brand-navy text-white hover:bg-brand-navy/90"
								render={<Link href="/contact" />}
								size="xl"
							>
								Get in Touch
								<ArrowRight />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
