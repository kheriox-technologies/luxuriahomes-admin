'use client';

import { cn } from '@workspace/ui/lib/utils';
import { ChevronLeftIcon, type LucideIcon } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

interface Props {
	backLink?: string;
	className?: string;
	description?: string;
	heading: string;
	icon?: LucideIcon;
	rightSlot?: ReactNode;
}

const PageHeading = ({
	heading,
	icon: Icon,
	description,
	backLink,
	className,
	rightSlot,
}: Props) => (
	<div className={cn('mb-4 space-y-4', className)}>
		<div className="flex min-w-0 items-start justify-between gap-3">
			<div className="flex min-w-0 items-center gap-2">
				{backLink && (
					<Link href={backLink as LinkProps<string>['href']}>
						<ChevronLeftIcon className="h-4 w-4" />
					</Link>
				)}
				{Icon && <Icon className="h-6 w-6" />}
				<div className="flex min-w-0 flex-col">
					<h3 className="font-semibold sm:truncate sm:tracking-tight">
						{heading}
					</h3>
					{description && (
						<p className="text-gray-500 text-sm">{description}</p>
					)}
				</div>
			</div>
			{rightSlot ? (
				<div className="flex shrink-0 justify-end pt-0.5">{rightSlot}</div>
			) : null}
		</div>
	</div>
);

export default PageHeading;
