'use client';

import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import {
	AlertDialog,
	AlertDialogClose,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@workspace/ui/components/alert-dialog';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import {
	ChevronDownIcon,
	ChevronsDownIcon,
	ChevronsUpIcon,
	Circle,
	Crosshair,
	Hash,
	Layers,
	MousePointer2,
	Pentagon,
	Ruler,
	Square,
	Trash2,
} from 'lucide-react';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import {
	formatMeters,
	formatSqm,
	netAreaSqm,
	unionMeasure,
} from '@/lib/takeoffs/geometry';
import { AREA_TYPE_SET, type Measurement } from '@/lib/takeoffs/types';
import ColorSwatchPicker from './color-swatch-picker';

const FALLBACK_COLOR = '#2563eb';

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
		return formatSqm(netAreaSqm(m, all));
	}
	if (m.type === 'linear') {
		return formatMeters(m.valueMeters ?? 0);
	}
	return `${m.count ?? 0} markers`;
}

// Combined value of an Add group: union area for area groups, or the summed
// length for linear groups.
function groupValue(
	members: Measurement[],
	isArea: boolean,
	mpp: number | null
): string {
	if (isArea) {
		if (!mpp) {
			return '—';
		}
		return formatSqm(unionMeasure(members, mpp).valueSqm);
	}
	const total = members.reduce((sum, m) => sum + (m.valueMeters ?? 0), 0);
	return formatMeters(total);
}

type Row =
	| { kind: 'group'; groupId: string; label: string; members: Measurement[] }
	| { kind: 'single'; measurement: Measurement };

// Collapse Add-group members into one row (preserving draw order); ungrouped
// shapes stay as individual rows. Deductions are folded into their parent.
function buildRows(pageMeasurements: Measurement[]): Row[] {
	const topLevel = pageMeasurements.filter((m) => !m.parentId);
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
	return rows;
}

export default function MeasurementsPanel({
	page,
	measurements,
	calibrated,
	calibrating,
	metersPerPixel,
	selectedId,
	onCalibrate,
	onUsePdfScale,
	onDelete,
	onClearPage,
	onClearAll,
	onSelectMeasurement,
	onRenameMeasurement,
	onRecolorMeasurement,
}: {
	page: number;
	measurements: Measurement[];
	calibrated: boolean;
	calibrating: boolean;
	metersPerPixel: number | null;
	selectedId: string | null;
	onCalibrate: () => void;
	onUsePdfScale?: () => void;
	onDelete: (id: string) => void;
	onClearPage: () => void;
	onClearAll: () => void;
	onSelectMeasurement: (id: string) => void;
	onRenameMeasurement: (id: string, label: string) => void;
	onRecolorMeasurement: (id: string, color: string) => void;
}) {
	// Pages that hold at least one measurement, in order.
	const pages = [...new Set(measurements.map((m) => m.page))].sort(
		(a, b) => a - b
	);

	// Controlled accordion: multiple may be open (so Expand all works), but
	// navigating pages / selecting a shape auto-opens just the active page.
	const [openPages, setOpenPages] = useState<string[]>([String(page)]);
	useEffect(() => {
		setOpenPages([String(page)]);
	}, [page]);

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

			{/* Measurements toolbar: expand/collapse + clear actions. */}
			<div className="flex items-center gap-2 border-b p-2">
				<Button
					aria-label="Expand all pages"
					onClick={() => setOpenPages(pages.map(String))}
					size="icon-sm"
					title="Expand all"
					variant="outline"
				>
					<ChevronsDownIcon />
				</Button>
				<Button
					aria-label="Collapse all pages"
					onClick={() => setOpenPages([])}
					size="icon-sm"
					title="Collapse all"
					variant="outline"
				>
					<ChevronsUpIcon />
				</Button>
				<ConfirmAction
					description={`This removes every measurement on page ${page}. This can't be undone.`}
					onConfirm={onClearPage}
					title="Clear this page?"
					trigger={
						<Button className="flex-1" size="sm" variant="outline">
							Clear page
						</Button>
					}
				/>
				<ConfirmAction
					confirmLabel="Clear all"
					description="This removes every measurement on all pages. This can't be undone."
					onConfirm={onClearAll}
					title="Clear all pages?"
					trigger={
						<Button className="flex-1" size="sm" variant="destructive-outline">
							Clear all
						</Button>
					}
				/>
			</div>

			<ScrollArea className="min-h-0 flex-1" scrollFade>
				{pages.length === 0 ? (
					<p className="px-2 py-6 text-center text-muted-foreground text-sm">
						No measurements yet.
					</p>
				) : (
					<Accordion
						multiple
						onValueChange={(value) => setOpenPages(value as string[])}
						value={openPages}
					>
						{pages.map((pageNumber) => {
							const pageMeasurements = measurements.filter(
								(m) => m.page === pageNumber
							);
							const rows = buildRows(pageMeasurements);
							return (
								<AccordionItem key={pageNumber} value={String(pageNumber)}>
									<AccordionPrimitive.Header className="flex">
										<AccordionPrimitive.Trigger
											className={cn(
												'flex flex-1 cursor-pointer items-center justify-between gap-2 px-3 py-2.5 outline-none transition-colors hover:bg-muted/40',
												'focus-visible:ring-[3px] focus-visible:ring-ring',
												'[&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180'
											)}
											type="button"
										>
											<span className="flex items-center gap-2 font-medium text-sm">
												Page {pageNumber}
												<ChevronDownIcon
													className="size-4 shrink-0 opacity-70 transition-transform duration-200"
													data-slot="accordion-indicator"
												/>
											</span>
											<Badge size="lg" variant="outline">
												{rows.length}
											</Badge>
										</AccordionPrimitive.Trigger>
									</AccordionPrimitive.Header>
									<AccordionPanel className="px-2 pt-1 pb-2">
										<ul className="flex flex-col gap-1">
											{rows.map((row) =>
												row.kind === 'group' ? (
													<GroupRow
														color={row.members[0].color ?? FALLBACK_COLOR}
														isArea={AREA_TYPE_SET.has(row.members[0].type)}
														key={row.groupId}
														label={row.label}
														onDelete={() => onDelete(row.members[0].id)}
														onRecolor={(color) =>
															onRecolorMeasurement(row.members[0].id, color)
														}
														onSelect={() =>
															onSelectMeasurement(row.members[0].id)
														}
														selected={row.members.some(
															(m) => m.id === selectedId
														)}
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
														onRecolor={onRecolorMeasurement}
														onRename={onRenameMeasurement}
														onSelect={onSelectMeasurement}
														pageMeasurements={pageMeasurements}
														selectedId={selectedId}
													/>
												)
											)}
										</ul>
									</AccordionPanel>
								</AccordionItem>
							);
						})}
					</Accordion>
				)}
			</ScrollArea>
		</div>
	);
}

