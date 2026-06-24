'use client';
'use no memo';

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
import { Button } from '@workspace/ui/components/button';
import { ButtonGroup } from '@workspace/ui/components/group';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { cn } from '@workspace/ui/lib/utils';
import {
	ChevronDownIcon,
	ChevronsDownIcon,
	ChevronsUpIcon,
	Circle,
	Crosshair,
	Eye,
	EyeOff,
	Hash,
	Layers,
	MousePointer2,
	Pentagon,
	RotateCcw,
	Ruler,
	Square,
	Trash2,
} from 'lucide-react';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import {
	formatMeters,
	formatMethodLabel,
	formatSqm,
	netAreaSqm,
	roundUpWithWastage,
	unionMeasure,
	WASTAGE_OPTIONS,
} from '@/lib/takeoffs/geometry';
import {
	AREA_TYPE_SET,
	type Measurement,
	type MeasurementMethod,
	type MethodScope,
} from '@/lib/takeoffs/types';
import ColorSwatchPicker from './color-swatch-picker';

const FALLBACK_COLOR = '#2563eb';

const TYPE_META = {
	linear: { icon: Ruler, label: 'Linear' },
	rectangle: { icon: Square, label: 'Rectangle' },
	circle: { icon: Circle, label: 'Circle' },
	polygon: { icon: Pentagon, label: 'Polygon' },
	count: { icon: Hash, label: 'Count' },
} as const;

// A measured value with its unit. Area-like shapes report m², linear reports m.
interface NetValue {
	unit: 'm' | 'm²';
	value: number;
}

// Net measured value of a single shape: net area (after deductions) for area
// shapes, length for linear, or null for counts (which carry no wastage).
function measurementNetValue(
	m: Measurement,
	all: Measurement[]
): NetValue | null {
	if (AREA_TYPE_SET.has(m.type)) {
		// Parents report net area (gross when they have no deductions).
		return { value: netAreaSqm(m, all), unit: 'm²' };
	}
	if (m.type === 'linear') {
		return { value: m.valueMeters ?? 0, unit: 'm' };
	}
	return null;
}

// Combined net value of an Add group: union area for area groups, or the summed
// length for linear groups. Null when an area group has no resolvable scale.
function groupNetValue(
	members: Measurement[],
	isArea: boolean,
	mpp: number | null
): NetValue | null {
	if (isArea) {
		if (!mpp) {
			return null;
		}
		return { value: unionMeasure(members, mpp).valueSqm, unit: 'm²' };
	}
	const total = members.reduce((sum, m) => sum + (m.valueMeters ?? 0), 0);
	return { value: total, unit: 'm' };
}

// Actual value formatted with two decimals and its unit.
function formatActual({ value, unit }: NetValue): string {
	return unit === 'm²' ? formatSqm(value) : formatMeters(value);
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
	// Number groups per family in appearance order, but prefer the text detected
	// on the group's first shape when available.
	let areaGroupCount = 0;
	let linearGroupCount = 0;
	for (const row of rows) {
		if (row.kind === 'group') {
			const isArea = AREA_TYPE_SET.has(row.members[0].type);
			const fallback = isArea
				? `Area group ${++areaGroupCount}`
				: `Linear group ${++linearGroupCount}`;
			const customLabel = row.members.find((m) => m.groupLabel)?.groupLabel;
			row.label = customLabel ?? row.members[0].detectedText ?? fallback;
		}
	}
	return rows;
}

