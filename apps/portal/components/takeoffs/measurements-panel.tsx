'use client';
'use no memo';

import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import {
	closestCorners,
	DndContext,
	DragOverlay,
	PointerSensor,
	useDraggable,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
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
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import {
	Menu,
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
import { SearchInput } from '@workspace/ui/components/search-input';
import { Textarea } from '@workspace/ui/components/textarea';
import { cn } from '@workspace/ui/lib/utils';
import {
	Check,
	ChevronDownIcon,
	ChevronsDownIcon,
	ChevronsUpIcon,
	Circle,
	Download,
	EllipsisVertical,
	Eye,
	EyeOff,
	FileText,
	Folder,
	FolderDown,
	FolderPlus,
	GripVertical,
	Hash,
	Palette,
	Pentagon,
	Plus,
	RotateCcw,
	Ruler,
	RulerDimensionLine,
	Save,
	SlidersHorizontal,
	Square,
	Table,
	Trash2,
	X,
} from 'lucide-react';
import {
	type Dispatch,
	type ReactElement,
	type SetStateAction,
	useEffect,
	useRef,
	useState,
} from 'react';
import {
	adjustArea,
	formatLinear,
	formatSqm,
	MM_PER_METER,
	measurementFamily,
	netAreaSqm,
	roundUpLinearMm,
	roundUpWithWastage,
	SHAPE_PALETTE,
	WASTAGE_OPTIONS,
} from '@/lib/takeoffs/geometry';
import {
	AREA_TYPE_SET,
	type Measurement,
	type TakeoffCategory,
	type TakeoffGroup,
} from '@/lib/takeoffs/types';
import CalculatorPopover from './calculator-popover';
import { InlineTitle } from './inline-title';

const FALLBACK_COLOR = '#2563eb';

// Droppable id for the uncategorized (root) zone; dropping a group here clears
// its category. Category droppables reuse `catKey(id)` (`cat:${id}`).
const ROOT_DROP_ID = 'takeoff-root';

const TYPE_META = {
	linear: { icon: Ruler, label: 'Linear' },
	rectangle: { icon: Square, label: 'Rectangle' },
	circle: { icon: Circle, label: 'Circle' },
	polygon: { icon: Pentagon, label: 'Polygon' },
	count: { icon: Hash, label: 'Count' },
} as const;

// A measured value with its unit. Area-like shapes report m², linear reports mm.
interface NetValue {
	unit: 'mm' | 'm²';
	value: number;
}

// Net measured value of a single shape: net area (after deductions) for area
// shapes, length for linear, or null for counts (which carry no wastage).
function measurementNetValue(
	m: Measurement,
	all: Measurement[]
): NetValue | null {
	if (AREA_TYPE_SET.has(m.type)) {
		return { value: netAreaSqm(m, all), unit: 'm²' };
	}
	if (m.type === 'linear') {
		return { value: m.valueMeters ?? 0, unit: 'mm' };
	}
	return null;
}

// Actual value formatted with its unit: whole m² for area, whole mm for linear.
function formatActual({ value, unit }: NetValue): string {
	return unit === 'm²' ? formatSqm(value) : formatLinear(value);
}

// An adjustable measurement can take area +/− (and height, for linear) inputs.
function isAdjustable(m: Measurement): boolean {
	return m.type !== 'count';
}

// Whether a measurement already carries a manual adjustment. Used to decide if
// its adjustment inputs show by default — empty ones stay hidden to save space.
function hasAdjustmentValues(m: Measurement): boolean {
	return (m.areaAddSqm ?? 0) > 0 || (m.areaSubtractSqm ?? 0) > 0;
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

// Rounded length/height/area text for a linear measurement.
function formatLinearText(
	roundedLength: number,
	heightMeters: number | undefined,
	areaAddSqm: number | undefined,
	areaSubtractSqm: number | undefined
): string {
	if (heightMeters && heightMeters > 0) {
		const area = adjustArea(
			Math.ceil((roundedLength / MM_PER_METER) * heightMeters),
			areaAddSqm,
			areaSubtractSqm
		);
		const heightMm = Math.round(heightMeters * MM_PER_METER);
		return `L - ${roundedLength} mm, H - ${heightMm} mm, A - ${area} m²`;
	}
	return `L - ${roundedLength} mm`;
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
	const roundedLength = roundUpLinearMm(m.valueMeters ?? 0, wastage);
	return formatLinearText(
		roundedLength,
		m.heightMeters,
		m.areaAddSqm,
		m.areaSubtractSqm
	);
}

// Build legend rows from a group's (filtered, non-hidden) measurements: one row
// per top-level measurement (deductions are folded into their parent's value).
export function buildLegendEntries(
	measurements: Measurement[],
	globalWastage: number
): LegendEntry[] {
	return measurements
		.filter((m) => !m.parentId)
		.map((m) => ({
			id: m.id,
			color: m.color ?? FALLBACK_COLOR,
			name: m.label,
			description: m.description ?? '',
			measurement: singleMeasurementText(m, measurements, globalWastage),
		}));
}

// Composite open-accordion keys, unique across the category/group levels.
const catKey = (id: string) => `cat:${id}`;
const grpKey = (id: string) => `grp:${id}`;

// The exclusive set of open keys that reveals a group: its category (when nested)
// plus the group itself. Used to collapse the tree to a single chain.
function chainKeysForGroup(group: TakeoffGroup): string[] {
	return group.categoryId
		? [catKey(group.categoryId), grpKey(group.id)]
		: [grpKey(group.id)];
}

// One nested Accordion root edits only the open keys it owns, so several nested
// roots can share a single openKeys array without clobbering each other.
function scopeAccordion(
	openKeys: string[],
	setOpenKeys: Dispatch<SetStateAction<string[]>>,
	ownedKeys: string[]
): { value: string[]; onValueChange: (next: string[]) => void } {
	const owned = new Set(ownedKeys);
	return {
		value: openKeys.filter((key) => owned.has(key)),
		onValueChange: (next) =>
			setOpenKeys((prev) => [
				...prev.filter((key) => !owned.has(key)),
				...next,
			]),
	};
}

// Everything a GroupAccordionItem needs from the panel. Bundled to avoid
// threading ~20 props through the category level.
interface GroupItemContext {
	adjustShown: (m: Measurement) => boolean;
	clearEditingKey: () => void;
	editingKey: string | null;
	globalWastage: number;
	legendGroupIds: Set<string>;
	measurements: Measurement[];
	onAddLegend: (groupId: string, display: LegendDisplay) => void;
	onDelete: (id: string) => void;
	onDeleteGroup: (groupId: string) => void;
	onDownloadSelection: (
		descriptor: string,
		pages: number[],
		groupIds?: Set<string>
	) => void;
	onRecolorGroup: (groupId: string, color: string) => void;
	onRemoveLegend: (groupId: string) => void;
	onRenameGroup: (groupId: string, name: string) => void;
	onRenameMeasurement: (id: string, label: string) => void;
	onSaveSelection?: (
		descriptor: string,
		pages: number[],
		groupIds?: Set<string>
	) => void;
	onSelectGroup: (groupId: string) => void;
	onSelectMeasurement: (id: string) => void;
	onSetMeasurementAreaAdjust: (
		id: string,
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
	onSetMeasurementDescription: (id: string, description: string) => void;
	onSetMeasurementHeight: (id: string, heightMeters: number | null) => void;
	onSetMeasurementWastage: (id: string, percent: number | null) => void;
	onToggleGroupHidden: (groupId: string) => void;
	onToggleMeasurementHidden: (id: string) => void;
	pageTitles: Record<number, string>;
	searchQuery: string;
	selectedGroupId: string | null;
	selectedId: string | null;
	setAdjustForAll: (members: Measurement[], shown: boolean) => void;
	setOpenKeys: Dispatch<SetStateAction<string[]>>;
	toggleAdjust: (m: Measurement) => void;
	toggleKey: (key: string) => void;
}

export default function MeasurementsPanel({
	measurements,
	pageTitles,
	globalWastage,
	selectedId,
	selectedGroupId,
	canvasSelectNonce,
	categories,
	groups,
	legendGroupIds,
	onSelectGroup,
	onSaveGroup,
	onUndo,
	canUndo,
	onDelete,
	onClearAll,
	onSelectMeasurement,
	onRenameMeasurement,
	onRecolorGroup,
	onSetMeasurementWastage,
	onSetMeasurementHeight,
	onSetMeasurementAreaAdjust,
	onSetMeasurementDescription,
	onToggleMeasurementHidden,
	onToggleGroupHidden,
	onToggleCategoryHidden,
	onToggleAllHidden,
	onAddLegend,
	onRemoveLegend,
	onDownloadSelection,
	onSaveSelection,
	onAddCategory,
	onRenameCategory,
	onDeleteCategory,
	onAddGroup,
	onRenameGroup,
	onDeleteGroup,
	onMoveGroup,
	width,
}: {
	measurements: Measurement[];
	pageTitles: Record<number, string>;
	globalWastage: number;
	selectedId: string | null;
	selectedGroupId: string | null;
	/** Bumped on each canvas shape selection (not panel-row clicks). */
	canvasSelectNonce: number;
	categories: TakeoffCategory[];
	groups: TakeoffGroup[];
	/** Ids of groups that currently have a legend. */
	legendGroupIds: Set<string>;
	onSelectGroup: (groupId: string) => void;
	/** Save the current group session: exits drawing and clears the selection. */
	onSaveGroup: () => void;
	/** Undo the last drawing action in the current group session. */
	onUndo: () => void;
	/** Whether there is an undoable action in the current group session. */
	canUndo: boolean;
	onDelete: (id: string) => void;
	onClearAll: () => void;
	onSelectMeasurement: (id: string) => void;
	onRenameMeasurement: (id: string, label: string) => void;
	onRecolorGroup: (groupId: string, color: string) => void;
	onSetMeasurementWastage: (id: string, percent: number | null) => void;
	onSetMeasurementHeight: (id: string, heightMeters: number | null) => void;
	onSetMeasurementAreaAdjust: (
		id: string,
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
	onSetMeasurementDescription: (id: string, description: string) => void;
	onToggleMeasurementHidden: (id: string) => void;
	onToggleGroupHidden: (groupId: string) => void;
	onToggleCategoryHidden: (categoryId: string) => void;
	onToggleAllHidden: () => void;
	onAddLegend: (groupId: string, display: LegendDisplay) => void;
	onRemoveLegend: (groupId: string) => void;
	/** Open an annotated PDF of the given pages in a new tab. */
	onDownloadSelection: (
		descriptor: string,
		pages: number[],
		groupIds?: Set<string>
	) => void;
	/** Save an annotated PDF of the given pages to the documents folder. */
	onSaveSelection?: (
		descriptor: string,
		pages: number[],
		groupIds?: Set<string>
	) => void;
	onAddCategory: () => string;
	onRenameCategory: (categoryId: string, name: string) => void;
	onDeleteCategory: (categoryId: string) => void;
	onAddGroup: (categoryId?: string) => string;
	onRenameGroup: (groupId: string, name: string) => void;
	onDeleteGroup: (groupId: string) => void;
	/** Move a group into a category, or to root when categoryId is undefined. */
	onMoveGroup: (groupId: string, categoryId: string | undefined) => void;
	/** Panel width in pixels, controlled by the drag handle in the parent. */
	width: number;
}) {
	const anyMeasurements = measurements.some((m) => !m.parentId);
	const allHidden =
		anyMeasurements && measurements.every((m) => m.parentId || m.hidden);

	// Free-text filter over measurement names (see the search input below the
	// toolbar). Empty query = everything visible (no behavior change).
	const [search, setSearch] = useState('');
	const q = search.trim().toLowerCase();
	const groupNameMatches = (group: TakeoffGroup) =>
		group.name.toLowerCase().includes(q);
	// A group is visible when there is no query, its name matches, or one of its
	// top-level measurements matches.
	const groupIsVisible = (group: TakeoffGroup) =>
		q === '' ||
		groupNameMatches(group) ||
		measurements.some(
			(m) =>
				m.groupId === group.id &&
				!m.parentId &&
				m.label.toLowerCase().includes(q)
		);

	const rootGroups = groups.filter((g) => !g.categoryId && groupIsVisible(g));
	const groupsByCategory = (categoryId: string) =>
		groups.filter((g) => g.categoryId === categoryId && groupIsVisible(g));
	// Categories with at least one visible group under the current query.
	const visibleCategories = categories.filter(
		(c) => groupsByCategory(c.id).length > 0
	);

	// Every accordion node key, for Expand all.
	const allKeys = [
		...categories.map((c) => catKey(c.id)),
		...groups.map((g) => grpKey(g.id)),
	];

	// Controlled accordion across both levels via one composite-key array.
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	// Composite key whose name should mount in edit mode (a freshly added
	// category/group), or null.
	const [editingKey, setEditingKey] = useState<string | null>(null);

	// The group currently being dragged (for the drag overlay), or null.
	const [draggingGroupId, setDraggingGroupId] = useState<string | null>(null);
	const draggingGroup = draggingGroupId
		? groups.find((g) => g.id === draggingGroupId)
		: undefined;
	// A small activation distance keeps header click-to-select/toggle working:
	// a click that never moves past 5px is not treated as a drag.
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
	);
	const handleDragStart = (event: DragStartEvent) => {
		setDraggingGroupId(String(event.active.id));
	};
	const handleDragEnd = (event: DragEndEvent) => {
		setDraggingGroupId(null);
		const { active, over } = event;
		if (!over) {
			return;
		}
		const groupId = String(active.id);
		const overId = String(over.id);
		// Resolve the drop target: the root zone clears the category, a `cat:` id
		// reparents into that category. Anything else is ignored.
		let targetCategoryId: string | undefined;
		if (overId === ROOT_DROP_ID) {
			targetCategoryId = undefined;
		} else if (overId.startsWith('cat:')) {
			targetCategoryId = overId.slice('cat:'.length);
		} else {
			return;
		}
		const group = groups.find((g) => g.id === groupId);
		if (!group || group.categoryId === targetCategoryId) {
			return;
		}
		onMoveGroup(groupId, targetCategoryId);
	};

	// When a group is selected, exclusively open its chain so it (and only it) is
	// revealed. Runs whenever the selection changes to a group.
	const lastSelectedGroupRef = useRef<string | null>(selectedGroupId);
	useEffect(() => {
		if (selectedGroupId === lastSelectedGroupRef.current) {
			return;
		}
		lastSelectedGroupRef.current = selectedGroupId;
		if (!selectedGroupId) {
			return;
		}
		const group = groups.find((g) => g.id === selectedGroupId);
		if (group) {
			setOpenKeys(chainKeysForGroup(group));
		}
	}, [selectedGroupId, groups]);

	// Canvas selection: exclusively expand the selected shape's group/category
	// chain. Gated on the nonce (which only the canvas bumps) so panel-row clicks
	// keep their behavior.
	const lastCanvasSelectRef = useRef(canvasSelectNonce);
	useEffect(() => {
		if (canvasSelectNonce === lastCanvasSelectRef.current) {
			return;
		}
		lastCanvasSelectRef.current = canvasSelectNonce;
		if (!selectedId) {
			return;
		}
		const target = measurements.find((m) => m.id === selectedId);
		if (!target?.groupId) {
			return;
		}
		const group = groups.find((g) => g.id === target.groupId);
		if (group) {
			setOpenKeys(chainKeysForGroup(group));
		}
	}, [canvasSelectNonce, selectedId, measurements, groups]);

	const toggleKey = (key: string) =>
		setOpenKeys((prev) =>
			prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
		);

	// Search drives expansion: while typing, open every category/group that has a
	// match so the filtered rows are visible; clearing the query collapses back.
	useEffect(() => {
		if (q === '') {
			setOpenKeys([]);
			return;
		}
		const keys = new Set<string>();
		for (const group of groups) {
			const matches =
				group.name.toLowerCase().includes(q) ||
				measurements.some(
					(m) =>
						m.groupId === group.id &&
						!m.parentId &&
						m.label.toLowerCase().includes(q)
				);
			if (matches) {
				for (const key of chainKeysForGroup(group)) {
					keys.add(key);
				}
			}
		}
		setOpenKeys([...keys]);
	}, [q, groups, measurements]);

	// Add a category: collapse everything and drop the new name into edit mode.
	const handleAddCategory = () => {
		const id = onAddCategory();
		setOpenKeys([]);
		setEditingKey(catKey(id));
	};
	// Add a group (root when no categoryId): auto-selected by the parent; open its
	// chain and drop the new name into edit mode.
	const handleAddGroup = (categoryId?: string) => {
		const id = onAddGroup(categoryId);
		setOpenKeys(categoryId ? [catKey(categoryId), grpKey(id)] : [grpKey(id)]);
		setEditingKey(grpKey(id));
	};

	// Per-measurement override for adjustment-input visibility (session only).
	const [adjustOverride, setAdjustOverride] = useState<Record<string, boolean>>(
		{}
	);
	const adjustShown = (m: Measurement) =>
		adjustOverride[m.id] ?? hasAdjustmentValues(m);
	const toggleAdjust = (m: Measurement) =>
		setAdjustOverride((prev) => ({
			...prev,
			[m.id]: !(prev[m.id] ?? hasAdjustmentValues(m)),
		}));
	const setAdjustForAll = (members: Measurement[], shown: boolean) =>
		setAdjustOverride((prev) => {
			const next = { ...prev };
			for (const m of members) {
				next[m.id] = shown;
			}
			return next;
		});

	const ctx: GroupItemContext = {
		measurements,
		pageTitles,
		searchQuery: q,
		globalWastage,
		selectedId,
		selectedGroupId,
		legendGroupIds,
		adjustShown,
		toggleAdjust,
		setAdjustForAll,
		clearEditingKey: () => setEditingKey(null),
		onSelectGroup,
		onRenameGroup,
		onDeleteGroup,
		onToggleGroupHidden,
		onAddLegend,
		onRemoveLegend,
		onDownloadSelection,
		onSaveSelection,
		onDelete,
		onSelectMeasurement,
		onRenameMeasurement,
		onRecolorGroup,
		onSetMeasurementWastage,
		onSetMeasurementHeight,
		onSetMeasurementAreaAdjust,
		onSetMeasurementDescription,
		onToggleMeasurementHidden,
		toggleKey,
		setOpenKeys,
		editingKey,
	};

	const selectedGroup = selectedGroupId
		? groups.find((g) => g.id === selectedGroupId)
		: undefined;
	// Colour for a group, matching the header fallback (stored → member → default).
	const colorForGroup = (group: TakeoffGroup) =>
		group.color ??
		measurements.find((m) => m.groupId === group.id && !m.parentId)?.color ??
		FALLBACK_COLOR;

	return (
		<div
			className="flex h-full shrink-0 flex-col rounded-lg border bg-card"
			style={{ width }}
		>
			<div className="flex items-center justify-between border-b p-3">
				<h2 className="font-semibold text-sm">Measurements</h2>
				<CalculatorPopover />
			</div>

			{/* Toolbar: add a root group, expand/collapse, hide all, overflow actions. */}
			<div className="flex items-center gap-2 border-b p-2">
				<Button
					className="flex-1"
					onClick={() => handleAddGroup()}
					size="sm"
					variant="outline"
				>
					<RulerDimensionLine />
					Measure
				</Button>
				<Group>
					<Button
						aria-label="Expand all"
						disabled={!anyMeasurements}
						onClick={() => setOpenKeys(allKeys)}
						size="icon-sm"
						title="Expand all"
						variant="outline"
					>
						<ChevronsDownIcon />
					</Button>
					<GroupSeparator />
					<Button
						aria-label="Collapse all"
						disabled={!anyMeasurements}
						onClick={() => setOpenKeys([])}
						size="icon-sm"
						title="Collapse all"
						variant="outline"
					>
						<ChevronsUpIcon />
					</Button>
					<GroupSeparator />
					<Button
						aria-label={allHidden ? 'Show all on canvas' : 'Hide all on canvas'}
						disabled={!anyMeasurements}
						onClick={onToggleAllHidden}
						size="icon-sm"
						title={allHidden ? 'Show all on canvas' : 'Hide all on canvas'}
						variant="outline"
					>
						{allHidden ? <Eye /> : <EyeOff />}
					</Button>
					<GroupSeparator />
					<PanelOverflowMenu
						onAddCategory={handleAddCategory}
						onClearAll={onClearAll}
					/>
				</Group>
			</div>

			{/* Search: filters measurement rows by name and auto-expands matches. */}
			<div className="border-b p-2">
				<SearchInput
					aria-label="Search measurements"
					onValueChange={setSearch}
					placeholder="Search measurements…"
					value={search}
				/>
			</div>

			{/* Selected-group banner: shows the active drawing group + a Save button,
			or a prompt when nothing is selected. */}
			<div className="border-b p-2">
				{selectedGroup ? (
					<div className="flex items-center gap-2 rounded-md border border-primary bg-primary/5 px-3 py-2">
						<RulerDimensionLine
							className="size-4 shrink-0"
							style={{ color: colorForGroup(selectedGroup) }}
						/>
						<span
							className="min-w-0 flex-1 truncate font-medium text-sm"
							style={{ color: colorForGroup(selectedGroup) }}
						>
							{selectedGroup.name}
						</span>
						<Button
							aria-label="Undo last action"
							disabled={!canUndo}
							onClick={onUndo}
							size="icon-sm"
							variant="outline"
						>
							<RotateCcw />
						</Button>
						<Button onClick={onSaveGroup} size="sm" variant="outline">
							<Save />
							Save
						</Button>
					</div>
				) : (
					<p className="rounded-md border border-dashed px-3 py-2 text-center text-muted-foreground text-xs">
						Select or create a group to add measurements.
					</p>
				)}
			</div>

			<ScrollArea className="min-h-0 flex-1" scrollFade>
				{(categories.length === 0 && groups.length === 0) ||
				(q !== '' &&
					visibleCategories.length === 0 &&
					rootGroups.length === 0) ? (
					<p className="px-2 py-6 text-center text-muted-foreground text-sm">
						{categories.length === 0 && groups.length === 0
							? 'No groups yet. Add a category or a group to start.'
							: `No measurements match “${search.trim()}”.`}
					</p>
				) : (
					<DndContext
						collisionDetection={closestCorners}
						onDragEnd={handleDragEnd}
						onDragStart={handleDragStart}
						sensors={sensors}
					>
						<div className="flex flex-col gap-1 p-1">
							{visibleCategories.length > 0 && (
								<Accordion
									multiple
									{...scopeAccordion(
										openKeys,
										setOpenKeys,
										categories.map((c) => catKey(c.id))
									)}
								>
									{visibleCategories.map((category) => (
										<CategoryAccordionItem
											category={category}
											ctx={ctx}
											groups={groupsByCategory(category.id)}
											key={category.id}
											onAddGroup={handleAddGroup}
											onDeleteCategory={onDeleteCategory}
											onRenameCategory={onRenameCategory}
											onToggleCategoryHidden={onToggleCategoryHidden}
											openKeys={openKeys}
										/>
									))}
								</Accordion>
							)}
							<RootDropZone dragging={draggingGroupId !== null}>
								{rootGroups.length > 0 && (
									<Accordion
										className="flex flex-col gap-2"
										multiple
										{...scopeAccordion(
											openKeys,
											setOpenKeys,
											rootGroups.map((g) => grpKey(g.id))
										)}
									>
										{rootGroups.map((group) => (
											<GroupAccordionItem
												categoryName={null}
												ctx={ctx}
												group={group}
												key={group.id}
											/>
										))}
									</Accordion>
								)}
							</RootDropZone>
						</div>
						<DragOverlay>
							{draggingGroup ? (
								<div className="flex items-center gap-2 rounded-lg border bg-muted px-3 py-2 shadow-lg">
									<GripVertical className="size-4 shrink-0 text-muted-foreground" />
									<RulerDimensionLine
										className="size-4 shrink-0"
										style={{ color: colorForGroup(draggingGroup) }}
									/>
									<span
										className="min-w-0 truncate font-medium text-sm"
										style={{ color: colorForGroup(draggingGroup) }}
									>
										{draggingGroup.name}
									</span>
								</div>
							) : null}
						</DragOverlay>
					</DndContext>
				)}
			</ScrollArea>
		</div>
	);
}

// The uncategorized drop zone. Always rendered while the tree is shown so a group
// can be dragged out of a category; when there are no root groups it shows a
// dashed hint (only during a drag) so there is a visible target.
function RootDropZone({
	children,
	dragging,
}: {
	children: ReactElement | false;
	dragging: boolean;
}): ReactElement {
	const { setNodeRef, isOver } = useDroppable({ id: ROOT_DROP_ID });
	const empty = children === false;
	return (
		<div
			className={cn(
				'flex flex-col gap-2 rounded-lg transition-colors',
				isOver && 'ring-2 ring-primary/50 ring-inset',
				empty && dragging && 'border border-dashed p-3'
			)}
			ref={setNodeRef}
		>
			{children}
			{empty && dragging && (
				<p className="text-center text-muted-foreground text-xs">
					Drop here to remove from category
				</p>
			)}
		</div>
	);
}

// Neutral badge colour for group summary totals (no single shape colour applies).
const SUMMARY_COLOR = '#475569';

interface GroupTotals {
	actualMeters: number;
	actualSqm: number;
	hasArea: boolean;
	hasCount: boolean;
	hasHeight: boolean;
	hasLinear: boolean;
	roundedLinearMm: number;
	roundedSqm: number;
	totalCount: number;
	wallAreaSqm: number;
}

// Aggregate a group's measurements. Rounds each top-level measurement then sums,
// mirroring how each row displays. Groups may hold mixed families, so totals are
// tracked per family and the card renders a badge set for each family present.
function computeGroupTotals(
	groupId: string,
	measurements: Measurement[],
	globalWastage: number
): GroupTotals {
	const totals: GroupTotals = {
		hasArea: false,
		hasLinear: false,
		hasCount: false,
		actualSqm: 0,
		roundedSqm: 0,
		actualMeters: 0,
		roundedLinearMm: 0,
		wallAreaSqm: 0,
		hasHeight: false,
		totalCount: 0,
	};
	for (const m of measurements) {
		if (m.groupId !== groupId || m.parentId) {
			continue;
		}
		const wastage = m.wastagePercent ?? globalWastage;
		const family = measurementFamily(m.type);
		if (family === 'area') {
			totals.hasArea = true;
			const net = netAreaSqm(m, measurements);
			totals.actualSqm += net;
			totals.roundedSqm += adjustArea(
				roundUpWithWastage(net, wastage),
				m.areaAddSqm,
				m.areaSubtractSqm
			);
		} else if (family === 'linear') {
			totals.hasLinear = true;
			const length = m.valueMeters ?? 0;
			totals.actualMeters += length;
			const roundedMm = roundUpLinearMm(length, wastage);
			totals.roundedLinearMm += roundedMm;
			if (m.heightMeters && m.heightMeters > 0) {
				totals.hasHeight = true;
				totals.wallAreaSqm += adjustArea(
					Math.ceil((roundedMm / MM_PER_METER) * m.heightMeters),
					m.areaAddSqm,
					m.areaSubtractSqm
				);
			}
		} else {
			totals.hasCount = true;
			totals.totalCount += m.count ?? 0;
		}
	}
	return totals;
}

// A controlled confirmation dialog (the menus unmount their items on click, so
// the dialog lives outside the Menu and is driven by open state).
function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	confirmLabel,
	onConfirm,
}: {
	open: boolean;
	onOpenChange: (next: boolean) => void;
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void;
}): ReactElement {
	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
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
							<Button
								onClick={onConfirm}
								type="button"
								variant="destructive-outline"
							/>
						}
					>
						{confirmLabel}
					</AlertDialogClose>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

// The panel toolbar's overflow menu: expand/collapse all and the clear-all action.
function PanelOverflowMenu({
	onAddCategory,
	onClearAll,
}: {
	onAddCategory: () => void;
	onClearAll: () => void;
}): ReactElement {
	const [clearAllOpen, setClearAllOpen] = useState(false);
	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button aria-label="Panel actions" size="icon-sm" variant="outline">
							<EllipsisVertical />
						</Button>
					}
				/>
				<MenuPopup align="end">
					<MenuItem onClick={onAddCategory}>
						<Plus />
						Add category
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setClearAllOpen(true)} variant="destructive">
						<Trash2 />
						Clear all measurements
					</MenuItem>
				</MenuPopup>
			</Menu>
			<ConfirmDialog
				confirmLabel="Clear all"
				description="This removes every measurement in the take-off. This can't be undone."
				onConfirm={onClearAll}
				onOpenChange={setClearAllOpen}
				open={clearAllOpen}
				title="Clear all measurements?"
			/>
		</>
	);
}

