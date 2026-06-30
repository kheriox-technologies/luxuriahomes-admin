import { SectionHeading } from '@/components/section-heading';
import { DIFFERENTIATORS, SITE_COPY } from '@/lib/site';

export function WhyChooseUs() {
	return (
		<section className="relative overflow-hidden bg-brand-navy py-20 sm:py-28">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, #f8edb8 1px, transparent 0)',
					backgroundSize: '32px 32px',
				}}
			/>
			<div className="relative mx-auto max-w-7xl px-6">
				<SectionHeading
					align="center"
					eyebrow={SITE_COPY.whyEyebrow}
					title={SITE_COPY.whyTitle}
					tone="dark"
				/>

				<div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{DIFFERENTIATORS.map((item) => (
						<div
							className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-brand-gold/40 hover:bg-white/[0.07]"
							key={item.title}
						>
							<span className="flex size-12 items-center justify-center rounded-lg bg-brand-gold/15 text-brand-gold">
								<item.icon className="size-6" />
							</span>
							<h3 className="font-display text-lg text-white">{item.title}</h3>
							<p className="text-sm text-white/65 leading-relaxed">
								{item.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