export default function MeasurementsPanel({
	page,
	measurements,
	documentMethod,
	pageMethods,
	metersPerPixel,
	globalWastage,
	selectedId,
	onOpenScaleDialog,
	onCalibrate,
	onResetPage,
	onDelete,
	onClearPage,
	onClearAll,
	onSelectMeasurement,
	onRenameMeasurement,
	onRenameGroup,
	onRecolorMeasurement,
	onSetMeasurementWastage,
	onSetMeasurementHeight,
	onToggleMeasurementHidden,
	onTogglePageHidden,
}: {
	page: number;
	measurements: Measurement[];
	documentMethod: MeasurementMethod | null;
	pageMethods: Record<number, MeasurementMethod>;
	metersPerPixel: number | null;
	globalWastage: number;
	selectedId: string | null;
	onOpenScaleDialog: (scope: MethodScope, targetPage: number) => void;
	onCalibrate: (scope: MethodScope, targetPage: number) => void;
	onResetPage: (targetPage: number) => void;
	onDelete: (id: string) => void;
	onClearPage: () => void;
	onClearAll: () => void;
	onSelectMeasurement: (id: string) => void;
	onRenameMeasurement: (id: string, label: string) => void;
	onRenameGroup: (groupId: string, label: string) => void;
	onRecolorMeasurement: (id: string, color: string) => void;
	onSetMeasurementWastage: (id: string, percent: number | null) => void;
	onSetMeasurementHeight: (id: string, heightMeters: number | null) => void;
	onToggleMeasurementHidden: (id: string) => void;
	onTogglePageHidden: (targetPage: number) => void;
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
			<div className="flex items-center justify-between border-b p-3">
				<h2 className="font-semibold text-sm">Measurements</h2>
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
							const pageHidden =
								pageMeasurements.length > 0 &&
								pageMeasurements.every((m) => m.hidden);
							return (
								<AccordionItem key={pageNumber} value={String(pageNumber)}>
									<AccordionPrimitive.Header className="flex items-center gap-1 bg-muted/50 pr-2">
										<AccordionPrimitive.Trigger
											className={cn(
												'flex flex-1 cursor-pointer items-center gap-2 px-3 py-2.5 outline-none transition-colors hover:bg-muted/40',
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
										</AccordionPrimitive.Trigger>
										<ButtonGroup>
											<HiddenToggle
												hidden={pageHidden}
												label={`all shapes on page ${pageNumber}`}
												onToggle={() => onTogglePageHidden(pageNumber)}
												variant="outline"
											/>
											<PageMethodChip
												documentMethod={documentMethod}
												hasOverride={pageMethods[pageNumber] !== undefined}
												method={pageMethods[pageNumber] ?? documentMethod}
												onCalibrate={onCalibrate}
												onOpenScaleDialog={onOpenScaleDialog}
												onResetPage={onResetPage}
												page={pageNumber}
											/>
										</ButtonGroup>
									</AccordionPrimitive.Header>
									<AccordionPanel className="px-2 pt-1 pb-2">
										<ul className="flex flex-col gap-1">
											{rows.map((row) =>
												row.kind === 'group' ? (
													<GroupRow
														color={row.members[0].color ?? FALLBACK_COLOR}
														globalWastage={globalWastage}
														heightMeters={row.members[0].heightMeters}
														hidden={row.members[0].hidden}
														key={row.groupId}
														label={row.label}
														net={groupNetValue(
															row.members,
															AREA_TYPE_SET.has(row.members[0].type),
															metersPerPixel
														)}
														onDelete={() => onDelete(row.members[0].id)}
														onRecolor={(color) =>
															onRecolorMeasurement(row.members[0].id, color)
														}
														onRename={(label) =>
															onRenameGroup(row.groupId, label)
														}
														onSelect={() =>
															onSelectMeasurement(row.members[0].id)
														}
														onSetHeight={(height) =>
															onSetMeasurementHeight(row.members[0].id, height)
														}
														onSetWastage={(percent) =>
															onSetMeasurementWastage(
																row.members[0].id,
																percent
															)
														}
														onToggleHidden={() =>
															onToggleMeasurementHidden(row.members[0].id)
														}
														selected={row.members.some(
															(m) => m.id === selectedId
														)}
														wastagePercent={row.members[0].wastagePercent}
													/>
												) : (
													<MeasurementRow
														globalWastage={globalWastage}
														key={row.measurement.id}
														measurement={row.measurement}
														onDelete={onDelete}
														onRecolor={onRecolorMeasurement}
														onRename={onRenameMeasurement}
														onSelect={onSelectMeasurement}
														onSetHeight={onSetMeasurementHeight}
														onSetWastage={onSetMeasurementWastage}
														onToggleHidden={onToggleMeasurementHidden}
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

// Per-page scale/calibration chip shown in each accordion header. Reflects the
// page's effective method (its own override, or the inherited document default)
// and opens a popover to set an override or reset to the document default.
function PageMethodChip({
	page,
	method,
	hasOverride,
	documentMethod,
	onOpenScaleDialog,
	onCalibrate,
	onResetPage,
}: {
	page: number;
	method: MeasurementMethod | null;
	hasOverride: boolean;
	documentMethod: MeasurementMethod | null;
	onOpenScaleDialog: (scope: MethodScope, targetPage: number) => void;
	onCalibrate: (scope: MethodScope, targetPage: number) => void;
	onResetPage: (targetPage: number) => void;
}) {
	const [open, setOpen] = useState(false);
	const label = method ? formatMethodLabel(method) : 'Not set';

	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				render={
					<Button
						aria-label={`Scale: ${label}`}
						size="icon-sm"
						title={
							hasOverride
								? `This page has its own scale (${label})`
								: `Inherited from the document default (${label})`
						}
						variant={hasOverride ? 'secondary' : 'outline'}
					>
						{method?.kind === 'calibration' ? (
							<Crosshair className="size-4" />
						) : (
							<Ruler className="size-4" />
						)}
					</Button>
				}
			/>
			<PopoverContent align="end" className="w-60">
				<div className="flex flex-col gap-2">
					<p className="font-medium text-sm">Scale · Page {page}</p>
					<p className="text-muted-foreground text-xs">
						{hasOverride
							? 'This page overrides the document default.'
							: 'Following the document default. Set an override below.'}
					</p>
					<Button
						className="justify-start"
						onClick={() => {
							setOpen(false);
							onOpenScaleDialog('page', page);
						}}
						size="sm"
						variant="outline"
					>
						<Ruler />
						Drawing scale…
					</Button>
					<Button
						className="justify-start"
						onClick={() => {
							setOpen(false);
							onCalibrate('page', page);
						}}
						size="sm"
						variant="outline"
					>
						<Crosshair />
						Calibrate from line
					</Button>
					{hasOverride && (
						<Button
							className="justify-start"
							onClick={() => {
								setOpen(false);
								onResetPage(page);
							}}
							size="sm"
							variant="ghost"
						>
							<RotateCcw />
							{documentMethod
								? `Reset to default (${formatMethodLabel(documentMethod)})`
								: 'Reset to document default'}
						</Button>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

function MeasurementRow({
	measurement: m,
	pageMeasurements,
	selectedId,
	globalWastage,
	onDelete,
	onSelect,
	onRename,
	onRecolor,
	onSetWastage,
	onSetHeight,
	onToggleHidden,
}: {
	measurement: Measurement;
	pageMeasurements: Measurement[];
	selectedId: string | null;
	globalWastage: number;
	onDelete: (id: string) => void;
	onSelect: (id: string) => void;
	onRename: (id: string, label: string) => void;
	onRecolor: (id: string, color: string) => void;
	onSetWastage: (id: string, percent: number | null) => void;
	onSetHeight: (id: string, heightMeters: number | null) => void;
	onToggleHidden: (id: string) => void;
}) {
	const Icon = TYPE_META[m.type].icon;
	const deductions = pageMeasurements.filter((d) => d.parentId === m.id);
	const color = m.color ?? FALLBACK_COLOR;
	const selected = m.id === selectedId;
	const net = measurementNetValue(m, pageMeasurements);
	const ref = useRef<HTMLLIElement>(null);

	useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({ block: 'nearest' });
		}
	}, [selected]);

	return (
		<li
			className={cn(
				'flex flex-col gap-1 rounded-md p-1',
				selected && 'bg-accent ring-1 ring-ring ring-inset',
				m.hidden && 'opacity-60'
			)}
			ref={ref}
		>
			<div
				className={cn(
					'flex flex-col gap-1.5 rounded-md px-2 py-1.5',
					!selected && 'hover:bg-accent/50'
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
					<ButtonGroup>
						<HiddenToggle
							hidden={m.hidden}
							label={m.label}
							onToggle={() => onToggleHidden(m.id)}
							variant="outline"
						/>
						<ColorSwatchPicker
							label={`Colour for ${m.label}`}
							onChange={(next) => onRecolor(m.id, next)}
							value={color}
						/>
						<DeleteConfirm
							description="This permanently removes the measurement. This can't be undone."
							label="Delete measurement"
							onConfirm={() => onDelete(m.id)}
						/>
					</ButtonGroup>
				</div>
				<div className="flex items-start justify-between gap-2">
					{net ? (
						<MeasurementBadges
							color={color}
							globalWastage={globalWastage}
							net={net}
							onSelect={() => onSelect(m.id)}
							onSetWastage={(percent) => onSetWastage(m.id, percent)}
							wastagePercent={m.wastagePercent}
						/>
					) : (
						<ValueBadge
							color={color}
							onSelect={() => onSelect(m.id)}
							value={`${m.count ?? 0} markers`}
						/>
					)}
				</div>
				{m.type === 'linear' && net && (
					<HeightAreaRow
						color={color}
						heightMeters={m.heightMeters}
						onSelect={() => onSelect(m.id)}
						onSetHeight={(height) => onSetHeight(m.id, height)}
						roundedLength={roundUpWithWastage(
							net.value,
							m.wastagePercent ?? globalWastage
						)}
					/>
				)}
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
									<InlineTitle
										className="w-full text-destructive text-xs"
										onRename={(label) => onRename(d.id, label)}
										value={d.label}
									/>
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
	net,
	color,
	globalWastage,
	wastagePercent,
	heightMeters,
	hidden,
	selected,
	onSelect,
	onDelete,
	onRecolor,
	onRename,
	onSetWastage,
	onSetHeight,
	onToggleHidden,
}: {
	label: string;
	net: NetValue | null;
	color: string;
	globalWastage: number;
	wastagePercent?: number;
	heightMeters?: number;
	hidden?: boolean;
	selected: boolean;
	onSelect: () => void;
	onDelete: () => void;
	onRecolor: (color: string) => void;
	onRename: (label: string) => void;
	onSetWastage: (percent: number | null) => void;
	onSetHeight: (heightMeters: number | null) => void;
	onToggleHidden: () => void;
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
					: 'hover:bg-accent/50',
				hidden && 'opacity-60'
			)}
			ref={ref}
		>
			<div className="flex items-center gap-2">
				<span className="shrink-0" style={{ color }}>
					<Layers className="size-4" />
				</span>
				<InlineTitle
					className="min-w-0 flex-1"
					onRename={onRename}
					value={label}
				/>
				<ButtonGroup>
					<HiddenToggle
						hidden={hidden}
						label={label}
						onToggle={onToggleHidden}
						variant="outline"
					/>
					<ColorSwatchPicker
						label={`Colour for ${label}`}
						onChange={onRecolor}
						value={color}
					/>
					<DeleteConfirm
						description="This permanently removes the whole group. This can't be undone."
						label="Delete group"
						onConfirm={onDelete}
					/>
				</ButtonGroup>
			</div>
			<div className="flex items-start justify-between gap-2">
				{net ? (
					<MeasurementBadges
						color={color}
						globalWastage={globalWastage}
						net={net}
						onSelect={onSelect}
						onSetWastage={onSetWastage}
						wastagePercent={wastagePercent}
					/>
				) : (
					<ValueBadge color={color} onSelect={onSelect} value="—" />
				)}
			</div>
			{net?.unit === 'm' && (
				<HeightAreaRow
					color={color}
					heightMeters={heightMeters}
					onSelect={onSelect}
					onSetHeight={onSetHeight}
					roundedLength={roundUpWithWastage(
						net.value,
						wastagePercent ?? globalWastage
					)}
				/>
			)}
		</li>
	);
}

// The badges for a value-bearing measurement: actual (A) and rounded-with-
// wastage (R) on the left, and a clickable wastage badge (W) on the right that
// overrides this measurement's wastage. Counts use a plain ValueBadge instead
// (they carry no wastage).
function MeasurementBadges({
	net,
	color,
	globalWastage,
	wastagePercent,
	onSelect,
	onSetWastage,
}: {
	net: NetValue;
	color: string;
	globalWastage: number;
	wastagePercent?: number;
	onSelect: () => void;
	onSetWastage: (percent: number | null) => void;
}) {
	const effectiveWastage = wastagePercent ?? globalWastage;
	const rounded = roundUpWithWastage(net.value, effectiveWastage);
	return (
		<div className="flex flex-1 items-start justify-between gap-2">
			<div className="flex flex-wrap items-center gap-1">
				<ValueBadge
					color={color}
					onSelect={onSelect}
					showIcon={false}
					title="Actual measured value"
					value={`A ${formatActual(net)}`}
				/>
				<ValueBadge
					color={color}
					onSelect={onSelect}
					showIcon={false}
					title={`Rounded up — incl. ${effectiveWastage}% wastage`}
					value={`R ${rounded} ${net.unit}`}
				/>
			</div>
			<WastageBadge
				effectiveWastage={effectiveWastage}
				globalWastage={globalWastage}
				onSelect={onSetWastage}
				overridden={wastagePercent !== undefined}
			/>
		</div>
	);
}

// Optional wall-height input for a linear measurement (or linear group). Height
// is entered and stored in metres. When a positive height is set, a wall-area
// badge is shown beside it: rounded length × height, rounded up to whole m²
// (the rounded length already includes wastage, so it isn't applied again).
function HeightAreaRow({
	color,
	heightMeters,
	roundedLength,
	onSelect,
	onSetHeight,
}: {
	color: string;
	heightMeters?: number;
	roundedLength: number;
	onSelect: () => void;
	onSetHeight: (heightMeters: number | null) => void;
}) {
	const [draft, setDraft] = useState(heightMeters ? String(heightMeters) : '');

	// Resync when the height changes elsewhere (e.g. group members share one).
	useEffect(() => {
		setDraft(heightMeters ? String(heightMeters) : '');
	}, [heightMeters]);

	const commit = () => {
		const parsed = Number.parseFloat(draft);
		if (Number.isFinite(parsed) && parsed > 0) {
			if (parsed !== heightMeters) {
				onSetHeight(parsed);
			}
		} else {
			onSetHeight(null);
			setDraft('');
		}
	};

	const area =
		heightMeters && heightMeters > 0
			? Math.ceil(roundedLength * heightMeters)
			: null;

	return (
		<div className="flex items-center gap-2">
			<InputGroup className="flex-1">
				<InputGroupInput
					aria-label="Wall height in metres"
					inputMode="decimal"
					onBlur={commit}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter') {
							commit();
						}
					}}
					placeholder="Height"
					size="sm"
					value={draft}
				/>
				<InputGroupAddon align="inline-end">
					<InputGroupText>m</InputGroupText>
				</InputGroupAddon>
			</InputGroup>
			{area !== null && (
				<ValueBadge
					color={color}
					onSelect={onSelect}
					showIcon={false}
					title="Wall area — rounded length × height"
					value={`${area} m²`}
				/>
			)}
		</div>
	);
}

// Clickable wastage % badge. Shows the effective wastage and opens a popover to
// override it for this measurement, or reset it to the global default.
function WastageBadge({
	effectiveWastage,
	globalWastage,
	overridden,
	onSelect,
}: {
	effectiveWastage: number;
	globalWastage: number;
	overridden: boolean;
	onSelect: (percent: number | null) => void;
}) {
	const [open, setOpen] = useState(false);
	return (
		<Popover onOpenChange={setOpen} open={open}>
			<PopoverTrigger
				render={
					<button
						className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-input bg-background px-2 py-0.5 font-medium text-foreground text-xs transition-colors hover:bg-accent"
						title={
							overridden
								? 'Custom wastage for this measurement'
								: 'Using the global wastage default'
						}
						type="button"
					>
						W {effectiveWastage}%
					</button>
				}
			/>
			<PopoverContent align="end" className="w-60">
				<div className="flex flex-col gap-2">
					<p className="font-medium text-sm">Wastage allowance</p>
					<div className="grid grid-cols-4 gap-1">
						{WASTAGE_OPTIONS.map((option) => (
							<Button
								key={option}
								onClick={() => {
									setOpen(false);
									onSelect(option);
								}}
								size="sm"
								variant={effectiveWastage === option ? 'default' : 'outline'}
							>
								{option}%
							</Button>
						))}
					</div>
					<Button
						className="justify-start"
						onClick={() => {
							setOpen(false);
							onSelect(null);
						}}
						size="sm"
						variant="ghost"
					>
						<RotateCcw />
						Use global default ({globalWastage}%)
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
}

// A soft, colour-matched badge showing the measurement value; clicking selects
// the shape and navigates to its page.
function ValueBadge({
	value,
	color,
	onSelect,
	showIcon = true,
	title = 'Select on canvas',
}: {
	value: string;
	color: string;
	onSelect: () => void;
	showIcon?: boolean;
	title?: string;
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
			title={title}
			type="button"
		>
			{showIcon && <MousePointer2 className="size-3 shrink-0" />}
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

// Eye toggle that shows/hides a shape (or group/page) on the canvas without
// removing it from the measurements panel.
function HiddenToggle({
	hidden,
	label,
	onToggle,
	variant = 'ghost',
}: {
	hidden?: boolean;
	label: string;
	onToggle: () => void;
	variant?: 'ghost' | 'outline';
}): ReactElement {
	return (
		<Button
			aria-label={hidden ? `Show ${label}` : `Hide ${label}`}
			onClick={onToggle}
			size="icon-sm"
			title={hidden ? 'Show on canvas' : 'Hide on canvas'}
			variant={variant}
		>
			{hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
		</Button>
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