// Actions for a category header: add a group, download/save, or delete it.
function CategoryActionsMenu({
	name,
	hasPages,
	onAddGroup,
	onDownload,
	onSave,
	onDelete,
}: {
	name: string;
	hasPages: boolean;
	onAddGroup: () => void;
	onDownload: () => void;
	onSave?: () => void;
	onDelete: () => void;
}): ReactElement {
	const [deleteOpen, setDeleteOpen] = useState(false);
	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Actions for ${name}`}
							size="icon-sm"
							variant="ghost"
						>
							<EllipsisVertical />
						</Button>
					}
				/>
				<MenuPopup align="end">
					<MenuItem onClick={onAddGroup}>
						<FolderPlus />
						Add group
					</MenuItem>
					<MenuSeparator />
					<MenuItem disabled={!hasPages} onClick={onDownload}>
						<Download />
						Download category
					</MenuItem>
					{onSave && (
						<MenuItem disabled={!hasPages} onClick={onSave}>
							<FolderDown />
							Save category to Documents
						</MenuItem>
					)}
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete category
					</MenuItem>
				</MenuPopup>
			</Menu>
			<ConfirmDialog
				confirmLabel="Delete category"
				description="The category and all its groups are removed, along with every measurement in them. This can't be undone."
				onConfirm={onDelete}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				title="Delete category?"
			/>
		</>
	);
}

// A colour picker submenu: a swatch grid from the shared palette plus a native
// custom colour input. Shared by the group actions menu.
function ColourSubmenu({
	color,
	onRecolor,
}: {
	color: string;
	onRecolor: (color: string) => void;
}): ReactElement {
	return (
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
	);
}

// Actions for a group header: recolour, add/remove legend, download/save, or
// delete it.
function GroupActionsMenu({
	name,
	color,
	hasPages,
	hasLegend,
	adjustable,
	adjustmentsShown,
	onToggleAdjustments,
	onRecolor,
	onAddLegend,
	onRemoveLegend,
	onDownload,
	onSave,
	onDelete,
}: {
	name: string;
	color: string;
	hasPages: boolean;
	hasLegend: boolean;
	adjustable: boolean;
	adjustmentsShown: boolean;
	onToggleAdjustments: () => void;
	onRecolor: (color: string) => void;
	onAddLegend: (display: LegendDisplay) => void;
	onRemoveLegend: () => void;
	onDownload: () => void;
	onSave?: () => void;
	onDelete: () => void;
}): ReactElement {
	const [deleteOpen, setDeleteOpen] = useState(false);
	const [legendDialogOpen, setLegendDialogOpen] = useState(false);
	return (
		<>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Actions for ${name}`}
							size="icon-sm"
							variant="ghost"
						>
							<EllipsisVertical />
						</Button>
					}
				/>
				<MenuPopup align="end">
					<ColourSubmenu color={color} onRecolor={onRecolor} />
					<MenuSeparator />
					{adjustable && (
						<MenuItem onClick={onToggleAdjustments}>
							<SlidersHorizontal />
							{adjustmentsShown
								? 'Hide all adjustments'
								: 'Show all adjustments'}
						</MenuItem>
					)}
					<MenuItem
						onClick={() =>
							hasLegend ? onRemoveLegend() : setLegendDialogOpen(true)
						}
					>
						<Table />
						{hasLegend ? 'Remove Legend' : 'Add Legend'}
					</MenuItem>
					<MenuSeparator />
					<MenuItem disabled={!hasPages} onClick={onDownload}>
						<Download />
						Download group
					</MenuItem>
					{onSave && (
						<MenuItem disabled={!hasPages} onClick={onSave}>
							<FolderDown />
							Save group to Documents
						</MenuItem>
					)}
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete group
					</MenuItem>
				</MenuPopup>
			</Menu>
			<LegendOptionsDialog
				onConfirm={onAddLegend}
				onOpenChange={setLegendDialogOpen}
				open={legendDialogOpen}
			/>
			<ConfirmDialog
				confirmLabel="Delete group"
				description="The group and every measurement in it are removed. This can't be undone."
				onConfirm={onDelete}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				title="Delete group?"
			/>
		</>
	);
}

