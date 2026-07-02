'use client';

import { Button } from '@workspace/ui/components/button';
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
	/** Rendered inline after the heading (e.g. status badge). */
	titleTrailing?: ReactNode;
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
	titleTrailing,
}: Props) => (
	<div className={cn('space-y-4', className)}>
		<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-2">
			<div className="flex min-w-0 flex-1 items-center gap-2">
				{Icon && <Icon className="h-6 w-6" />}
				<div className="flex min-w-0 flex-1 flex-col gap-1">
					<div className="flex min-w-0 items-center gap-2">
						{backLink && (
							<Button
								aria-label="Go back"
								className="-ml-2 shrink-0"
								render={<Link href={backLink as LinkProps<string>['href']} />}
								size="icon"
								type="button"
								variant="ghost"
							>
								<ChevronLeftIcon />
							</Button>
						)}
						{titleTrailing ? (
							<div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
								<h3 className="min-w-0 shrink truncate font-semibold sm:tracking-tight">
									{heading}
								</h3>
								<span className="inline-flex shrink-0 items-center">
									{titleTrailing}
								</span>
							</div>
						) : (
							<h3 className="min-w-0 flex-1 font-semibold sm:truncate sm:tracking-tight">
								{heading}
							</h3>
						)}
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
				<div className="flex w-full min-w-0 flex-col gap-2 sm:w-auto sm:shrink-0 sm:flex-row sm:items-center sm:justify-end">
					{rightSlot}
				</div>
			) : null}
		</div>
	</div>
);

export default PageHeading;