function MeasurementRow({
	measurement: m,
	pageMeasurements,
	selectedId,
	onDelete,
	onSelect,
	onRename,
	onRecolor,
}: {
	measurement: Measurement;
	pageMeasurements: Measurement[];
	selectedId: string | null;
	onDelete: (id: string) => void;
	onSelect: (id: string) => void;
	onRename: (id: string, label: string) => void;
	onRecolor: (id: string, color: string) => void;
}) {
	const Icon = TYPE_META[m.type].icon;
	const deductions = pageMeasurements.filter((d) => d.parentId === m.id);
	const color = m.color ?? FALLBACK_COLOR;
	const selected = m.id === selectedId;
	const ref = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({ block: 'nearest' });
		}
	}, [selected]);

	return (
		<li className="flex flex-col gap-1" ref={ref}>
			<div
				className={cn(
					'flex flex-col gap-1.5 rounded-md px-2 py-1.5',
					selected
						? 'bg-accent ring-1 ring-ring ring-inset'
						: 'hover:bg-accent/50'
				)}
			>
				<div className="flex items-center gap-2">
					<span className="shrink-0" style={{ color }}>
						<Icon className="size-4" />
					</span>
					<InlineTitle
						className="min-w-0 flex-1"
						onRename={(label) => onRename(m.id, label)}
						value={m.label}
					/>
					<DeleteConfirm
						description="This permanently removes the measurement. This can't be undone."
						label="Delete measurement"
						onConfirm={() => onDelete(m.id)}
					/>
				</div>
				<div className="flex items-center justify-between gap-2">
					<ValueBadge
						color={color}
						onSelect={() => onSelect(m.id)}
						value={measurementValue(m, pageMeasurements)}
					/>
					<ColorSwatchPicker
						label={`Colour for ${m.label}`}
						onChange={(next) => onRecolor(m.id, next)}
						value={color}
					/>
				</div>
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
								<DeleteConfirm
									description="This permanently removes the deduction. This can't be undone."
									label="Delete deduction"
									onConfirm={() => onDelete(d.id)}
								/>
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
	selected,
	onSelect,
	onDelete,
	onRecolor,
}: {
	label: string;
	value: string;
	color: string;
	isArea: boolean;
	selected: boolean;
	onSelect: () => void;
	onDelete: () => void;
	onRecolor: (color: string) => void;
}) {
	const ref = useRef<HTMLLIElement>(null);
	useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({ block: 'nearest' });
		}
	}, [selected]);

	return (
		<li
			className={cn(
				'flex flex-col gap-1.5 rounded-md px-2 py-1.5',
				selected
					? 'bg-accent ring-1 ring-ring ring-inset'
					: 'hover:bg-accent/50'
			)}
			ref={ref}
		>
			<div className="flex items-center gap-2">
				<span className="shrink-0" style={{ color }}>
					<Layers className="size-4" />
				</span>
				<p className="min-w-0 flex-1 truncate font-medium text-sm">{label}</p>
				<DeleteConfirm
					description="This permanently removes the whole group. This can't be undone."
					label="Delete group"
					onConfirm={onDelete}
				/>
			</div>
			<div className="flex items-center justify-between gap-2">
				<ValueBadge color={color} onSelect={onSelect} value={value} />
				<ColorSwatchPicker
					label={`Colour for ${label}`}
					onChange={onRecolor}
					value={color}
				/>
			</div>
		</li>
	);
}

