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
import { Checkbox } from '@workspace/ui/components/checkbox';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogPanel,
	DialogTitle,
} from '@workspace/ui/components/dialog';
import { Input } from '@workspace/ui/components/input';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Menu,
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuSub,
	MenuSubPopup,
	MenuSubTrigger,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@workspace/ui/components/popover';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';
import {
	ChevronDownIcon,
	ChevronsDownIcon,
	ChevronsUpIcon,
	Circle,
	Crosshair,
	Download,
	EllipsisVertical,
	Eye,
	EyeOff,
	FileText,
	Hash,
	Layers,
	MousePointer2,
	Palette,
	Pentagon,
	RotateCcw,
	Ruler,
	Square,
	Table,
	Trash2,
} from 'lucide-react';
import { type ReactElement, useEffect, useRef, useState } from 'react';
import {
	adjustArea,
	formatMeters,
	formatMethodLabel,
	formatSqm,
	netAreaSqm,
	roundUpWithWastage,
	SHAPE_PALETTE,
	unionMeasure,
	WASTAGE_OPTIONS,
} from '@/lib/takeoffs/geometry';
import {
	AREA_TYPE_SET,
	type Measurement,
	type MeasurementMethod,
	type MethodScope,
} from '@/lib/takeoffs/types';
import CalculatorPopover from './calculator-popover';

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

export type Row =
	| { kind: 'group'; groupId: string; label: string; members: Measurement[] }
	| { kind: 'single'; measurement: Measurement };

