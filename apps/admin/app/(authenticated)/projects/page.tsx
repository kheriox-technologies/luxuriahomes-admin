import { cn } from '@workspace/ui/lib/utils';
import AddProjectForm from '@/components/forms/add-project';
import PageHeading from '@/components/page-heading';

export default function DashboardPage() {
	return (
		<div className={cn('flex h-full w-full flex-col')}>
			<PageHeading actions={<AddProjectForm />} heading="Projects" />
		</div>
	);
}