// A category in the hierarchy: a header plus its groups.
function CategoryAccordionItem({
	category,
	groups,
	ctx,
	openKeys,
	onAddGroup,
	onRenameCategory,
	onDeleteCategory,
	onToggleCategoryHidden,
}: {
	category: TakeoffCategory;
	groups: TakeoffGroup[];
	ctx: GroupItemContext;
	openKeys: string[];
	onAddGroup: (categoryId: string) => void;
	onRenameCategory: (categoryId: string, name: string) => void;
	onDeleteCategory: (categoryId: string) => void;
	onToggleCategoryHidden: (categoryId: string) => void;
}): ReactElement {
	// Pages covered by this category's groups, for download/save actions.
	const groupIds = new Set(groups.map((g) => g.id));
	const categoryMembers = ctx.measurements.filter(
		(m) => m.groupId && groupIds.has(m.groupId) && !m.parentId
	);
	const categoryPages = [...new Set(categoryMembers.map((m) => m.page))].sort(
		(a, b) => a - b
	);
	const categoryHidden =
		categoryMembers.length > 0 && categoryMembers.every((m) => m.hidden);
	// The whole category (header + panel) is a drop target so a group can be
	// dropped even when the category is collapsed and only its header shows.
	const { setNodeRef, isOver } = useDroppable({ id: catKey(category.id) });
	return (
		<AccordionItem
			className={cn(isOver && 'rounded-lg ring-2 ring-primary/50 ring-inset')}
			ref={setNodeRef}
			value={catKey(category.id)}
		>
			<AccordionPrimitive.Header
				className="flex cursor-pointer items-center gap-2 bg-muted px-3 py-2.5 hover:bg-muted/70"
				onClick={(event) => {
					if (!event.currentTarget.contains(event.target as Node)) {
						return;
					}
					const target = event.target as HTMLElement;
					if (target.closest('[data-no-toggle]') || target.closest('input')) {
						return;
					}
					ctx.toggleKey(catKey(category.id));
				}}
			>
				<Folder className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
				<InlineTitle
					autoEdit={ctx.editingKey === catKey(category.id)}
					className="min-w-0 flex-1 font-medium text-amber-700 dark:text-amber-400"
					onEditEnd={ctx.clearEditingKey}
					onRename={(name) => onRenameCategory(category.id, name)}
					value={category.name}
				/>
				<Group data-no-toggle>
					<Button
						aria-label={
							categoryHidden
								? 'Show category on canvas'
								: 'Hide category on canvas'
						}
						disabled={categoryMembers.length === 0}
						onClick={() => onToggleCategoryHidden(category.id)}
						size="icon-sm"
						title={
							categoryHidden
								? 'Show category on canvas'
								: 'Hide category on canvas'
						}
						variant="ghost"
					>
						{categoryHidden ? <Eye /> : <EyeOff />}
					</Button>
					<GroupSeparator />
					<CategoryActionsMenu
						hasPages={categoryPages.length > 0}
						name={category.name}
						onAddGroup={() => onAddGroup(category.id)}
						onDelete={() => onDeleteCategory(category.id)}
						onDownload={() =>
							ctx.onDownloadSelection(category.name, categoryPages, groupIds)
						}
						onSave={
							ctx.onSaveSelection
								? () =>
										ctx.onSaveSelection?.(
											category.name,
											categoryPages,
											groupIds
										)
								: undefined
						}
					/>
				</Group>
				<AccordionPrimitive.Trigger
					className={cn(
						'flex shrink-0 cursor-pointer items-center rounded outline-none transition-colors hover:bg-muted/40',
						'focus-visible:ring-[3px] focus-visible:ring-ring',
						'[&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180'
					)}
					data-no-toggle
					type="button"
				>
					<ChevronDownIcon
						className="size-4 shrink-0 opacity-70 transition-transform duration-200"
						data-slot="accordion-indicator"
					/>
				</AccordionPrimitive.Trigger>
			</AccordionPrimitive.Header>
			<AccordionPanel className="px-2 pt-1 pb-2">
				{groups.length === 0 ? (
					<p className="px-2 py-2 text-muted-foreground text-xs">
						Empty category. Add a group from the menu.
					</p>
				) : (
					<Accordion
						className="flex flex-col gap-2"
						multiple
						{...scopeAccordion(
							openKeys,
							ctx.setOpenKeys,
							groups.map((g) => grpKey(g.id))
						)}
					>
						{groups.map((group) => (
							<GroupAccordionItem
								categoryName={category.name}
								ctx={ctx}
								group={group}
								key={group.id}
							/>
						))}
					</Accordion>
				)}
			</AccordionPanel>
		</AccordionItem>
	);
}

