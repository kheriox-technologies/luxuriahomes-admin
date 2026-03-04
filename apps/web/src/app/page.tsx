import { env } from '@repo/env/web';
import PageHeading from '@/components/page-heading';
import { cn } from '@/lib/utils';

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
