'use client';

import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import {
	Circle,
	Crosshair,
	Hash,
	Layers,
	Pentagon,
	Ruler,
	Square,
	Trash2,
} from 'lucide-react';
import {
	formatMeters,
	formatSqm,
	groupColorMap,
	netAreaSqm,
	unionMeasure,
} from '@/lib/takeoffs/geometry';
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

// Combined value of an Add group: union area + outer perimeter for area groups,
// or the summed length for linear groups.
function groupValue(
	members: Measurement[],
	isArea: boolean,
	mpp: number | null
): string {
	if (isArea) {
		if (!mpp) {
			return '—';
		}
		const { valueSqm, perimeterMeters } = unionMeasure(members, mpp);
		return `${formatSqm(valueSqm)} · ${formatMeters(perimeterMeters)} perim`;
	}
	const total = members.reduce((sum, m) => sum + (m.valueMeters ?? 0), 0);
	return formatMeters(total);
}

type Row =
	| { kind: 'group'; groupId: string; label: string; members: Measurement[] }
	| { kind: 'single'; measurement: Measurement };

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
	const groupColors = groupColorMap(pageMeasurements);

	// Collapse Add-group members into one row, preserving draw order; ungrouped
	// shapes stay as individual rows.
	const rows: Row[] = [];
	const seenGroups = new Map<string, Measurement[]>();
	for (const m of topLevel) {
		if (m.groupId) {
			const members = seenGroups.get(m.groupId);
			if (members) {
				members.push(m);
			} else {
				const list = [m];
				seenGroups.set(m.groupId, list);
				rows.push({
					kind: 'group',
					groupId: m.groupId,
					label: '',
					members: list,
				});
			}
		} else {
			rows.push({ kind: 'single', measurement: m });
		}
	}
	// Number groups per family in appearance order.
	let areaGroupCount = 0;
	let linearGroupCount = 0;
	for (const row of rows) {
		if (row.kind === 'group') {
			const isArea = AREA_TYPE_SET.has(row.members[0].type);
			row.label = isArea
				? `Area group ${++areaGroupCount}`
				: `Linear group ${++linearGroupCount}`;
		}
	}

	// Area total: each ungrouped shape's net area plus each area group's union
	// area (counted once, so overlaps don't double-count).
	let totalArea = topLevel
		.filter((m) => AREA_TYPE_SET.has(m.type) && !m.groupId)
		.reduce((sum, m) => sum + netAreaSqm(m, pageMeasurements), 0);
	if (metersPerPixel) {
		for (const members of seenGroups.values()) {
			if (AREA_TYPE_SET.has(members[0].type)) {
				totalArea += unionMeasure(members, metersPerPixel).valueSqm;
			}
		}
	}
	// Linear total is a plain sum whether or not lines are grouped.
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
						{rows.map((row) =>
							row.kind === 'group' ? (
								<GroupRow
									color={groupColors.get(row.groupId)}
									key={row.groupId}
									label={row.label}
									onDelete={() => onDelete(row.members[0].id)}
									value={groupValue(
										row.members,
										AREA_TYPE_SET.has(row.members[0].type),
										metersPerPixel
									)}
								/>
							) : (
								<MeasurementRow
									key={row.measurement.id}
									measurement={row.measurement}
									onDelete={onDelete}
									pageMeasurements={pageMeasurements}
								/>
							)
						)}
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

function MeasurementRow({
	measurement: m,
	pageMeasurements,
	onDelete,
}: {
	measurement: Measurement;
	pageMeasurements: Measurement[];
	onDelete: (id: string) => void;
}) {
	const Icon = TYPE_META[m.type].icon;
	const deductions = pageMeasurements.filter((d) => d.parentId === m.id);
	return (
		<li className="flex flex-col gap-1">
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
}

function GroupRow({
	label,
	value,
	color,
	onDelete,
}: {
	label: string;
	value: string;
	color?: string;
	onDelete: () => void;
}) {
	return (
		<li className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/50">
			<Layers
				className="size-4 shrink-0"
				style={{ color: color ?? undefined }}
			/>
			<div className="min-w-0 flex-1">
				<p className="truncate font-medium text-sm">{label}</p>
				<p className="truncate text-muted-foreground text-xs">{value}</p>
			</div>
			<Button
				aria-label="Delete group"
				onClick={onDelete}
				size="icon-sm"
				variant="ghost"
			>
				<Trash2 />
			</Button>
		</li>
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
