'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import {
	Circle,
	Crosshair,
	Hash,
	Pentagon,
	Ruler,
	Square,
	Trash2,
} from 'lucide-react';
import { formatMeters, formatSqm, netAreaSqm } from '@/lib/takeoffs/geometry';
import { AREA_TYPE_SET, type Measurement } from '@/lib/takeoffs/types';

const TYPE_META = {
	linear: { icon: Ruler, label: 'Linear' },
	rectangle: { icon: Square, label: 'Rectangle' },
	circle: { icon: Circle, label: 'Circle' },
	polygon: { icon: Pentagon, label: 'Polygon' },
	count: { icon: Hash, label: 'Count' },
} as const;

function measurementValue(m: Measurement, all: Measurement[]): string {
	if (AREA_TYPE_SET.has(m.type)) {
		// Parents report net area (gross when they have no deductions).
		return `${formatSqm(netAreaSqm(m, all))} · ${formatMeters(m.perimeterMeters ?? 0)} perim`;
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
	calibrating,
	metersPerPixel,
	onCalibrate,
	onUsePdfScale,
	onDelete,
	onClearPage,
	onClearAll,
}: {
	page: number;
	measurements: Measurement[];
	calibrated: boolean;
	calibrating: boolean;
	metersPerPixel: number | null;
	onCalibrate: () => void;
	onUsePdfScale?: () => void;
	onDelete: (id: string) => void;
	onClearPage: () => void;
	onClearAll: () => void;
}) {
	const pageMeasurements = measurements.filter((m) => m.page === page);
	// Top-level shapes only (deductions are folded into their parent's net area).
	const topLevel = pageMeasurements.filter((m) => !m.parentId);
	const totalArea = topLevel
		.filter((m) => AREA_TYPE_SET.has(m.type))
		.reduce((sum, m) => sum + netAreaSqm(m, pageMeasurements), 0);
	const totalLength = pageMeasurements
		.filter((m) => m.type === 'linear')
		.reduce((sum, m) => sum + (m.valueMeters ?? 0), 0);
	const totalCount = pageMeasurements
		.filter((m) => m.type === 'count')
		.reduce((sum, m) => sum + (m.count ?? 0), 0);

	return (
		<div className="flex h-full w-72 shrink-0 flex-col rounded-lg border bg-card">
			<div className="flex flex-col gap-2 border-b p-3">
				<div className="flex items-center justify-between">
					<h2 className="font-semibold text-sm">Measurements</h2>
					<Button
						aria-label="Calibrate scale"
						onClick={onCalibrate}
						size="icon-sm"
						title="Calibrate scale — draw a line of known length"
						variant={calibrating ? 'default' : 'ghost'}
					>
						<Crosshair />
					</Button>
				</div>
				<Badge
					className="self-start"
					size="lg"
					variant={calibrated ? 'success' : 'warning'}
				>
					{calibrated && metersPerPixel !== null
						? `1 px = ${(metersPerPixel * 1000).toFixed(2)} mm · ${
								onUsePdfScale ? 'this page' : 'all pages'
							}`
						: 'Not calibrated'}
				</Badge>
				{onUsePdfScale && (
					<Button
						className="self-start"
						onClick={onUsePdfScale}
						size="sm"
						variant="ghost"
					>
						Use PDF scale
					</Button>
				)}
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
						{topLevel.map((m) => {
							const meta = TYPE_META[m.type];
							const Icon = meta.icon;
							const deductions = pageMeasurements.filter(
								(d) => d.parentId === m.id
							);
							return (
								<li className="flex flex-col gap-1" key={m.id}>
									<div className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50">
										<Icon className="size-4 shrink-0 text-muted-foreground" />
										<div className="min-w-0 flex-1">
											<p className="truncate font-medium text-sm">{m.label}</p>
											<p className="truncate text-muted-foreground text-xs">
												{measurementValue(m, pageMeasurements)}
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
									</div>
									{deductions.length > 0 && (
										<ul className="ml-4 flex flex-col gap-1 border-l pl-2">
											{deductions.map((d) => {
												const DeductionIcon = TYPE_META[d.type].icon;
												return (
													<li
														className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent/50"
														key={d.id}
													>
														<DeductionIcon className="size-3.5 shrink-0 text-destructive" />
														<div className="min-w-0 flex-1">
															<p className="truncate font-medium text-destructive text-xs">
																{d.label}
															</p>
															<p className="truncate text-muted-foreground text-xs">
																− {formatSqm(d.valueSqm ?? 0)}
															</p>
														</div>
														<Button
															aria-label="Delete deduction"
															onClick={() => onDelete(d.id)}
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
