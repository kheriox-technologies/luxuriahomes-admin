import { ChevronRight } from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';

interface Crumb {
	href?: Route;
	label: string;
}

interface PageHeroProps {
	crumbs?: Crumb[];
	eyebrow?: string;
	subtitle?: string;
	title: string;
}

/** Compact navy banner used at the top of inner pages. */
export function PageHero({ eyebrow, title, subtitle, crumbs }: PageHeroProps) {
	return (
		<section className="relative overflow-hidden bg-brand-primary">
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--brand-accent) 1px, transparent 0)',
					backgroundSize: '32px 32px',
				}}
			/>
			<div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
				{eyebrow ? (
					<span className="eyebrow eyebrow--cream">{eyebrow}</span>
				) : null}
				<h1 className="mt-4 font-display text-4xl text-white leading-tight tracking-tight sm:text-5xl">
					{title}
				</h1>
				{subtitle ? (
					<p className="mt-4 max-w-2xl text-base text-white/70 leading-relaxed">
						{subtitle}
					</p>
				) : null}
				{crumbs && crumbs.length > 0 ? (
					<nav
						aria-label="Breadcrumb"
						className="mt-6 flex items-center gap-2 text-sm text-white/55"
					>
						{crumbs.map((crumb, index) => (
							<span className="flex items-center gap-2" key={crumb.label}>
								{index > 0 ? <ChevronRight className="size-4" /> : null}
								{crumb.href ? (
									<Link
										className="transition-colors hover:text-brand-surface"
										href={crumb.href}
									>
										{crumb.label}
									</Link>
								) : (
									<span className="text-brand-surface">{crumb.label}</span>
								)}
							</span>
						))}
					</nav>
				) : null}
			</div>
		</section>
	);
}
