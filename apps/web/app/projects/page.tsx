import { api } from '@workspace/backend/api';
import {
	Empty,
	EmptyDescription,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { fetchQuery } from 'convex/nextjs';
import { Building2 } from 'lucide-react';
import type { Metadata } from 'next';
import { PageHero } from '@/components/page-hero';
import { ProjectCard } from '@/components/projects/project-card';
import { ProjectMiniCard } from '@/components/projects/project-mini-card';
import { resolveCardImageKey } from '@/lib/projects';

export const revalidate = 300;

export const metadata: Metadata = {
	title: 'Our Projects',
	description:
		'Explore luxury homes designed and built by Luxuria Homes Australia across South East Queensland — completed residences and projects under construction.',
};

export default async function ProjectsPage() {
	const projects = await fetchQuery(api.web.projects.listPublished, {});
	const completed = projects.filter((p) => p.status === 'completed');
	const inProgress = projects.filter((p) => p.status === 'in_progress');
	const inProgressWithImages = inProgress.filter((p) => resolveCardImageKey(p));
	const inProgressWithoutImages = inProgress.filter(
		(p) => !resolveCardImageKey(p)
	);

	return (
		<>
			<PageHero
				crumbs={[{ label: 'Home', href: '/' }, { label: 'Projects' }]}
				eyebrow="Our Portfolio"
				subtitle="A showcase of bespoke residences we have crafted — each one a testament to quality, design and meticulous attention to detail."
				title="Projects"
			/>

			<section className="bg-background py-16 sm:py-20">
				<div className="mx-auto max-w-7xl px-6">
					{projects.length === 0 ? (
						<Empty className="py-20">
							<Building2 className="size-10 text-brand-accent" />
							<EmptyTitle>Projects coming soon</EmptyTitle>
							<EmptyDescription>
								We’re putting the finishing touches on our portfolio. Please
								check back shortly.
							</EmptyDescription>
						</Empty>
					) : (
						<div className="flex flex-col gap-16">
							{completed.length > 0 ? (
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
									{completed.map((project) => (
										<ProjectCard key={project._id} project={project} />
									))}
								</div>
							) : null}

							{inProgress.length > 0 ? (
								<div className="flex flex-col gap-8">
									<div className="flex flex-col gap-3">
										<span className="eyebrow">Currently Building</span>
										<h2 className="font-display text-3xl text-foreground leading-tight tracking-tight sm:text-4xl">
											Under Construction
										</h2>
										<p className="max-w-2xl text-muted-foreground leading-relaxed">
											Bespoke residences underway right now. Full details will
											follow as each home nears completion.
										</p>
									</div>
									<div className="grid grid-flow-dense auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
										{inProgressWithImages.map((project) => (
											<ProjectCard
												className="sm:row-span-2"
												key={project._id}
												project={project}
											/>
										))}
										{inProgressWithoutImages.map((project) => (
											<ProjectMiniCard key={project._id} project={project} />
										))}
									</div>
								</div>
							) : null}
						</div>
					)}
				</div>
			</section>
		</>
	);
}
