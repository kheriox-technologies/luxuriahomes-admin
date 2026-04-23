'use client';

import { cn } from '@workspace/ui/lib/utils';
import { SquaresIntersect } from 'lucide-react';
import PageHeading from '@/components/page-heading';

export default function InclusionsPageContent() {
	return (
		<div className={cn('flex h-full flex-col')}>
			<PageHeading heading="Inclusions" icon={SquaresIntersect} />
		</div>
	);
}
