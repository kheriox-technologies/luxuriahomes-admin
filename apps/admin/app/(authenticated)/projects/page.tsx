import { cn } from '@workspace/ui/lib/utils';
import AddProjectForm from '@/components/forms/add-project';
import PageHeading from '@/components/page-heading';
import ProjectsList from '@/components/projects/projects-list';

export default function ProjectsPage() {
	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading actions={<AddProjectForm />} heading="Projects" />
			<ProjectsList />
		</div>
	);
}