// A soft, colour-matched badge showing the measurement value; clicking selects
// the shape and navigates to its page.
function ValueBadge({
	value,
	color,
	onSelect,
}: {
	value: string;
	color: string;
	onSelect: () => void;
}) {
	return (
		<button
			className="inline-flex cursor-pointer items-center gap-1 rounded-md border px-2 py-0.5 font-medium text-xs transition-opacity hover:opacity-80"
			onClick={onSelect}
			style={{
				backgroundColor: `${color}22`,
				borderColor: `${color}55`,
				color,
			}}
			title="Select on canvas"
			type="button"
		>
			<MousePointer2 className="size-3 shrink-0" />
			{value}
		</button>
	);
}

// Click the label to edit it inline; Enter/blur commits, Escape cancels.
function InlineTitle({
	value,
	onRename,
	className,
}: {
	value: string;
	onRename: (label: string) => void;
	className?: string;
}) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(value);

	const commit = () => {
		const trimmed = draft.trim();
		if (trimmed && trimmed !== value) {
			onRename(trimmed);
		} else {
			setDraft(value);
		}
		setEditing(false);
	};

	if (editing) {
		return (
			<Input
				autoFocus
				className={cn('h-7 text-sm', className)}
				nativeInput
				onBlur={commit}
				onChange={(event) => setDraft(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						commit();
					} else if (event.key === 'Escape') {
						setDraft(value);
						setEditing(false);
					}
				}}
				value={draft}
			/>
		);
	}

	return (
		<button
			className={cn('truncate text-left font-medium text-sm', className)}
			onClick={() => {
				setDraft(value);
				setEditing(true);
			}}
			title="Click to rename"
			type="button"
		>
			{value}
		</button>
	);
}

function DeleteConfirm({
	label,
	description,
	onConfirm,
}: {
	label: string;
	description: string;
	onConfirm: () => void;
}): ReactElement {
	return (
		<AlertDialog>
			<AlertDialogTrigger
				render={
					<Button
						aria-label={label}
						size="icon-sm"
						variant="destructive-outline"
					>
						<Trash2 />
					</Button>
				}
			/>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{label}?</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<AlertDialogClose
						render={
							<Button onClick={onConfirm} type="button" variant="destructive" />
						}
					>
						{label}
					</AlertDialogClose>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

function ConfirmAction({
	trigger,
	title,
	description,
	confirmLabel = 'Confirm',
	onConfirm,
}: {
	trigger: ReactElement;
	title: string;
	description: string;
	confirmLabel?: string;
	onConfirm: () => void;
}): ReactElement {
	return (
		<AlertDialog>
			<AlertDialogTrigger render={trigger} />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</AlertDialogClose>
					<AlertDialogClose
						render={
							<Button onClick={onConfirm} type="button" variant="destructive" />
						}
					>
						{confirmLabel}
					</AlertDialogClose>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
