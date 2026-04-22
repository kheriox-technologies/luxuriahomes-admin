import { cn } from '@workspace/ui/lib/utils';
import PageHeading from '@/components/page-heading';

export default function InclusionsPage() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<PageHeading heading="Inclusions" />
		</div>
	);
}
