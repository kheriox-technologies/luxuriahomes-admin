import { env } from '@workspace/env/admin';
import { cn } from '@workspace/ui/lib/utils';
import PageHeading from '@/components/page-heading';

export default function DashboardPage() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<PageHeading
				description="Welcome to the dashboard"
				heading={`${env.NEXT_PUBLIC_APP_NAME} Dashboard`}
			/>
		</div>
	);
}