// Collapse Add-group members into one row (preserving draw order); ungrouped
// shapes stay as individual rows. Deductions are folded into their parent.
export function buildRows(pageMeasurements: Measurement[]): Row[] {
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

// Which columns a legend renders. Color/name/description default on; the rounded
// measurement column defaults off and is opt-in via the Add Legend dialog.
export interface LegendDisplay {
	color: boolean;
	description: boolean;
	measurement: boolean;
	name: boolean;
}

export const DEFAULT_LEGEND_DISPLAY: LegendDisplay = {
	color: true,
	name: true,
	description: true,
	measurement: false,
};

// One displayed legend row. `measurement` is the formatted rounded value (empty
// when it can't be resolved); renderers choose which fields to show via the
// per-legend display flags.
export interface LegendEntry {
	color: string;
	description: string;
	id: string;
	measurement: string;
	name: string;
}

// Rounded length/height/area text for a linear measurement or linear group.
function formatLinearText(
	roundedLength: number,
	heightMeters: number | undefined,
	areaAddSqm: number | undefined,
	areaSubtractSqm: number | undefined
): string {
	if (heightMeters && heightMeters > 0) {
		const area = adjustArea(
			Math.ceil(roundedLength * heightMeters),
			areaAddSqm,
			areaSubtractSqm
		);
		return `L - ${roundedLength} m, H - ${heightMeters} m, A - ${area} m²`;
	}
	return `L - ${roundedLength} m`;
}

// Rounded measurement text for a single shape, mirroring the panel's badges.
function singleMeasurementText(
	m: Measurement,
	all: Measurement[],
	globalWastage: number
): string {
	if (m.type === 'count') {
		return `${m.count ?? 0}`;
	}
	const wastage = m.wastagePercent ?? globalWastage;
	if (AREA_TYPE_SET.has(m.type)) {
		const rounded = adjustArea(
			roundUpWithWastage(netAreaSqm(m, all), wastage),
			m.areaAddSqm,
			m.areaSubtractSqm
		);
		return `A - ${rounded} m²`;
	}
	const roundedLength = roundUpWithWastage(m.valueMeters ?? 0, wastage);
	return formatLinearText(
		roundedLength,
		m.heightMeters,
		m.areaAddSqm,
		m.areaSubtractSqm
	);
}

// Rounded measurement text for an Add group, using the group's combined value
// and its first member for wastage/height/adjustments (as GroupRow does).
function groupMeasurementText(
	members: Measurement[],
	globalWastage: number,
	mpp: number | null
): string {
	const head = members[0];
	const isArea = AREA_TYPE_SET.has(head.type);
	const net = groupNetValue(members, isArea, mpp);
	if (!net) {
		return '';
	}
	const wastage = head.wastagePercent ?? globalWastage;
	if (net.unit === 'm²') {
		const rounded = adjustArea(
			roundUpWithWastage(net.value, wastage),
			head.areaAddSqm,
			head.areaSubtractSqm
		);
		return `A - ${rounded} m²`;
	}
	const roundedLength = roundUpWithWastage(net.value, wastage);
	return formatLinearText(
		roundedLength,
		head.heightMeters,
		head.areaAddSqm,
		head.areaSubtractSqm
	);
}

// Build legend rows from a page's (filtered, non-hidden) measurements, reusing
// the panel's grouping so the legend never drifts from the list. Every field is
// computed; renderers pick which to show via the legend's display flags.
export function buildLegendEntries(
	measurements: Measurement[],
	globalWastage: number,
	mpp: number | null
): LegendEntry[] {
	return buildRows(measurements).map((row) => {
		if (row.kind === 'group') {
			return {
				id: row.groupId,
				color: row.members[0].color ?? FALLBACK_COLOR,
				name: row.label,
				description: row.members.find((m) => m.description)?.description ?? '',
				measurement: groupMeasurementText(row.members, globalWastage, mpp),
			};
		}
		const m = row.measurement;
		return {
			id: m.id,
			color: m.color ?? FALLBACK_COLOR,
			name: m.label,
			description: m.description ?? '',
			measurement: singleMeasurementText(m, measurements, globalWastage),
		};
	});
}

export default function MeasurementsPanel({
	page,
	measurements,
	documentMethod,
	pageMethods,
	pageTitles,
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
	onRenamePage,
	onRecolorMeasurement,
	onSetMeasurementWastage,
	onSetMeasurementHeight,
	onSetMeasurementAreaAdjust,
	onSetMeasurementDescription,
	onToggleMeasurementHidden,
	onTogglePageHidden,
	legendPages,
	onAddLegend,
	onRemoveLegend,
	onDownloadPage,
	width,
}: {
	page: number;
	measurements: Measurement[];
	documentMethod: MeasurementMethod | null;
	pageMethods: Record<number, MeasurementMethod>;
	pageTitles: Record<number, string>;
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
	onRenamePage: (targetPage: number, title: string) => void;
	onRecolorMeasurement: (id: string, color: string) => void;
	onSetMeasurementWastage: (id: string, percent: number | null) => void;
	onSetMeasurementHeight: (id: string, heightMeters: number | null) => void;
	onSetMeasurementAreaAdjust: (
		id: string,
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
	onSetMeasurementDescription: (id: string, description: string) => void;
	onToggleMeasurementHidden: (id: string) => void;
	onTogglePageHidden: (targetPage: number) => void;
	/** Pages that currently have a legend on the canvas. */
	legendPages: Set<number>;
	onAddLegend: (targetPage: number, display: LegendDisplay) => void;
	onRemoveLegend: (targetPage: number) => void;
	onDownloadPage: (targetPage: number) => void;
	/** Panel width in pixels, controlled by the drag handle in the parent. */
	width: number;
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
		<div
			className="flex h-full shrink-0 flex-col rounded-lg border bg-card"
			style={{ width }}
		>
			<div className="flex items-center justify-between border-b p-3">
				<h2 className="font-semibold text-sm">Measurements</h2>
				<CalculatorPopover />
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
									<AccordionPrimitive.Header className="flex items-center gap-2 bg-muted/50 px-3 py-2.5">
										<InlineTitle
											className="min-w-0 flex-1"
											onRename={(title) => onRenamePage(pageNumber, title)}
											value={pageTitles[pageNumber] ?? `Page ${pageNumber}`}
										/>
										<PageActionsMenu
											documentMethod={documentMethod}
											hasLegend={legendPages.has(pageNumber)}
											hasOverride={pageMethods[pageNumber] !== undefined}
											method={pageMethods[pageNumber] ?? documentMethod}
											onAddLegend={onAddLegend}
											onCalibrate={onCalibrate}
											onDownloadPage={onDownloadPage}
											onOpenScaleDialog={onOpenScaleDialog}
											onRemoveLegend={onRemoveLegend}
											onResetPage={onResetPage}
											onToggleHidden={() => onTogglePageHidden(pageNumber)}
											page={pageNumber}
											pageHidden={pageHidden}
										/>
										<AccordionPrimitive.Trigger
											className={cn(
												'flex shrink-0 cursor-pointer items-center rounded outline-none transition-colors hover:bg-muted/40',
												'focus-visible:ring-[3px] focus-visible:ring-ring',
												'[&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180'
											)}
											type="button"
										>
											<ChevronDownIcon
												className="size-4 shrink-0 opacity-70 transition-transform duration-200"
												data-slot="accordion-indicator"
											/>
										</AccordionPrimitive.Trigger>
									</AccordionPrimitive.Header>
									<AccordionPanel className="pt-1 pb-2">
										<ul className="flex flex-col divide-y">
											{rows.map((row) =>
												row.kind === 'group' ? (
													<GroupRow
														areaAddSqm={row.members[0].areaAddSqm}
														areaSubtractSqm={row.members[0].areaSubtractSqm}
														color={row.members[0].color ?? FALLBACK_COLOR}
														description={row.members[0].description}
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
														onSetAreaAdjust={(field, value) =>
															onSetMeasurementAreaAdjust(
																row.members[0].id,
																field,
																value
															)
														}
														onSetDescription={(description) =>
															onSetMeasurementDescription(
																row.members[0].id,
																description
															)
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
														onSetAreaAdjust={onSetMeasurementAreaAdjust}
														onSetDescription={onSetMeasurementDescription}
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

// The right-justified actions menu for a page accordion header: a 3-dot trigger
// opening a popup that toggles visibility of all the page's shapes and exposes
// the page's scale actions (set a drawing scale, calibrate from a line, or reset
// to the document default). The current effective scale is shown as a label.
function PageActionsMenu({
	page,
	pageHidden,
	method,
	hasOverride,
	hasLegend,
	documentMethod,
	onToggleHidden,
	onAddLegend,
	onRemoveLegend,
	onDownloadPage,
	onOpenScaleDialog,
	onCalibrate,
	onResetPage,
}: {
	page: number;
	pageHidden: boolean;
	method: MeasurementMethod | null;
	hasOverride: boolean;
	hasLegend: boolean;
	documentMethod: MeasurementMethod | null;
	onToggleHidden: () => void;
	onAddLegend: (targetPage: number, display: LegendDisplay) => void;
	onRemoveLegend: (targetPage: number) => void;
	onDownloadPage: (targetPage: number) => void;
	onOpenScaleDialog: (scope: MethodScope, targetPage: number) => void;
	onCalibrate: (scope: MethodScope, targetPage: number) => void;
	onResetPage: (targetPage: number) => void;
}): ReactElement {
	const scaleLabel = method ? formatMethodLabel(method) : 'Not set';
	const [legendDialogOpen, setLegendDialogOpen] = useState(false);

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Actions for page ${page}`}
							size="icon-sm"
							variant="ghost"
						>
							<EllipsisVertical />
						</Button>
					}
				/>
				<MenuPopup align="end">
					<MenuItem onClick={onToggleHidden}>
						{pageHidden ? <Eye /> : <EyeOff />}
						{pageHidden ? 'Show page on canvas' : 'Hide page on canvas'}
					</MenuItem>
					<MenuItem
						onClick={() =>
							hasLegend ? onRemoveLegend(page) : setLegendDialogOpen(true)
						}
					>
						<Table />
						{hasLegend ? 'Remove Legend' : 'Add Legend'}
					</MenuItem>
					<MenuItem onClick={() => onDownloadPage(page)}>
						<Download />
						Download Page
					</MenuItem>
					<MenuSeparator />
					<MenuGroup>
						<MenuGroupLabel>
							Scale · {hasOverride ? scaleLabel : `${scaleLabel} (default)`}
						</MenuGroupLabel>
						<MenuItem onClick={() => onOpenScaleDialog('page', page)}>
							<Ruler />
							Drawing scale…
						</MenuItem>
						<MenuItem onClick={() => onCalibrate('page', page)}>
							<Crosshair />
							Calibrate from line
						</MenuItem>
						{hasOverride && (
							<MenuItem onClick={() => onResetPage(page)}>
								<RotateCcw />
								{documentMethod
									? `Reset to default (${formatMethodLabel(documentMethod)})`
									: 'Reset to document default'}
							</MenuItem>
						)}
					</MenuGroup>
				</MenuPopup>
			</Menu>
			<LegendOptionsDialog
				onConfirm={(display) => onAddLegend(page, display)}
				onOpenChange={setLegendDialogOpen}
				open={legendDialogOpen}
			/>
		</>
	);
}

const LEGEND_OPTION_FIELDS = [
	{ key: 'color', label: 'Color' },
	{ key: 'name', label: 'Measurement Name' },
	{ key: 'description', label: 'Description' },
	{ key: 'measurement', label: 'Measurement' },
] as const;

// Lets the user pick which columns a new legend shows before it is added. Color,
// name and description are on by default; the rounded measurement column is opt-in.
function LegendOptionsDialog({
	open,
	onOpenChange,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (next: boolean) => void;
	onConfirm: (display: LegendDisplay) => void;
}): ReactElement {
	const [display, setDisplay] = useState<LegendDisplay>(DEFAULT_LEGEND_DISPLAY);

	// Reset to defaults each time the dialog opens.
	useEffect(() => {
		if (open) {
			setDisplay(DEFAULT_LEGEND_DISPLAY);
		}
	}, [open]);

	const confirm = () => {
		onConfirm(display);
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add legend</DialogTitle>
					<DialogDescription>
						Choose which details to include in the legend.
					</DialogDescription>
				</DialogHeader>
				<DialogPanel className="flex flex-col gap-3">
					{LEGEND_OPTION_FIELDS.map((field) => (
						<label
							className="flex items-center gap-2 font-medium text-sm"
							htmlFor={`legend-option-${field.key}`}
							key={field.key}
						>
							<Checkbox
								checked={display[field.key]}
								id={`legend-option-${field.key}`}
								onCheckedChange={(checked) =>
									setDisplay((prev) => ({
										...prev,
										[field.key]: checked === true,
									}))
								}
							/>
							{field.label}
						</label>
					))}
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button onClick={confirm} type="button">
						Add Legend
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
	onSetAreaAdjust,
	onSetDescription,
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
	onSetAreaAdjust: (
		id: string,
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
	onSetDescription: (id: string, description: string) => void;
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
					<RowActionsMenu
						color={color}
						deleteDescription="This permanently removes the measurement. This can't be undone."
						deleteLabel="Delete measurement"
						description={m.description}
						hidden={m.hidden}
						label={m.label}
						onDelete={() => onDelete(m.id)}
						onRecolor={(next) => onRecolor(m.id, next)}
						onSetDescription={(description) =>
							onSetDescription(m.id, description)
						}
						onToggleHidden={() => onToggleHidden(m.id)}
					/>
				</div>
				<div className="flex items-start justify-between gap-2">
					{net ? (
						<MeasurementBadges
							areaAddSqm={m.areaAddSqm}
							areaSubtractSqm={m.areaSubtractSqm}
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
				{net?.unit === 'm²' && (
					<AreaAdjustRow
						addSqm={m.areaAddSqm}
						onSetAdd={(value) => onSetAreaAdjust(m.id, 'areaAddSqm', value)}
						onSetSubtract={(value) =>
							onSetAreaAdjust(m.id, 'areaSubtractSqm', value)
						}
						subtractSqm={m.areaSubtractSqm}
					/>
				)}
				{m.type === 'linear' && net && (
					<HeightAreaRow
						areaAddSqm={m.areaAddSqm}
						areaSubtractSqm={m.areaSubtractSqm}
						color={color}
						heightMeters={m.heightMeters}
						onSelect={() => onSelect(m.id)}
						onSetAreaAdjust={(field, value) =>
							onSetAreaAdjust(m.id, field, value)
						}
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
	description,
	globalWastage,
	wastagePercent,
	heightMeters,
	areaAddSqm,
	areaSubtractSqm,
	hidden,
	selected,
	onSelect,
	onDelete,
	onRecolor,
	onRename,
	onSetWastage,
	onSetHeight,
	onSetAreaAdjust,
	onSetDescription,
	onToggleHidden,
}: {
	label: string;
	net: NetValue | null;
	color: string;
	description?: string;
	globalWastage: number;
	wastagePercent?: number;
	heightMeters?: number;
	areaAddSqm?: number;
	areaSubtractSqm?: number;
	hidden?: boolean;
	selected: boolean;
	onSelect: () => void;
	onDelete: () => void;
	onRecolor: (color: string) => void;
	onRename: (label: string) => void;
	onSetWastage: (percent: number | null) => void;
	onSetHeight: (heightMeters: number | null) => void;
	onSetAreaAdjust: (
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
	onSetDescription: (description: string) => void;
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
				<RowActionsMenu
					color={color}
					deleteDescription="This permanently removes the whole group. This can't be undone."
					deleteLabel="Delete group"
					description={description}
					hidden={hidden}
					label={label}
					onDelete={onDelete}
					onRecolor={onRecolor}
					onSetDescription={onSetDescription}
					onToggleHidden={onToggleHidden}
				/>
			</div>
			<div className="flex items-start justify-between gap-2">
				{net ? (
					<MeasurementBadges
						areaAddSqm={areaAddSqm}
						areaSubtractSqm={areaSubtractSqm}
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
			{net?.unit === 'm²' && (
				<AreaAdjustRow
					addSqm={areaAddSqm}
					onSetAdd={(value) => onSetAreaAdjust('areaAddSqm', value)}
					onSetSubtract={(value) => onSetAreaAdjust('areaSubtractSqm', value)}
					subtractSqm={areaSubtractSqm}
				/>
			)}
			{net?.unit === 'm' && (
				<HeightAreaRow
					areaAddSqm={areaAddSqm}
					areaSubtractSqm={areaSubtractSqm}
					color={color}
					heightMeters={heightMeters}
					onSelect={onSelect}
					onSetAreaAdjust={onSetAreaAdjust}
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
	areaAddSqm,
	areaSubtractSqm,
	onSelect,
	onSetWastage,
}: {
	net: NetValue;
	color: string;
	globalWastage: number;
	wastagePercent?: number;
	areaAddSqm?: number;
	areaSubtractSqm?: number;
	onSelect: () => void;
	onSetWastage: (percent: number | null) => void;
}) {
	const effectiveWastage = wastagePercent ?? globalWastage;
	const roundedRaw = roundUpWithWastage(net.value, effectiveWastage);
	// Manual +/− adjustments apply only to area values (length is never adjusted).
	const adjusted = areaAddSqm !== undefined || areaSubtractSqm !== undefined;
	const rounded =
		net.unit === 'm²'
			? adjustArea(roundedRaw, areaAddSqm, areaSubtractSqm)
			: roundedRaw;
	const roundedTitle =
		net.unit === 'm²' && adjusted
			? `Rounded up — incl. ${effectiveWastage}% wastage and manual adjustments`
			: `Rounded up — incl. ${effectiveWastage}% wastage`;
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
					title={roundedTitle}
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
// (the rounded length already includes wastage, so it isn't applied again), plus
// any manual +/− adjustments. The adjustment inputs appear only once a height is
// set, since they act on the height-based area.
function HeightAreaRow({
	color,
	heightMeters,
	roundedLength,
	areaAddSqm,
	areaSubtractSqm,
	onSelect,
	onSetHeight,
	onSetAreaAdjust,
}: {
	color: string;
	heightMeters?: number;
	roundedLength: number;
	areaAddSqm?: number;
	areaSubtractSqm?: number;
	onSelect: () => void;
	onSetHeight: (heightMeters: number | null) => void;
	onSetAreaAdjust: (
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
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
			? adjustArea(
					Math.ceil(roundedLength * heightMeters),
					areaAddSqm,
					areaSubtractSqm
				)
			: null;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<InputGroup className="flex-1">
					<InputGroupInput
						aria-label="Wall height in metres"
						inputMode="decimal"
						onBlur={commit}
						onChange={(event) => setDraft(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								event.currentTarget.blur();
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
						title="Wall area — rounded length × height, incl. adjustments"
						value={`${area} m²`}
					/>
				)}
			</div>
			{area !== null && (
				<AreaAdjustRow
					addSqm={areaAddSqm}
					onSetAdd={(value) => onSetAreaAdjust('areaAddSqm', value)}
					onSetSubtract={(value) => onSetAreaAdjust('areaSubtractSqm', value)}
					subtractSqm={areaSubtractSqm}
				/>
			)}
		</div>
	);
}

// Two small inputs for manually adjusting an area: a `+` and a `−`, each suffixed
// with m². Empty/invalid clears the adjustment (null). Mirrors HeightAreaRow's
// draft/commit pattern so values commit on blur or Enter.
function AreaAdjustRow({
	addSqm,
	subtractSqm,
	onSetAdd,
	onSetSubtract,
}: {
	addSqm?: number;
	subtractSqm?: number;
	onSetAdd: (value: number | null) => void;
	onSetSubtract: (value: number | null) => void;
}) {
	return (
		<div className="flex items-center gap-2">
			<AdjustInput
				ariaLabel="Area to add in square metres"
				onCommit={onSetAdd}
				sign="+"
				value={addSqm}
			/>
			<AdjustInput
				ariaLabel="Area to subtract in square metres"
				onCommit={onSetSubtract}
				sign="−"
				value={subtractSqm}
			/>
		</div>
	);
}

// A single signed area-adjustment input: sign prefix, decimal field, m² suffix.
function AdjustInput({
	sign,
	value,
	ariaLabel,
	onCommit,
}: {
	sign: '+' | '−';
	value?: number;
	ariaLabel: string;
	onCommit: (value: number | null) => void;
}) {
	const [draft, setDraft] = useState(value ? String(value) : '');

	// Resync when the value changes elsewhere (e.g. group members share one).
	useEffect(() => {
		setDraft(value ? String(value) : '');
	}, [value]);

	const commit = () => {
		const parsed = Number.parseFloat(draft);
		if (Number.isFinite(parsed) && parsed > 0) {
			if (parsed !== value) {
				onCommit(parsed);
			}
		} else {
			onCommit(null);
			setDraft('');
		}
	};

	return (
		<InputGroup className="flex-1">
			<InputGroupAddon align="inline-start">
				<InputGroupText>{sign}</InputGroupText>
			</InputGroupAddon>
			<InputGroupInput
				aria-label={ariaLabel}
				inputMode="decimal"
				onBlur={commit}
				onChange={(event) => setDraft(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === 'Enter') {
						event.currentTarget.blur();
					}
				}}
				placeholder="0"
				size="sm"
				value={draft}
			/>
			<InputGroupAddon align="inline-end">
				<InputGroupText>m²</InputGroupText>
			</InputGroupAddon>
		</InputGroup>
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

// The right-justified actions menu for a measurement or Add-group row: a 3-dot
// trigger opening a popup with a colour submenu, a hide/show toggle, a
// description editor, and a delete action. The description dialog and the delete
// confirmation are driven by controlled open state (Base UI menu items close the
// menu on click, so the dialogs can't live as nested triggers).
function RowActionsMenu({
	label,
	hidden,
	color,
	description,
	deleteLabel,
	deleteDescription,
	onToggleHidden,
	onRecolor,
	onDelete,
	onSetDescription,
}: {
	label: string;
	hidden?: boolean;
	color: string;
	description?: string;
	deleteLabel: string;
	deleteDescription: string;
	onToggleHidden: () => void;
	onRecolor: (color: string) => void;
	onDelete: () => void;
	onSetDescription: (description: string) => void;
}): ReactElement {
	const [descOpen, setDescOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Actions for ${label}`}
							size="icon-sm"
							variant="ghost"
						>
							<EllipsisVertical />
						</Button>
					}
				/>
				<MenuPopup align="end">
					<MenuSub>
						<MenuSubTrigger>
							<Palette />
							Colour
						</MenuSubTrigger>
						<MenuSubPopup>
							<div className="grid grid-cols-6 gap-1.5 p-1">
								{SHAPE_PALETTE.map((swatch) => (
									<button
										aria-label={swatch}
										className={cn(
											'size-6 rounded-full border transition-transform hover:scale-110',
											color.toLowerCase() === swatch.toLowerCase() &&
												'ring-2 ring-ring ring-offset-1 ring-offset-popover'
										)}
										key={swatch}
										onClick={() => onRecolor(swatch)}
										style={{ backgroundColor: swatch }}
										type="button"
									/>
								))}
								<label className="col-span-6 flex items-center justify-between gap-2 text-muted-foreground text-xs">
									Custom
									<input
										className="size-6 cursor-pointer rounded border bg-transparent p-0"
										onChange={(event) => onRecolor(event.target.value)}
										type="color"
										value={color}
									/>
								</label>
							</div>
						</MenuSubPopup>
					</MenuSub>
					<MenuItem onClick={onToggleHidden}>
						{hidden ? <Eye /> : <EyeOff />}
						{hidden ? 'Show on canvas' : 'Hide on canvas'}
					</MenuItem>
					<MenuItem onClick={() => setDescOpen(true)}>
						<FileText />
						View / Edit Description
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						{deleteLabel}
					</MenuItem>
				</MenuPopup>
			</Menu>

			<DescriptionDialog
				label={label}
				onOpenChange={setDescOpen}
				onSave={onSetDescription}
				open={descOpen}
				value={description ?? ''}
			/>

			<AlertDialog onOpenChange={setDeleteOpen} open={deleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{deleteLabel}?</AlertDialogTitle>
						<AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogClose
							render={<Button type="button" variant="outline" />}
						>
							Cancel
						</AlertDialogClose>
						<AlertDialogClose
							render={
								<Button
									onClick={onDelete}
									type="button"
									variant="destructive"
								/>
							}
						>
							{deleteLabel}
						</AlertDialogClose>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

// Dialog with a textarea to add/edit a measurement's description. The draft is
// seeded from the saved value each time the dialog opens; Save commits it.
function DescriptionDialog({
	open,
	onOpenChange,
	label,
	value,
	onSave,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	label: string;
	value: string;
	onSave: (description: string) => void;
}): ReactElement {
	const [draft, setDraft] = useState(value);

	// Resync the draft with the saved value whenever the dialog (re)opens.
	useEffect(() => {
		if (open) {
			setDraft(value);
		}
	}, [open, value]);

	const save = () => {
		onSave(draft.trim());
		onOpenChange(false);
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Description</DialogTitle>
					<DialogDescription>{label}</DialogDescription>
				</DialogHeader>
				<DialogPanel>
					<Textarea
						aria-label={`Description for ${label}`}
						onChange={(event) => setDraft(event.target.value)}
						placeholder="Add a description…"
						value={draft}
					/>
				</DialogPanel>
				<DialogFooter>
					<DialogClose render={<Button type="button" variant="outline" />}>
						Cancel
					</DialogClose>
					<Button onClick={save} type="button">
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
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
