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
	headingActions?: ReactNode;
	icon?: LucideIcon;
	metaSlot?: ReactNode;
	rightSlot?: ReactNode;
}

const PageHeading = ({
	heading,
	headingActions,
	icon: Icon,
	description,
	backLink,
	className,
	metaSlot,
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
				<div className="flex min-w-0 flex-col gap-1">
					<div className="flex min-w-0 items-center gap-2">
						<h3 className="min-w-0 flex-1 font-semibold sm:truncate sm:tracking-tight">
							{heading}
						</h3>
						{headingActions ? (
							<div className="flex shrink-0 items-center gap-2">
								{headingActions}
							</div>
						) : null}
					</div>
					{metaSlot ? (
						<div className="flex min-w-0 flex-wrap items-center gap-2">
							{metaSlot}
						</div>
					) : null}
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