// A group: a header (name, per-family totals, show/hide icon, actions), a border
// when selected, and its measurements. Clicking the header selects the group for
// drawing and exclusively opens it.
function GroupAccordionItem({
	group,
	categoryName,
	ctx,
}: {
	group: TakeoffGroup;
	categoryName: string | null;
	ctx: GroupItemContext;
}): ReactElement {
	const members = ctx.measurements.filter(
		(m) => m.groupId === group.id && !m.parentId
	);
	const groupMeasurements = ctx.measurements.filter(
		(m) => m.groupId === group.id
	);
	// While searching, render only rows whose name matches — unless the group name
	// itself matches, in which case every row stays visible. Group-level values
	// (colour, totals, hidden state) still derive from the full `members` list.
	const groupNameMatches =
		ctx.searchQuery !== '' &&
		group.name.toLowerCase().includes(ctx.searchQuery);
	const visibleMembers =
		ctx.searchQuery === '' || groupNameMatches
			? members
			: members.filter((m) => m.label.toLowerCase().includes(ctx.searchQuery));
	// One colour drives the whole group: its stored colour, else an existing
	// member's colour (legacy groups), else the neutral fallback.
	const groupColor = group.color ?? members[0]?.color ?? FALLBACK_COLOR;
	const groupPages = [...new Set(members.map((m) => m.page))].sort(
		(a, b) => a - b
	);
	const descriptor = categoryName
		? `${categoryName} - ${group.name}`
		: group.name;
	const selected = group.id === ctx.selectedGroupId;
	const hasLegend = ctx.legendGroupIds.has(group.id);
	const allHidden = members.length > 0 && members.every((m) => m.hidden);
	const adjustableReps = members.filter(isAdjustable);
	const adjustmentsShown =
		adjustableReps.length > 0 && adjustableReps.every(ctx.adjustShown);
	// The group is draggable (by its handle) into a category or the root zone.
	const { attributes, listeners, setNodeRef, setActivatorNodeRef, isDragging } =
		useDraggable({ id: group.id });

	return (
		<AccordionItem
			// One rounded box wraps the whole group (shaded header + measurements),
			// with each measurement bordered inside it. `border!` overrides the shared
			// item's `border-b last:border-b-0` (a `:last-child` selector plain
			// utilities can't beat); `overflow-hidden` clips the header to the corners.
			className={cn(
				'border! overflow-hidden rounded-lg',
				selected && 'ring-2 ring-primary ring-inset',
				isDragging && 'opacity-50'
			)}
			ref={setNodeRef}
			value={grpKey(group.id)}
		>
			<AccordionPrimitive.Header
				className="flex cursor-pointer flex-col gap-1.5 bg-muted/50 px-3 py-2 hover:bg-muted/70"
				onClick={(event) => {
					if (!event.currentTarget.contains(event.target as Node)) {
						return;
					}
					const target = event.target as HTMLElement;
					if (target.closest('[data-no-toggle]') || target.closest('input')) {
						return;
					}
					// Selecting the group marks it for drawing and opens it exclusively,
					// collapsing every other group and category.
					ctx.onSelectGroup(group.id);
					ctx.setOpenKeys(chainKeysForGroup(group));
				}}
			>
				<div className="flex items-center gap-2">
					<button
						aria-label="Drag group to a category"
						className="flex shrink-0 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
						data-no-toggle
						ref={setActivatorNodeRef}
						type="button"
						{...attributes}
						{...listeners}
					>
						<GripVertical className="size-4" />
					</button>
					<RulerDimensionLine
						className="size-4 shrink-0"
						style={{ color: groupColor }}
					/>
					<InlineTitle
						autoEdit={ctx.editingKey === grpKey(group.id)}
						className="min-w-0 flex-1"
						onEditEnd={ctx.clearEditingKey}
						onRename={(name) => ctx.onRenameGroup(group.id, name)}
						style={{ color: groupColor }}
						value={group.name}
					/>
					<Group data-no-toggle>
						<Button
							aria-label={
								allHidden ? 'Show group on canvas' : 'Hide group on canvas'
							}
							onClick={() => ctx.onToggleGroupHidden(group.id)}
							size="icon-sm"
							title={
								allHidden ? 'Show group on canvas' : 'Hide group on canvas'
							}
							variant="ghost"
						>
							{allHidden ? <Eye /> : <EyeOff />}
						</Button>
						<GroupSeparator />
						<GroupActionsMenu
							adjustable={adjustableReps.length > 0}
							adjustmentsShown={adjustmentsShown}
							color={groupColor}
							hasLegend={hasLegend}
							hasPages={groupPages.length > 0}
							name={group.name}
							onAddLegend={(display) => ctx.onAddLegend(group.id, display)}
							onDelete={() => ctx.onDeleteGroup(group.id)}
							onDownload={() =>
								ctx.onDownloadSelection(
									descriptor,
									groupPages,
									new Set([group.id])
								)
							}
							onRecolor={(next) => ctx.onRecolorGroup(group.id, next)}
							onRemoveLegend={() => ctx.onRemoveLegend(group.id)}
							onSave={
								ctx.onSaveSelection
									? () =>
											ctx.onSaveSelection?.(
												descriptor,
												groupPages,
												new Set([group.id])
											)
									: undefined
							}
							onToggleAdjustments={() =>
								ctx.setAdjustForAll(adjustableReps, !adjustmentsShown)
							}
						/>
					</Group>
					<AccordionPrimitive.Trigger
						className={cn(
							'flex shrink-0 cursor-pointer items-center rounded outline-none transition-colors hover:bg-muted/40',
							'focus-visible:ring-[3px] focus-visible:ring-ring',
							'[&[data-panel-open]_[data-slot=accordion-indicator]]:rotate-180'
						)}
						data-no-toggle
						type="button"
					>
						<ChevronDownIcon
							className="size-4 shrink-0 opacity-70 transition-transform duration-200"
							data-slot="accordion-indicator"
						/>
					</AccordionPrimitive.Trigger>
				</div>
				<GroupBadges
					globalWastage={ctx.globalWastage}
					groupId={group.id}
					measurements={ctx.measurements}
				/>
			</AccordionPrimitive.Header>
			<AccordionPanel className="px-2 pt-1 pb-2">
				{visibleMembers.length === 0 ? (
					<p className="px-2 py-2 text-muted-foreground text-xs">
						No measurements yet. Select this group, then draw on the canvas.
					</p>
				) : (
					<ul className="flex flex-col gap-2">
						{visibleMembers.map((m) => (
							<MeasurementRow
								adjustmentsShown={ctx.adjustShown(m)}
								globalWastage={ctx.globalWastage}
								groupMeasurements={groupMeasurements}
								key={m.id}
								measurement={m}
								onDelete={ctx.onDelete}
								onRename={ctx.onRenameMeasurement}
								onSelect={ctx.onSelectMeasurement}
								onSetAreaAdjust={ctx.onSetMeasurementAreaAdjust}
								onSetDescription={ctx.onSetMeasurementDescription}
								onSetHeight={ctx.onSetMeasurementHeight}
								onSetWastage={ctx.onSetMeasurementWastage}
								onToggleAdjustments={() => ctx.toggleAdjust(m)}
								onToggleHidden={ctx.onToggleMeasurementHidden}
								pageTitle={ctx.pageTitles[m.page] ?? `Page ${m.page}`}
								selectedId={ctx.selectedId}
							/>
						))}
					</ul>
				)}
			</AccordionPanel>
		</AccordionItem>
	);
}

