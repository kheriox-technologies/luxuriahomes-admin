'use client';

import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
} from '@workspace/ui/components/chart';
import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	XAxis,
	YAxis,
} from 'recharts';
import { formatAudCompact, formatAudWhole } from '@/lib/currency';
import type { ForecastPoint } from '@/lib/investment-forecast';

/**
 * Scenario prices are ordinal (cheapest to dearest), so they get the theme's
 * sequential `--chart-*` ramp rather than unrelated hues — the darker the line,
 * the higher the sale price.
 */
const SERIES_COLORS = [
	'var(--chart-1)',
	'var(--chart-2)',
	'var(--chart-3)',
	'var(--chart-4)',
	'var(--chart-5)',
];

function seriesKey(index: number): string {
	return `scenario${index}`;
}

interface ChartRow {
	label: string;
	month: number;
	[seriesKey: string]: number | string;
}

function buildRows(forecast: ForecastPoint[]): ChartRow[] {
	return forecast.map((point) => {
		const row: ChartRow = { label: point.label, month: point.month };
		point.scenarios.forEach((scenario, index) => {
			row[seriesKey(index)] = Math.round(scenario.profit);
		});
		return row;
	});
}

export default function ProfitForecastChart({
	forecast,
}: {
	forecast: ForecastPoint[];
}) {
	const [firstPoint] = forecast;
	const scenarios = firstPoint?.scenarios ?? [];
	const rows = buildRows(forecast);

	const config: ChartConfig = Object.fromEntries(
		scenarios.map((scenario, index) => [
			seriesKey(index),
			{
				label: formatAudCompact(scenario.basePrice),
				color: SERIES_COLORS[index % SERIES_COLORS.length],
			},
		])
	);

	return (
		<ChartContainer className="aspect-auto h-[360px] w-full" config={config}>
			<LineChart accessibilityLayer data={rows} margin={{ left: 8, right: 16 }}>
				<CartesianGrid strokeDasharray="3 3" vertical={false} />
				<XAxis
					axisLine={false}
					dataKey="label"
					minTickGap={8}
					tickLine={false}
					tickMargin={8}
				/>
				<YAxis
					axisLine={false}
					tickFormatter={(value: number) => formatAudCompact(value)}
					tickLine={false}
					tickMargin={8}
					width={64}
				/>
				<ReferenceLine
					label={{
						fill: 'var(--muted-foreground)',
						fontSize: 11,
						value: 'Break even',
					}}
					stroke="var(--muted-foreground)"
					strokeDasharray="4 4"
					y={0}
				/>
				<ChartTooltip
					content={({ active, label, payload }) => {
						if (!(active && payload?.length)) {
							return null;
						}
						const point = forecast.find(
							(candidate) => candidate.label === label
						);
						return (
							<div className="min-w-[15rem] rounded-lg border border-border/50 bg-background px-2.5 py-2 text-xs shadow-xl">
								<div className="font-medium">
									Sell {label}
									{point ? ` · ${point.month} mo held` : ''}
								</div>
								{point ? (
									<div className="mt-0.5 text-muted-foreground">
										Loan {formatAudCompact(point.loanBalance)} · holding{' '}
										{formatAudCompact(point.futureHolding)}
									</div>
								) : null}
								<div className="mt-2 grid gap-1">
									{point?.scenarios.map((scenario, index) => (
										<div
											className="flex items-center justify-between gap-4"
											key={scenario.basePrice}
										>
											<span className="flex items-center gap-1.5 text-muted-foreground">
												<span
													className="size-2 shrink-0 rounded-[2px]"
													style={{
														backgroundColor:
															SERIES_COLORS[index % SERIES_COLORS.length],
													}}
												/>
												{formatAudCompact(scenario.salePrice)}
											</span>
											<span className="font-mono tabular-nums">
												{formatAudWhole(scenario.profit)}
											</span>
										</div>
									))}
								</div>
								<div className="mt-2 border-t pt-1.5 text-muted-foreground">
									Investor share at{' '}
									{formatAudCompact(point?.scenarios[0]?.salePrice ?? 0)}:{' '}
									<span className="font-mono text-foreground tabular-nums">
										{formatAudWhole(point?.scenarios[0]?.investorShare ?? 0)}
									</span>
								</div>
							</div>
						);
					}}
					cursor={{ strokeDasharray: '3 3' }}
				/>
				<ChartLegend content={<ChartLegendContent />} />
				{scenarios.map((scenario, index) => (
					<Line
						activeDot={{ r: 4 }}
						dataKey={seriesKey(index)}
						dot={false}
						key={scenario.basePrice}
						stroke={SERIES_COLORS[index % SERIES_COLORS.length]}
						strokeWidth={2}
						type="monotone"
					/>
				))}
			</LineChart>
		</ChartContainer>
	);
}
