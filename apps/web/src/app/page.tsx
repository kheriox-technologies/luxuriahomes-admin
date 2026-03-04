import { env } from '@repo/env/web';
import { cn } from '@/lib/utils';

export default function Home() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<h1>{env.NEXT_PUBLIC_APP_NAME}</h1>
		</div>
	);
}
