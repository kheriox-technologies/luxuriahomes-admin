import { env } from '@workspace/env/admin';
import { cn } from '@workspace/ui/lib/utils';
import PageHeading from '@/components/page-heading';

export default function Home() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<PageHeading
				description="Welcome to the home page"
				heading={`Landing page for ${env.NEXT_PUBLIC_APP_NAME}`}
			/>
		</div>
	);
}
