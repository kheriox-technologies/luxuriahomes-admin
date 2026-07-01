import { api } from '@workspace/backend/api';
import type { Id } from '@workspace/backend/dataModel';
import { fetchQuery } from 'convex/nextjs';
import { ArrowLeft, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CtaBand } from '@/components/home/cta-band';
import { ProjectGallery } from '@/components/projects/project-gallery';
import { ProjectStats } from '@/components/projects/project-stats';
import { resolveCardImageKey } from '@/lib/projects';
import { staticCdnUrl } from '@/lib/static-cdn';

export const revalidate = 300;

interface DetailPageProps {
	params: Promise<{ id: string }>;
}

async function loadProject(id: string) {
	return await fetchQuery(api.web.projects.get, {
		id: id as Id<'websiteProjects'>,
	});
}

export async function generateMetadata({
	params,
}: DetailPageProps): Promise<Metadata> {
	const { id } = await params;
	const project = await loadProject(id);
	if (!project) {
		return { title: 'Project Not Found' };
	}
	return {
		title: project.name,
		description:
			project.description ??
			`${project.name} — a luxury residence by Luxuria Homes Australia.`,
	};
}

export default async function ProjectDetailPage({ params }: DetailPageProps) {
	const { id } = await params;
	const project = await loadProject(id);

	if (!project) {
		notFound();
	}

	const heroKey = resolveCardImageKey(project);
	const heroSrc = heroKey ? staticCdnUrl(heroKey) : '/placeholder.svg';
	const media = project.media ?? [];

	return (
		<>
			<section className="relative isolate flex min-h-[55vh] items-end overflow-hidden bg-brand-primary">
				<Image
					alt={project.name}
					className="object-cover"
					fill
					priority
					sizes="100vw"
					src={heroSrc}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-brand-primary/75 via-brand-primary/25 to-transparent" />
				<div className="relative mx-auto w-full max-w-7xl px-6 pt-24 pb-12">
					<Link
						className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-brand-surface"
						href="/projects"
					>
						<ArrowLeft className="size-4" />
						Back to Projects
					</Link>
					{project.completedYear ? (
						<div className="mt-6 flex flex-wrap items-center gap-3">
							<span className="inline-flex items-center gap-1.5 text-sm text-white/75">
								<CalendarDays className="size-4 text-brand-surface" />
								Completed {project.completedYear}
							</span>
						</div>
					) : null}
					<h1 className="mt-3 max-w-3xl font-display text-4xl text-white leading-tight tracking-tight sm:text-5xl">
						{project.name}
					</h1>
				</div>
			</section>

			<section className="bg-background py-16 sm:py-20">
				<div className="mx-auto flex max-w-7xl flex-col gap-12 px-6">
					{project.description ? (
						<div className="flex flex-col gap-8">
							<div className="flex flex-col gap-4">
								<span className="eyebrow">Overview</span>
								<p className="whitespace-pre-line text-foreground text-lg leading-relaxed">
									{project.description}
								</p>
							</div>
							<ProjectStats project={project} />
						</div>
					) : (
						<ProjectStats project={project} />
					)}

					{media.length > 0 ? (
						<div className="flex flex-col gap-6 border-border border-t pt-12">
							<div className="flex flex-col gap-3">
								<span className="eyebrow">Gallery</span>
								<h2 className="font-display text-2xl text-foreground sm:text-3xl">
									Explore this residence
								</h2>
							</div>
							<ProjectGallery media={media} projectName={project.name} />
						</div>
					) : null}
				</div>
			</section>

			<CtaBand />
		</>
	);
}
