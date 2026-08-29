'use client';

import { Skeleton } from '@workspace/ui/components/skeleton';
import { cn } from '@workspace/ui/lib/utils';
import {
	Banknote,
	Briefcase,
	Landmark,
	type LucideIcon,
	PiggyBank,
	Receipt,
	TrendingDown,
	TrendingUp,
} from 'lucide-react';
import { formatAudWhole } from '@/lib/currency';
import type { ForecastPoint } from '@/lib/investment-forecast';

interface KpiTile {
	hint: string;
	icon: LucideIcon;
	label: string;
	tone?: 'default' | 'positive' | 'negative';
	value: string;
}

const TILE_CLASS =
	'relative rounded-xl border bg-background bg-clip-padding p-4 shadow-xs/5';

const SKELETON_KEYS = [
	'capital',
	'holding',
	'loan',
	'profit',
	'management',
	'investor',
];

function KpiBarSkeleton() {
	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
			{SKELETON_KEYS.map((key) => (
				<div className={TILE_CLASS} key={key}>
					<Skeleton className="h-4 w-20" />
					<Skeleton className="mt-3 h-7 w-24" />
					<Skeleton className="mt-2 h-3 w-28" />
				</div>
			))}
		</div>
	);
}

export default function InvestmentKpiBar({
	capitalIn,
	holdingSpent,
	sellNow,
	monthlyBurn: burn,
}: {
	capitalIn: number;
	holdingSpent: number;
	/** Month 0 of the forecast at the primary sale price. */
	sellNow: ForecastPoint | undefined;
	monthlyBurn: number;
}) {
	if (!sellNow) {
		return <KpiBarSkeleton />;
	}

	// The primary scenario is the one matching the headline sale price; the
	// forecast always puts it first when the panel builds the scenario list.
	const [scenario] = sellNow.scenarios;
	if (!scenario) {
		return <KpiBarSkeleton />;
	}

	const tiles: KpiTile[] = [
		{
			label: 'Capital in',
			value: formatAudWhole(capitalIn),
			hint: 'Deposits and settlement',
			icon: PiggyBank,
		},
		{
			label: 'Holding spent',
			value: formatAudWhole(holdingSpent),
			hint: 'Paid to date',
			icon: Receipt,
		},
		{
			label: 'Loan balance',
			value: formatAudWhole(sellNow.loanBalance),
			hint: `Burning ${formatAudWhole(burn)}/mo held`,
			icon: Landmark,
		},
		{
			label: 'Profit if sold now',
			value: formatAudWhole(scenario.profit),
			hint: `At ${formatAudWhole(scenario.salePrice)} sale price`,
			icon: scenario.profit >= 0 ? TrendingUp : TrendingDown,
			tone: scenario.profit >= 0 ? 'positive' : 'negative',
		},
		{
			label: 'Management fee',
			value: formatAudWhole(scenario.projectManagementFee),
			hint: 'Share less amount already paid',
			icon: Briefcase,
			tone: scenario.projectManagementFee >= 0 ? 'default' : 'negative',
		},
		{
			label: 'Investor share',
			value: formatAudWhole(scenario.investorShare),
			hint: 'Profit less management fee',
			icon: Banknote,
			tone: scenario.investorShare >= 0 ? 'positive' : 'negative',
		},
	];

	return (
		<div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
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
								'mt-2 font-semibold text-xl tabular-nums tracking-tight',
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
