'use client';
import { ChevronLeftIcon, type LucideIcon } from 'lucide-react';
import Link, { type LinkProps } from 'next/link';

interface Props {
	backLink?: string;
	description?: string;
	heading: string;
	icon?: LucideIcon;
}

const PageHeading = ({ heading, icon: Icon, description, backLink }: Props) => (
	<div className="mb-4 space-y-4">
		<div className="flex items-start justify-between gap-2">
			<div className="flex items-center gap-2">
				{backLink && (
					<Link href={backLink as LinkProps<string>['href']}>
						<ChevronLeftIcon className="h-4 w-4" />
					</Link>
				)}
				{Icon && <Icon className="h-6 w-6" />}
				<div className="flex flex-col">
					<h3 className="font-semibold sm:truncate sm:tracking-tight">
						{heading}
					</h3>
					{description && (
						<p className="text-gray-500 text-sm">{description}</p>
					)}
				</div>
			</div>
		</div>
	</div>
);

export default PageHeading;
