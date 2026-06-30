import { Button } from '@workspace/ui/components/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProjectCard } from '@/components/projects/project-card';
import { SectionHeading } from '@/components/section-heading';
import type { WebProject } from '@/lib/projects';
import { SITE_COPY } from '@/lib/site';

const HOME_PROJECT_LIMIT = 6;

export function CompletedProjects({ projects }: { projects: WebProject[] }) {
	const featured = projects.slice(0, HOME_PROJECT_LIMIT);

	if (featured.length === 0) {
		return null;
	}

	return (
		<section className="bg-background py-20 sm:py-28" id="projects">
			<div className="mx-auto max-w-7xl px-6">
				<div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<SectionHeading
						align="left"
						eyebrow={SITE_COPY.projectsEyebrow}
						subtext={SITE_COPY.projectsSubtext}
						title={SITE_COPY.projectsTitle}
					/>
					<Button
						className="shrink-0"
						render={<Link href="/projects" />}
						size="lg"
						variant="outline"
					>
						View All Projects
						<ArrowRight />
					</Button>
				</div>

				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{featured.map((project) => (
						<ProjectCard key={project._id} project={project} />
					))}
				</div>
			</div>
		</section>
	);
}
