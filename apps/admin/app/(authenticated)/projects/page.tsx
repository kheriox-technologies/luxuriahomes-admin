import { cn } from '@workspace/ui/lib/utils';
import PageHeading from '@/components/page-heading';

export default function DashboardPage() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<PageHeading heading="Projects" />
		</div>
	);
}