// The per-family actual + rounded badges shown below a group name.
function GroupBadges({
	groupId,
	measurements,
	globalWastage,
}: {
	groupId: string;
	measurements: Measurement[];
	globalWastage: number;
}): ReactElement | null {
	const totals = computeGroupTotals(groupId, measurements, globalWastage);
	if (!(totals.hasArea || totals.hasLinear || totals.hasCount)) {
		return null;
	}
	return (
		<div className="flex flex-col gap-1">
			{totals.hasArea && (
				<div className="flex flex-wrap items-center gap-1">
					<ValueBadge
						color={SUMMARY_COLOR}
						title="Total actual area"
						value={`AA ${formatSqm(totals.actualSqm)}`}
					/>
					<ValueBadge
						color={SUMMARY_COLOR}
						title="Total rounded area — incl. wastage and adjustments"
						value={`RA ${totals.roundedSqm} m²`}
					/>
				</div>
			)}
			{totals.hasLinear && (
				<div className="flex flex-wrap items-center gap-1">
					<ValueBadge
						color={SUMMARY_COLOR}
						title="Total actual length"
						value={`AL ${formatLinear(totals.actualMeters)}`}
					/>
					<ValueBadge
						color={SUMMARY_COLOR}
						title="Total rounded length — incl. wastage"
						value={`RL ${totals.roundedLinearMm} mm`}
					/>
					{totals.hasHeight && (
						<ValueBadge
							color={SUMMARY_COLOR}
							title="Total wall area — rounded length × height"
							value={`WA ${totals.wallAreaSqm} m²`}
						/>
					)}
				</div>
			)}
			{totals.hasCount && (
				<div className="flex flex-wrap items-center gap-1">
					<ValueBadge
						color={SUMMARY_COLOR}
						title="Total count"
						value={`# ${totals.totalCount}`}
					/>
				</div>
			)}
		</div>
	);
}

