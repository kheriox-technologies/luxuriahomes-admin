'use client';

import type { Doc } from '@workspace/backend/dataModel';
import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import {
	Building2,
	HardHat,
	type LucideIcon,
	ReceiptText,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import { formatAudCompact } from '@/lib/currency';

type Project = Doc<'projects'>;

function sumBy(
	projects: Project[],
	pick: (project: Project) => number | undefined
): number {
	let total = 0;
	for (const project of projects) {
		total += pick(project) ?? 0;
	}
	return total;
}

interface KpiTile {
	hint: string;
	icon: LucideIcon;
	label: string;
	tone?: 'default' | 'positive' | 'negative';
	value: string;
}

function buildTiles(projects: Project[]): KpiTile[] {
	const active = projects.filter((p) => p.status === 'in_progress').length;
	const completed = projects.filter((p) => p.status === 'completed').length;
	const totalQuoted = sumBy(projects, (p) => p.quotePrice);
	const totalReceived = sumBy(projects, (p) => p.received);
	const netProfit = totalReceived - sumBy(projects, (p) => p.expenses);

	return [
		{
			label: 'Projects',
			value: projects.length.toString(),
			hint: `${active} active · ${completed} completed`,
			icon: Building2,
		},
		{
			label: 'Quoted value',
			value: formatAudCompact(totalQuoted),
			hint: 'Across all projects',
			icon: HardHat,
		},
		{
			label: 'Received',
			value: formatAudCompact(totalReceived),
			hint: 'Payments to date',
			icon: ReceiptText,
		},
		{
			label: 'Net profit',
			value: formatAudCompact(netProfit),
			hint: 'Received minus expenses',
			icon: netProfit >= 0 ? TrendingUp : TrendingDown,
			tone: netProfit >= 0 ? 'positive' : 'negative',
		},
	];
}

const TILE_CLASS =
	'relative rounded-xl border bg-background bg-clip-padding p-4 shadow-xs/5';

function KpiBarSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{['projects', 'quoted', 'received', 'profit'].map((key) => (
				<div className={TILE_CLASS} key={key}>
					<Skeleton className="h-4 w-20" />
					<Skeleton className="mt-3 h-7 w-24" />
					<Skeleton className="mt-2 h-3 w-28" />
				</div>
			))}
		</div>
	);
}

export default function ProjectsKpiBar({
	projects,
}: {
	projects: Project[] | undefined;
}) {
	if (projects === undefined) {
		return <KpiBarSkeleton />;
	}

	const tiles = buildTiles(projects);

	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
			{tiles.map((tile) => {
				const Icon = tile.icon;
				return (
					<div className={TILE_CLASS} key={tile.label}>
						<div className="flex items-center justify-between gap-2">
							<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
								{tile.label}
							</span>
							<Icon
								aria-hidden
								className={cn(
									'size-4 shrink-0',
									tile.tone === 'positive' && 'text-success-foreground',
									tile.tone === 'negative' && 'text-destructive-foreground',
									(!tile.tone || tile.tone === 'default') &&
										'text-muted-foreground'
								)}
							/>
						</div>
						<p
							className={cn(
								'mt-2 font-semibold text-2xl tabular-nums tracking-tight',
								tile.tone === 'positive' && 'text-success-foreground',
								tile.tone === 'negative' && 'text-destructive-foreground'
							)}
						>
							{tile.value}
						</p>
						<p className="mt-1 truncate text-muted-foreground text-xs">
							{tile.hint}
						</p>
					</div>
				);
			})}
		</div>
	);
}
