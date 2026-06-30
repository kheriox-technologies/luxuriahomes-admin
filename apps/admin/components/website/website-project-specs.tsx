'use client';

import { cn } from '@workspace/ui/lib/utils';
import { Waves } from 'lucide-react';
import {
	WEBSITE_PROJECT_SPECS,
	type WebsiteProject,
} from './website-project-form-shared';

function formatSpecValue(value: number, unit: string): string {
	return unit ? `${value} ${unit}` : String(value);
}

/**
 * Renders the present numeric specs (beds, baths, …) as compact labeled chips.
 * Absent values are omitted. Returns an em dash when no specs are set.
 */
export function WebsiteProjectSpecs({
	project,
	className,
}: {
	project: WebsiteProject;
	className?: string;
}) {
	const present = WEBSITE_PROJECT_SPECS.filter(
		(spec) => project[spec.key] !== undefined
	);

	if (present.length === 0 && !project.hasPool) {
		return <span className="text-muted-foreground text-sm">—</span>;
	}

	return (
		<div
			className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}
		>
			{present.map((spec) => {
				const Icon = spec.icon;
				const value = project[spec.key] as number;
				return (
					<span
						className="inline-flex items-center gap-1 text-muted-foreground text-sm"
						key={spec.key}
						title={spec.label}
					>
						<Icon aria-hidden className="size-4 shrink-0" />
						<span className="tabular-nums">
							{formatSpecValue(value, spec.unit)}
						</span>
					</span>
				);
			})}
			{project.hasPool ? (
				<span
					className="inline-flex items-center gap-1 text-muted-foreground text-sm"
					title="Pool"
				>
					<Waves aria-hidden className="size-4 shrink-0" />
					<span>Pool</span>
				</span>
			) : null}
		</div>
	);
}
