'use client';
import { ChevronLeftIcon, type LucideIcon } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';
import type { ReactNode } from 'react';

interface Props {
	actions?: ReactNode;
	backLink?: string;
	description?: string;
	heading: string;
	icon?: LucideIcon;
}

const PageHeading = ({
	heading,
	icon: Icon,
	description,
	backLink,
	actions,
}: Props) => (
	<div className="mb-4 space-y-4">
		<div className="flex items-start justify-between gap-2">
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
			{actions ? (
				<div className="flex shrink-0 items-center gap-2">{actions}</div>
			) : null}
		</div>
	</div>
);

export default PageHeading;
