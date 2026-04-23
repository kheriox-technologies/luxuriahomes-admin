import { cn } from '@workspace/ui/lib/utils';
import AddProjectForm from '@/components/forms/add-project';
import PageHeading from '@/components/page-heading';
import ProjectsList from '@/components/projects/projects-list';

export default function ProjectsPage() {
	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<div className="mb-4 flex items-start justify-between gap-2">
				<PageHeading className="mb-0" heading="Projects" />
				<div className="flex shrink-0 items-center gap-2">
					<AddProjectForm />
				</div>
			</div>
			<ProjectsList />
		</div>
	);
}