const LEGEND_OPTION_FIELDS = [
	{ key: 'color', label: 'Color' },
	{ key: 'name', label: 'Measurement Name' },
	{ key: 'description', label: 'Description' },
	{ key: 'measurement', label: 'Measurement' },
] as const;

// Lets the user pick which columns a new legend shows before it is added.
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
						Choose which details to include in the legend. A legend is added on
						every page this group covers.
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
						<X aria-hidden /> Cancel
					</DialogClose>
					<Button onClick={confirm} type="button" variant="outline">
						<Plus aria-hidden /> Add Legend
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

// Clicking a card's body selects/navigates to its measurement, except when the
// click lands on a real control (rename, actions menu, wastage, delete, inputs).
const CARD_INTERACTIVE_SELECTOR =
	'button, input, textarea, a, [data-no-select]';

function MeasurementRow({
	measurement: m,
	groupMeasurements,
	selectedId,
	globalWastage,
	pageTitle,
	onDelete,
	onSelect,
	onRename,
	onSetWastage,
	onSetHeight,
	onSetAreaAdjust,
	onSetDescription,
	onToggleHidden,
	adjustmentsShown,
	onToggleAdjustments,
}: {
	measurement: Measurement;
	groupMeasurements: Measurement[];
	selectedId: string | null;
	globalWastage: number;
	pageTitle: string;
	onDelete: (id: string) => void;
	onSelect: (id: string) => void;
	onRename: (id: string, label: string) => void;
	onSetWastage: (id: string, percent: number | null) => void;
	onSetHeight: (id: string, heightMeters: number | null) => void;
	onSetAreaAdjust: (
		id: string,
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
	onSetDescription: (id: string, description: string) => void;
	onToggleHidden: (id: string) => void;
	adjustmentsShown: boolean;
	onToggleAdjustments: () => void;
}) {
	const Icon = TYPE_META[m.type].icon;
	const deductions = groupMeasurements.filter((d) => d.parentId === m.id);
	const color = m.color ?? FALLBACK_COLOR;
	// A deduction has no row of its own, so selecting one (e.g. on the canvas)
	// highlights and scrolls to its parent shape's row.
	const selected =
		m.id === selectedId || deductions.some((d) => d.id === selectedId);
	const net = measurementNetValue(m, groupMeasurements);
	const ref = useRef<HTMLLIElement>(null);
	const adjustable = net?.unit === 'm²' || (m.type === 'linear' && !!net);

	useEffect(() => {
		if (selected) {
			ref.current?.scrollIntoView({ block: 'center' });
		}
	}, [selected]);

	return (
		<li
			className={cn(
				'flex flex-col gap-1 rounded-md p-1',
				selected ? 'bg-accent ring-1 ring-ring ring-inset' : 'border',
				m.hidden && 'opacity-60'
			)}
			ref={ref}
		>
			{/* biome-ignore lint/a11y/useSemanticElements: card body wraps its own interactive controls, so it can't be a <button>; keyboard support is provided below */}
			<div
				className={cn(
					'flex cursor-pointer flex-col gap-1.5 rounded-md px-2 py-1.5',
					!selected && 'hover:bg-accent/50'
				)}
				onClick={(event) => {
					if (
						!(event.target as HTMLElement).closest(CARD_INTERACTIVE_SELECTOR)
					) {
						onSelect(m.id);
					}
				}}
				onKeyDown={(event) => {
					if (
						event.target === event.currentTarget &&
						(event.key === 'Enter' || event.key === ' ')
					) {
						event.preventDefault();
						onSelect(m.id);
					}
				}}
				role="button"
				tabIndex={0}
			>
				<div className="flex items-center gap-2">
					<span className="shrink-0" style={{ color }}>
						<Icon className="size-4" />
					</span>
					<InlineTitle
						className="min-w-0 flex-1"
						onActivate={() => onSelect(m.id)}
						onRename={(label) => onRename(m.id, label)}
						value={m.label}
					/>
					<Badge size="sm" title={pageTitle} variant="secondary">
						{pageTitle}
					</Badge>
					<Group>
						<Button
							aria-label={m.hidden ? 'Show on canvas' : 'Hide on canvas'}
							onClick={() => onToggleHidden(m.id)}
							size="icon-sm"
							title={m.hidden ? 'Show on canvas' : 'Hide on canvas'}
							variant="ghost"
						>
							{m.hidden ? <Eye /> : <EyeOff />}
						</Button>
						<GroupSeparator />
						<RowActionsMenu
							adjustable={adjustable}
							adjustmentsShown={adjustmentsShown}
							deleteDescription="This permanently removes the measurement. This can't be undone."
							deleteLabel="Delete measurement"
							description={m.description}
							label={m.label}
							onDelete={() => onDelete(m.id)}
							onSetDescription={(description) =>
								onSetDescription(m.id, description)
							}
							onToggleAdjustments={onToggleAdjustments}
						/>
					</Group>
				</div>
				<div className="flex items-start justify-between gap-2">
					{net ? (
						<MeasurementBadges
							areaAddSqm={m.areaAddSqm}
							areaSubtractSqm={m.areaSubtractSqm}
							color={color}
							globalWastage={globalWastage}
							net={net}
							onSetWastage={(percent) => onSetWastage(m.id, percent)}
							wastagePercent={m.wastagePercent}
						/>
					) : (
						<ValueBadge color={color} value={`${m.count ?? 0} markers`} />
					)}
				</div>
				{adjustmentsShown && net?.unit === 'm²' && (
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
						adjustmentsShown={adjustmentsShown}
						areaAddSqm={m.areaAddSqm}
						areaSubtractSqm={m.areaSubtractSqm}
						color={color}
						heightMeters={m.heightMeters}
						onSetAreaAdjust={(field, value) =>
							onSetAreaAdjust(m.id, field, value)
						}
						onSetHeight={(height) => onSetHeight(m.id, height)}
						roundedLength={roundUpLinearMm(
							net.value,
							m.wastagePercent ?? globalWastage
						)}
					/>
				)}
			</div>
			{deductions.length > 0 && (
				<ul className="ml-4 flex flex-col gap-1 border-l pl-2" data-no-select>
					{deductions.map((d) => {
						const DeductionIcon = TYPE_META[d.type].icon;
						return (
							<li
								className={cn(
									'flex items-center gap-2 rounded-md px-2 py-1 hover:bg-accent/50',
									d.id === selectedId && 'bg-accent ring-1 ring-ring ring-inset'
								)}
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

// The badges for a value-bearing measurement: actual and rounded-with-wastage
// on the left (AA/RA for area, AL/RL for linear), and a clickable wastage badge
// (W) on the right.
function MeasurementBadges({
	net,
	color,
	globalWastage,
	wastagePercent,
	areaAddSqm,
	areaSubtractSqm,
	onSetWastage,
}: {
	net: NetValue;
	color: string;
	globalWastage: number;
	wastagePercent?: number;
	areaAddSqm?: number;
	areaSubtractSqm?: number;
	onSetWastage: (percent: number | null) => void;
}) {
	const effectiveWastage = wastagePercent ?? globalWastage;
	const adjusted = areaAddSqm !== undefined || areaSubtractSqm !== undefined;
	const rounded =
		net.unit === 'm²'
			? adjustArea(
					roundUpWithWastage(net.value, effectiveWastage),
					areaAddSqm,
					areaSubtractSqm
				)
			: roundUpLinearMm(net.value, effectiveWastage);
	const roundedTitle =
		net.unit === 'm²' && adjusted
			? `Rounded up — incl. ${effectiveWastage}% wastage and manual adjustments`
			: `Rounded up — incl. ${effectiveWastage}% wastage`;
	const isArea = net.unit === 'm²';
	const actualPrefix = isArea ? 'AA' : 'AL';
	const roundedPrefix = isArea ? 'RA' : 'RL';
	return (
		<div className="flex flex-1 items-start justify-between gap-2">
			<div className="flex flex-wrap items-center gap-1">
				<ValueBadge
					color={color}
					title="Actual measured value"
					value={`${actualPrefix} ${formatActual(net)}`}
				/>
				<ValueBadge
					color={color}
					title={roundedTitle}
					value={`${roundedPrefix} ${rounded} ${net.unit}`}
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

// Optional wall-height input for a linear measurement. Height is entered in mm
// but stored in metres. When a positive height is set, a wall-area badge is shown:
// rounded length × height, rounded up to whole m², plus any manual adjustments.
function HeightAreaRow({
	color,
	heightMeters,
	roundedLength,
	areaAddSqm,
	areaSubtractSqm,
	adjustmentsShown,
	onSetHeight,
	onSetAreaAdjust,
}: {
	color: string;
	heightMeters?: number;
	roundedLength: number;
	areaAddSqm?: number;
	areaSubtractSqm?: number;
	adjustmentsShown: boolean;
	onSetHeight: (heightMeters: number | null) => void;
	onSetAreaAdjust: (
		field: 'areaAddSqm' | 'areaSubtractSqm',
		value: number | null
	) => void;
}) {
	// Height is entered in mm but stored in metres.
	const [draft, setDraft] = useState(
		heightMeters ? String(Math.round(heightMeters * MM_PER_METER)) : ''
	);

	useEffect(() => {
		setDraft(
			heightMeters ? String(Math.round(heightMeters * MM_PER_METER)) : ''
		);
	}, [heightMeters]);

	const commit = () => {
		const parsedMm = Number.parseFloat(draft);
		if (Number.isFinite(parsedMm) && parsedMm > 0) {
			const parsed = parsedMm / MM_PER_METER;
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
					Math.ceil((roundedLength / MM_PER_METER) * heightMeters),
					areaAddSqm,
					areaSubtractSqm
				)
			: null;

	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-center gap-2">
				<InputGroup className="flex-1">
					<InputGroupInput
						aria-label="Wall height in millimetres"
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
						<InputGroupText>mm</InputGroupText>
					</InputGroupAddon>
				</InputGroup>
				{area !== null && (
					<ValueBadge
						color={color}
						title="Wall area — rounded length × height, incl. adjustments"
						value={`WA ${area} m²`}
					/>
				)}
			</div>
			{adjustmentsShown && area !== null && (
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

// Two small inputs for manually adjusting an area: a `+` and a `−`.
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

// A soft, colour-matched badge showing the measurement value.
function ValueBadge({
	value,
	color,
	title,
}: {
	value: string;
	color: string;
	title?: string;
}) {
	return (
		<span
			className="inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium text-xs"
			style={{
				backgroundColor: `${color}22`,
				borderColor: `${color}55`,
				color,
			}}
			title={title}
		>
			{value}
		</span>
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
							<Button
								onClick={onConfirm}
								type="button"
								variant="destructive-outline"
							/>
						}
					>
						{label}
					</AlertDialogClose>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

// The right-justified actions menu for a measurement row: an adjustments toggle,
// a description editor, and a delete action. Colour is set at the group level.
function RowActionsMenu({
	label,
	description,
	deleteLabel,
	deleteDescription,
	adjustable,
	adjustmentsShown,
	onToggleAdjustments,
	onDelete,
	onSetDescription,
}: {
	label: string;
	description?: string;
	deleteLabel: string;
	deleteDescription: string;
	adjustable: boolean;
	adjustmentsShown: boolean;
	onToggleAdjustments: () => void;
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
					{adjustable && (
						<MenuItem onClick={onToggleAdjustments}>
							<SlidersHorizontal />
							{adjustmentsShown ? 'Hide adjustment' : 'Show adjustment'}
						</MenuItem>
					)}
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
									variant="destructive-outline"
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

// Dialog with a textarea to add/edit a measurement's description.
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
						<X aria-hidden /> Cancel
					</DialogClose>
					<Button onClick={save} type="button" variant="outline">
						<Check aria-hidden /> Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
