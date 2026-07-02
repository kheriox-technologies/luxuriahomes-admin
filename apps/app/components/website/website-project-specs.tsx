'use client';

import { cn } from '@workspace/ui/lib/utils';
import { type LucideIcon, Tv, Waves } from 'lucide-react';
import {
	WEBSITE_PROJECT_SPECS,
	type WebsiteProject,
} from './website-project-form-shared';

function formatSpecValue(value: number, unit: string): string {
	return unit ? `${value} ${unit}` : String(value);
}

/** Boolean feature flags rendered as icon-only chips (no count). */
const WEBSITE_PROJECT_FLAGS = [
	{ flag: 'hasPool', label: 'Pool', icon: Waves },
	{ flag: 'hasMediaRoom', label: 'Media Room', icon: Tv },
] as const satisfies ReadonlyArray<{
	flag: keyof WebsiteProject;
	label: string;
	icon: LucideIcon;
}>;

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
	const flags = WEBSITE_PROJECT_FLAGS.filter((item) =>
		Boolean(project[item.flag])
	);

	if (present.length === 0 && flags.length === 0) {
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
			{flags.map((item) => {
				const Icon = item.icon;
				return (
					<span
						className="inline-flex items-center gap-1 text-muted-foreground text-sm"
						key={item.flag}
						title={item.label}
					>
						<Icon aria-hidden className="size-4 shrink-0" />
						<span>{item.label}</span>
					</span>
				);
			})}
		</div>
	);
}
