'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { Hash, Ruler, Shapes, Trash2 } from 'lucide-react';
import { formatMeters, formatSqm } from '@/lib/takeoffs/geometry';
import type { Measurement } from '@/lib/takeoffs/types';

const TYPE_META = {
	linear: { icon: Ruler, label: 'Linear' },
	area: { icon: Shapes, label: 'Area' },
	count: { icon: Hash, label: 'Count' },
} as const;

function measurementValue(m: Measurement): string {
	if (m.type === 'area') {
		return `${formatSqm(m.valueSqm ?? 0)} · ${formatMeters(m.perimeterMeters ?? 0)} perim`;
	}
	if (m.type === 'linear') {
		return formatMeters(m.valueMeters ?? 0);
	}
	return `${m.count ?? 0} markers`;
}

export default function MeasurementsPanel({
	page,
	measurements,
	calibrated,
	onDelete,
	onClearPage,
	onClearAll,
}: {
	page: number;
	measurements: Measurement[];
	calibrated: boolean;
	onDelete: (id: string) => void;
	onClearPage: () => void;
	onClearAll: () => void;
}) {
	const pageMeasurements = measurements.filter((m) => m.page === page);
	const totalArea = pageMeasurements
		.filter((m) => m.type === 'area')
		.reduce((sum, m) => sum + (m.valueSqm ?? 0), 0);
	const totalLength = pageMeasurements
		.filter((m) => m.type === 'linear')
		.reduce((sum, m) => sum + (m.valueMeters ?? 0), 0);
	const totalCount = pageMeasurements
		.filter((m) => m.type === 'count')
		.reduce((sum, m) => sum + (m.count ?? 0), 0);

	return (
		<div className="flex h-full w-72 shrink-0 flex-col rounded-lg border bg-card">
			<div className="flex items-center justify-between border-b p-3">
				<h2 className="font-semibold text-sm">Measurements</h2>
				<Badge size="lg" variant={calibrated ? 'success' : 'warning'}>
					{calibrated ? 'Calibrated' : 'Not calibrated'}
				</Badge>
			</div>

			<div className="grid grid-cols-3 gap-2 border-b p-3 text-center">
				<Stat label="Area" value={`${totalArea.toFixed(1)} m²`} />
				<Stat label="Length" value={`${totalLength.toFixed(1)} m`} />
				<Stat label="Count" value={`${totalCount}`} />
			</div>

			<div className="min-h-0 flex-1 overflow-auto p-2">
				{pageMeasurements.length === 0 ? (
					<p className="px-2 py-6 text-center text-muted-foreground text-sm">
						No measurements on this page yet.
					</p>
				) : (
					<ul className="flex flex-col gap-1">
						{pageMeasurements.map((m) => {
							const meta = TYPE_META[m.type];
							const Icon = meta.icon;
							return (
								<li
									className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50"
									key={m.id}
								>
									<Icon className="size-4 shrink-0 text-muted-foreground" />
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">{m.label}</p>
										<p className="truncate text-muted-foreground text-xs">
											{measurementValue(m)}
										</p>
									</div>
									<Button
										aria-label="Delete measurement"
										onClick={() => onDelete(m.id)}
										size="icon-sm"
										variant="ghost"
									>
										<Trash2 />
									</Button>
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<Separator />
			<div className="flex gap-2 p-3">
				<Button
					className="flex-1"
					onClick={onClearPage}
					size="sm"
					variant="outline"
				>
					Clear page
				</Button>
				<Button
					className="flex-1"
					onClick={onClearAll}
					size="sm"
					variant="destructive-outline"
				>
					Clear all
				</Button>
			</div>
		</div>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-col">
			<span className="font-semibold text-sm">{value}</span>
			<span className="text-muted-foreground text-xs">{label}</span>
		</div>
	);
}
