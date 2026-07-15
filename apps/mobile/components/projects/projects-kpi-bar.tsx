import type { Doc } from '@workspace/backend/dataModel';
import {
	Building2,
	HardHat,
	type LucideIcon,
	ReceiptText,
	TrendingDown,
	TrendingUp,
} from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { useThemeColors } from '@/components/theme';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/cn';
import { formatCurrencyCompact } from '@/lib/format';
import { semantic } from '@/lib/theme';

type Project = Doc<'projects'>;
type Tone = 'default' | 'positive' | 'negative';

interface KpiTile {
	hint: string;
	icon: LucideIcon;
	label: string;
	tone: Tone;
	value: string;
}

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
			tone: 'default',
		},
		{
			label: 'Quoted value',
			value: formatCurrencyCompact(totalQuoted),
			hint: 'Across all projects',
			icon: HardHat,
			tone: 'default',
		},
		{
			label: 'Received',
			value: formatCurrencyCompact(totalReceived),
			hint: 'Payments to date',
			icon: ReceiptText,
			tone: 'default',
		},
		{
			label: 'Net profit',
			value: formatCurrencyCompact(netProfit),
			hint: 'Received minus expenses',
			icon: netProfit >= 0 ? TrendingUp : TrendingDown,
			tone: netProfit >= 0 ? 'positive' : 'negative',
		},
	];
}

const CARD_CLASS = 'w-44 rounded-xl border border-border bg-card p-4';

function KpiBarSkeleton() {
	return (
		<View className="flex-row gap-3 px-4">
			{['projects', 'quoted', 'received', 'profit'].map((key) => (
				<View className={CARD_CLASS} key={key}>
					<Skeleton className="h-4 w-20" />
					<Skeleton className="mt-3 h-7 w-24" />
					<Skeleton className="mt-2 h-3 w-28" />
				</View>
			))}
		</View>
	);
}

export function ProjectsKpiBar({
	projects,
}: {
	projects: Project[] | undefined;
}) {
	const colors = useThemeColors();

	if (projects === undefined) {
		return <KpiBarSkeleton />;
	}

	const tiles = buildTiles(projects);

	const iconColor = (tone: Tone) => {
		if (tone === 'positive') {
			return semantic.success;
		}
		if (tone === 'negative') {
			return colors.destructive;
		}
		return colors.mutedForeground;
	};

	return (
		<ScrollView
			contentContainerClassName="gap-3 px-4"
			horizontal
			showsHorizontalScrollIndicator={false}
		>
			{tiles.map((tile) => {
				const Icon = tile.icon;
				return (
					<View className={CARD_CLASS} key={tile.label}>
						<View className="flex-row items-center justify-between gap-2">
							<Text className="font-sans-medium text-muted-foreground text-xs uppercase tracking-wide">
								{tile.label}
							</Text>
							<Icon color={iconColor(tile.tone)} size={16} strokeWidth={2} />
						</View>
						<Text
							className={cn(
								'mt-2 font-sans-semibold text-2xl tabular-nums',
								tile.tone === 'positive' && 'text-success',
								tile.tone === 'negative' && 'text-destructive',
								tile.tone === 'default' && 'text-foreground'
							)}
						>
							{tile.value}
						</Text>
						<Text
							className="mt-1 font-sans text-muted-foreground text-xs"
							numberOfLines={1}
						>
							{tile.hint}
						</Text>
					</View>
				);
			})}
		</ScrollView>
	);
}
