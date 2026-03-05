import { env } from '@workspace/env/web';
import { cn } from '@workspace/ui/lib/utils';
import PageHeading from '@/components/page-heading';

export default function Home() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<PageHeading
				description="Welcome to the home page"
				heading={`${env.NEXT_PUBLIC_APP_NAME} Home`}
			/>
		</div>
	);
}
