'use client';

import type {
	CollisionDetection,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from '@dnd-kit/core';
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MeasuringStrategy,
	PointerSensor,
	pointerWithin,
	useDroppable,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { cn } from '@workspace/ui/lib/utils';
import { ChevronDownIcon, GripVertical } from 'lucide-react';
import {
	type ReactNode,
	type Ref,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { UNGROUPED_KEY } from './trade-stage-form-shared';

export interface StageGroup<Item> {
	items: Item[];
	key: string;
	name: string;
	stageId: Id<'tradeStages'> | null;
}

export interface StageGroupedListHandle {
	collapseAll: () => void;
	expandAll: () => void;
}

interface StageGroupedListProps<Item> {
	emptyGroupLabel?: string;
	// Top-align the drag handle for this item (e.g. tall, multi-line grouped rows).
	getItemAlignStart?: (item: Item) => boolean;
	getItemId: (item: Item) => string;
	getItemName: (item: Item) => string;
	getItemOrder?: (item: Item) => number | undefined;
	getItemSearchText?: (item: Item) => string;
	getStageId: (item: Item) => Id<'tradeStages'> | null | undefined;
	items: Item[] | undefined;
	loadingLabel?: string;
	noResults?: ReactNode;
	onPersistItems: (groups: StageGroup<Item>[], affectedKeys: string[]) => void;
	onReorderStages?: (stageIds: Id<'tradeStages'>[]) => void;
	ref?: Ref<StageGroupedListHandle>;
	renderRowContent: (item: Item) => ReactNode;
	renderStageActions?: (group: StageGroup<Item>) => ReactNode;
	renderStageBadges?: (group: StageGroup<Item>) => ReactNode;
	// When set, the stage header lays its name + `renderStageColumns` cells out on
	// this grid (the same grid className the rows use) so per-stage column badges
	// line up with the row amount columns. The 13px inset matches the extra
	// padding/border nesting the rows sit inside vs. the stage header.
	renderStageColumns?: (group: StageGroup<Item>) => ReactNode;
	search?: string;
	stageColumnsClassName?: string;
	stages: Doc<'tradeStages'>[] | undefined;
}

const CONTAINER_PREFIX = 'container:';

// Stable module-level reference. Passing a fresh object to DndContext's
// `measuring` prop every render makes dnd-kit re-run its measuring effects on
// each render; with `MeasuringStrategy.Always` those effects setState the
// measured rects, which re-renders and loops ("Maximum update depth exceeded").
const MEASURING_CONFIG = {
	droppable: { strategy: MeasuringStrategy.Always },
};

function orderValue(order: number | undefined): number {
	return order ?? Number.MAX_SAFE_INTEGER;
}

type SortableHandle = Pick<
	ReturnType<typeof useSortable>,
	'attributes' | 'listeners'
>;

function DragHandle({
	attributes,
	listeners,
	label,
	className,
}: {
	attributes: SortableHandle['attributes'];
	listeners: SortableHandle['listeners'];
	label: string;
	className?: string;
}) {
	return (
		<button
			aria-label={label}
			className={cn(
				'flex cursor-grab touch-none items-center text-muted-foreground active:cursor-grabbing',
				className
			)}
			type="button"
			{...attributes}
			{...listeners}
		>
			<GripVertical className="size-4" />
		</button>
	);
}

function SortableItemRow<Item>({
	item,
	itemId,
	label,
	groupKey,
	dndEnabled,
	alignStart,
	renderRowContent,
}: {
	item: Item;
	itemId: string;
	label: string;
	groupKey: string;
	dndEnabled: boolean;
	alignStart: boolean;
	renderRowContent: (item: Item) => ReactNode;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: itemId,
		data: { type: 'trade', groupKey },
		disabled: !dndEnabled,
	});
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	return (
		<div
			className={cn(
				'flex gap-2 bg-card px-3 py-2',
				// Top-align the handle for tall (grouped) rows so the grip sits on the
				// header line instead of floating in the middle of the expanded block.
				alignStart ? 'items-start' : 'items-center'
			)}
			ref={setNodeRef}
			style={style}
		>
			{dndEnabled ? (
				<DragHandle
					attributes={attributes}
					className={alignStart ? 'h-9' : undefined}
					label={`Reorder ${label}`}
					listeners={listeners}
				/>
			) : (
				<span aria-hidden className={cn('w-4 shrink-0', alignStart && 'h-9')} />
			)}
			{renderRowContent(item)}
		</div>
	);
}

function ItemList<Item>({
	group,
	dndEnabled,
	getItemId,
	getItemName,
	getItemAlignStart,
	renderRowContent,
	emptyGroupLabel,
}: {
	group: StageGroup<Item>;
	dndEnabled: boolean;
	getItemId: (item: Item) => string;
	getItemName: (item: Item) => string;
	getItemAlignStart?: (item: Item) => boolean;
	renderRowContent: (item: Item) => ReactNode;
	emptyGroupLabel: string;
}) {
	// Droppable so an empty group (or the Ungrouped bucket) still accepts drops.
	const { setNodeRef } = useDroppable({
		id: `${CONTAINER_PREFIX}${group.key}`,
		data: { type: 'container', groupKey: group.key },
	});

	// getItemId is an inline closure whose identity changes every render; read it
	// through a ref so the SortableContext `items` array stays referentially stable
	// while the group's items are unchanged (a fresh array would churn dnd-kit).
	const getItemIdRef = useRef(getItemId);
	getItemIdRef.current = getItemId;
	const itemIds = useMemo(
		() => group.items.map((item) => getItemIdRef.current(item)),
		[group.items]
	);

	return (
		<div ref={setNodeRef}>
			<SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
				{group.items.length === 0 ? (
					<div className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-xs">
						{emptyGroupLabel}
					</div>
				) : (
					<div className="divide-y overflow-hidden rounded-md border">
						{group.items.map((item) => {
							const itemId = getItemId(item);
							return (
								<SortableItemRow
									alignStart={getItemAlignStart?.(item) ?? false}
									dndEnabled={dndEnabled}
									groupKey={group.key}
									item={item}
									itemId={itemId}
									key={itemId}
									label={getItemName(item)}
									renderRowContent={renderRowContent}
								/>
							);
						})}
					</div>
				)}
			</SortableContext>
		</div>
	);
}

// Standalone accordion toggle rendered after the action buttons so the chevron
// sits at the far right of the header instead of beside the name.
function AccordionChevronTrigger({ label }: { label: string }) {
	return (
		<AccordionPrimitive.Trigger
			aria-label={label}
			className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-muted-foreground outline-none transition-colors hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring data-panel-open:[&>svg]:rotate-180"
		>
			<ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 ease-in-out" />
		</AccordionPrimitive.Trigger>
	);
}

function StageSection<Item>({
	group,
	dndEnabled,
	getItemId,
	getItemName,
	getItemAlignStart,
	renderRowContent,
	renderStageBadges,
	renderStageActions,
	renderStageColumns,
	stageColumnsClassName,
	emptyGroupLabel,
}: {
	group: StageGroup<Item>;
	dndEnabled: boolean;
	getItemId: (item: Item) => string;
	getItemName: (item: Item) => string;
	getItemAlignStart?: (item: Item) => boolean;
	renderRowContent: (item: Item) => ReactNode;
	renderStageBadges: (group: StageGroup<Item>) => ReactNode;
	renderStageActions?: (group: StageGroup<Item>) => ReactNode;
	renderStageColumns?: (group: StageGroup<Item>) => ReactNode;
	stageColumnsClassName?: string;
	emptyGroupLabel: string;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: group.key,
		data: { type: 'stage' },
		disabled: !dndEnabled,
	});
	const style = {
		transform: CSS.Translate.toString(transform),
		transition,
		opacity: isDragging ? 0.4 : 1,
	};

	return (
		<div className="rounded-lg border bg-card" ref={setNodeRef} style={style}>
			<AccordionItem className="border-b-0" value={group.key}>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					{dndEnabled ? (
						<DragHandle
							attributes={attributes}
							label={`Reorder ${group.name}`}
							listeners={listeners}
						/>
					) : (
						<span aria-hidden className="w-4 shrink-0" />
					)}
					{stageColumnsClassName ? (
						<div className={cn(stageColumnsClassName, 'flex-1 px-[13px]')}>
							<AccordionPrimitive.Trigger className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md py-4 text-left font-medium text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
								<span className="truncate font-medium">{group.name}</span>
								{renderStageBadges(group)}
							</AccordionPrimitive.Trigger>
							{renderStageColumns?.(group)}
							<div className="flex justify-end">
								<AccordionChevronTrigger label={`Toggle ${group.name}`} />
							</div>
						</div>
					) : (
						<>
							<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left font-medium text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
								<span className="font-medium">{group.name}</span>
								{renderStageBadges(group)}
							</AccordionPrimitive.Trigger>
							{renderStageActions?.(group)}
							<AccordionChevronTrigger label={`Toggle ${group.name}`} />
						</>
					)}
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<ItemList
						dndEnabled={dndEnabled}
						emptyGroupLabel={emptyGroupLabel}
						getItemAlignStart={getItemAlignStart}
						getItemId={getItemId}
						getItemName={getItemName}
						group={group}
						renderRowContent={renderRowContent}
					/>
				</AccordionPanel>
			</AccordionItem>
		</div>
	);
}

function UngroupedSection<Item>({
	group,
	dndEnabled,
	getItemId,
	getItemName,
	getItemAlignStart,
	renderRowContent,
	renderStageBadges,
	renderStageColumns,
	stageColumnsClassName,
	emptyGroupLabel,
}: {
	group: StageGroup<Item>;
	dndEnabled: boolean;
	getItemId: (item: Item) => string;
	getItemName: (item: Item) => string;
	getItemAlignStart?: (item: Item) => boolean;
	renderRowContent: (item: Item) => ReactNode;
	renderStageBadges: (group: StageGroup<Item>) => ReactNode;
	renderStageColumns?: (group: StageGroup<Item>) => ReactNode;
	stageColumnsClassName?: string;
	emptyGroupLabel: string;
}) {
	return (
		<div className="rounded-lg border border-dashed bg-card">
			<AccordionItem className="border-b-0" value={group.key}>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					{/* Spacer aligns the header with the draggable stage sections above. */}
					<span aria-hidden className="w-4 shrink-0" />
					{stageColumnsClassName ? (
						<div className={cn(stageColumnsClassName, 'flex-1 px-[13px]')}>
							<AccordionPrimitive.Trigger className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md py-4 text-left font-medium text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
								<span className="truncate font-medium text-muted-foreground">
									{group.name}
								</span>
								{renderStageBadges(group)}
							</AccordionPrimitive.Trigger>
							{renderStageColumns?.(group)}
							<div className="flex justify-end">
								<AccordionChevronTrigger label={`Toggle ${group.name}`} />
							</div>
						</div>
					) : (
						<>
							<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left font-medium text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
								<span className="font-medium text-muted-foreground">
									{group.name}
								</span>
								{renderStageBadges(group)}
							</AccordionPrimitive.Trigger>
							<AccordionChevronTrigger label={`Toggle ${group.name}`} />
						</>
					)}
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<ItemList
						dndEnabled={dndEnabled}
						emptyGroupLabel={emptyGroupLabel}
						getItemAlignStart={getItemAlignStart}
						getItemId={getItemId}
						getItemName={getItemName}
						group={group}
						renderRowContent={renderRowContent}
					/>
				</AccordionPanel>
			</AccordionItem>
		</div>
	);
}

export function StageGroupedList<Item>({
	stages,
	items,
	getItemId,
	getStageId,
	getItemName,
	getItemOrder,
	getItemSearchText,
	getItemAlignStart,
	renderRowContent,
	renderStageBadges,
	renderStageActions,
	renderStageColumns,
	stageColumnsClassName,
	onPersistItems,
	onReorderStages,
	search = '',
	emptyGroupLabel = 'No items in this stage yet.',
	loadingLabel = 'Loading…',
	noResults,
	ref,
}: StageGroupedListProps<Item>) {
	// Accessors come from callers as inline closures (their identity changes every
	// render). Read them through refs so `serverGroups`/`displayGroups` only
	// recompute when the underlying data changes — otherwise the sync effect below
	// would fire on every render and loop.
	const accessors = useRef({
		getItemId,
		getStageId,
		getItemName,
		getItemOrder,
		getItemSearchText,
	});
	accessors.current = {
		getItemId,
		getStageId,
		getItemName,
		getItemOrder,
		getItemSearchText,
	};

	const [groups, setGroups] = useState<StageGroup<Item>[]>([]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeType, setActiveType] = useState<'stage' | 'trade' | null>(null);
	const dragSourceKeyRef = useRef<string | null>(null);
	const initializedRef = useRef(false);
	// The component's own scroll container. Autoscroll is restricted to this
	// element (see `autoScroll` below) so dnd-kit never scrolls an ancestor
	// scroller during a drag.
	const scrollerRef = useRef<HTMLDivElement>(null);
	// Signature of the last cross-group move applied in onDragOver; guards against
	// re-processing an identical hover and looping at a container boundary.
	const lastDragOverRef = useRef<string | null>(null);

	const serverGroups = useMemo(() => {
		if (!(stages && items)) {
			return null;
		}
		const {
			getStageId: stageOf,
			getItemOrder: orderOf,
			getItemName: nameOf,
		} = accessors.current;
		const sortItems = (list: Item[]) =>
			[...list].sort((a, b) => {
				const byOrder = orderValue(orderOf?.(a)) - orderValue(orderOf?.(b));
				if (byOrder !== 0) {
					return byOrder;
				}
				return nameOf(a).localeCompare(nameOf(b), undefined, {
					sensitivity: 'base',
				});
			});
		const byStage = new Map<string, Item[]>();
		const ungrouped: Item[] = [];
		for (const item of items) {
			const stageId = stageOf(item);
			if (stageId) {
				const list = byStage.get(stageId) ?? [];
				list.push(item);
				byStage.set(stageId, list);
			} else {
				ungrouped.push(item);
			}
		}
		const built: StageGroup<Item>[] = stages.map((stage) => ({
			key: stage._id,
			stageId: stage._id,
			name: stage.name,
			items: sortItems(byStage.get(stage._id) ?? []),
		}));
		built.push({
			key: UNGROUPED_KEY,
			stageId: null,
			name: 'Ungrouped',
			items: sortItems(ungrouped),
		});
		return built;
	}, [stages, items]);

	// Mirror server data into local state so drags can relocate rows optimistically.
	// Never overwrite mid-drag or the dragged row would snap back.
	useEffect(() => {
		if (serverGroups && !activeId) {
			setGroups(serverGroups);
		}
	}, [serverGroups, activeId]);

	// Open every group the first time data loads.
	useEffect(() => {
		if (serverGroups && !initializedRef.current) {
			initializedRef.current = true;
			setOpenKeys(serverGroups.map((g) => g.key));
		}
	}, [serverGroups]);

	useImperativeHandle(
		ref,
		() => ({
			expandAll: () => setOpenKeys(groups.map((g) => g.key)),
			collapseAll: () => setOpenKeys([]),
		}),
		[groups]
	);

	const trimmedSearch = search.trim().toLowerCase();

	const { displayGroups, forcedOpenKeys } = useMemo(() => {
		if (!trimmedSearch) {
			return { displayGroups: groups, forcedOpenKeys: [] as string[] };
		}
		const matches = (value: string | undefined) =>
			(value ?? '').toLowerCase().includes(trimmedSearch);
		const { getItemSearchText: textOf, getItemName: nameOf } =
			accessors.current;
		const searchText = textOf ?? nameOf;
		const forced: string[] = [];
		const filtered: StageGroup<Item>[] = [];
		for (const group of groups) {
			const stageMatches = matches(group.name);
			const matchingItems = group.items.filter((item) =>
				matches(searchText(item))
			);
			if (!stageMatches && matchingItems.length === 0) {
				continue;
			}
			filtered.push({
				...group,
				items: stageMatches ? group.items : matchingItems,
			});
			forced.push(group.key);
		}
		return { displayGroups: filtered, forcedOpenKeys: forced };
	}, [groups, trimmedSearch]);

	const dndEnabled = trimmedSearch === '';
	const effectiveOpenKeys = trimmedSearch === '' ? openKeys : forcedOpenKeys;

	const stageKeys = useMemo(
		() =>
			displayGroups.filter((g) => g.key !== UNGROUPED_KEY).map((g) => g.key),
		[displayGroups]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Only allow autoscroll on our own scroller. dnd-kit v6 attempts the
	// outermost scrollable ancestor first, so on height-constrained hosts it would
	// scroll the page/app-layout region — moving every droppable under a stationary
	// pointer, which flip-flops `over` and re-runs onDragOver's setState until React
	// throws "Maximum update depth exceeded". Restricting to `scrollerRef` keeps
	// autoscroll working on the list without touching ancestor scrollers.
	const autoScroll = useMemo(
		() => ({
			canScroll: (element: Element) => element === scrollerRef.current,
		}),
		[]
	);

	const groupKeyOfItem = (source: StageGroup<Item>[], id: string) => {
		for (const group of source) {
			if (group.items.some((item) => getItemId(item) === id)) {
				return group.key;
			}
		}
		return null;
	};

	// Classify a droppable id using our own data rather than dnd-kit internals.
	const classifyDroppable = (id: string): 'container' | 'stage' | 'trade' => {
		if (id.startsWith(CONTAINER_PREFIX)) {
			return 'container';
		}
		if (id !== UNGROUPED_KEY && groups.some((g) => g.key === id)) {
			return 'stage';
		}
		return 'trade';
	};

	// Pointer-based collision so the droppable directly under the cursor wins, so
	// dropping onto a collapsed stage header registers. Stage drags only consider
	// other stages; trade drags prefer a hovered row, then a container, then the
	// stage header.
	const collisionDetection: CollisionDetection = (args) => {
		if (classifyDroppable(String(args.active.id)) === 'stage') {
			const stageContainers = args.droppableContainers.filter(
				(c) => classifyDroppable(String(c.id)) === 'stage'
			);
			return closestCenter({ ...args, droppableContainers: stageContainers });
		}
		const pointerHits = pointerWithin(args);
		const hits = pointerHits.length > 0 ? pointerHits : closestCenter(args);
		if (hits.length === 0) {
			return hits;
		}
		const tradeHit = hits.find(
			(c) => classifyDroppable(String(c.id)) === 'trade'
		);
		if (tradeHit) {
			return [tradeHit];
		}
		const containerHit = hits.find(
			(c) => classifyDroppable(String(c.id)) === 'container'
		);
		return [containerHit ?? hits[0]];
	};

	const resolveGroupKey = (overId: string): string | null => {
		const cls = classifyDroppable(overId);
		if (cls === 'container') {
			return overId.slice(CONTAINER_PREFIX.length);
		}
		if (cls === 'stage') {
			return overId;
		}
		return groupKeyOfItem(groups, overId);
	};

	const onDragStart = (event: DragStartEvent) => {
		const id = String(event.active.id);
		const type = classifyDroppable(id);
		setActiveId(id);
		setActiveType(type === 'stage' ? 'stage' : 'trade');
		dragSourceKeyRef.current =
			type === 'trade' ? groupKeyOfItem(groups, id) : null;
		lastDragOverRef.current = null;
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over || classifyDroppable(String(active.id)) !== 'trade') {
			return;
		}
		const activeItemId = String(active.id);
		const sourceKey = groupKeyOfItem(groups, activeItemId);
		const targetKey = resolveGroupKey(String(over.id));
		if (!(sourceKey && targetKey) || sourceKey === targetKey) {
			return;
		}
		// Skip if this exact hover was already applied — stops boundary flip-flop
		// from re-triggering setGroups in a loop.
		const signature = `${activeItemId}:${targetKey}:${String(over.id)}`;
		if (lastDragOverRef.current === signature) {
			return;
		}
		lastDragOverRef.current = signature;
		setGroups((prev) => {
			const source = prev.find((g) => g.key === sourceKey);
			const target = prev.find((g) => g.key === targetKey);
			if (!(source && target)) {
				return prev;
			}
			const moving = source.items.find(
				(item) => getItemId(item) === activeItemId
			);
			if (!moving) {
				return prev;
			}
			const overIndex = target.items.findIndex(
				(item) => getItemId(item) === over.id
			);
			const insertAt = overIndex >= 0 ? overIndex : target.items.length;
			return prev.map((g) => {
				if (g.key === sourceKey) {
					return {
						...g,
						items: g.items.filter((item) => getItemId(item) !== activeItemId),
					};
				}
				if (g.key === targetKey) {
					const next = [...g.items];
					next.splice(insertAt, 0, moving);
					return { ...g, items: next };
				}
				return g;
			});
		});
	};

	const finishDrag = () => {
		setActiveId(null);
		setActiveType(null);
		dragSourceKeyRef.current = null;
	};

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		const type = classifyDroppable(String(active.id));

		if (type === 'stage') {
			if (over && active.id !== over.id && onReorderStages) {
				const oldIndex = stageKeys.indexOf(String(active.id));
				const newIndex = stageKeys.indexOf(String(over.id));
				if (oldIndex !== -1 && newIndex !== -1) {
					const reordered = arrayMove(stageKeys, oldIndex, newIndex);
					setGroups((prev) => {
						const byKey = new Map(prev.map((g) => [g.key, g]));
						const ordered = reordered
							.map((k) => byKey.get(k))
							.filter((g): g is StageGroup<Item> => Boolean(g));
						const ungrouped = prev.find((g) => g.key === UNGROUPED_KEY);
						return ungrouped ? [...ordered, ungrouped] : ordered;
					});
					onReorderStages(reordered as Id<'tradeStages'>[]);
				}
			}
			finishDrag();
			return;
		}

		if (type === 'trade' && over) {
			const activeItemId = String(active.id);
			const overId = String(over.id);
			const overType = classifyDroppable(overId);
			const currentKey = groupKeyOfItem(groups, activeItemId);
			const targetKey = resolveGroupKey(overId);
			let nextGroups = groups;
			if (currentKey && targetKey) {
				if (currentKey === targetKey && overType === 'trade') {
					nextGroups = groups.map((g) => {
						if (g.key !== targetKey) {
							return g;
						}
						const oldIndex = g.items.findIndex(
							(item) => getItemId(item) === activeItemId
						);
						const newIndex = g.items.findIndex(
							(item) => getItemId(item) === overId
						);
						if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
							return g;
						}
						return { ...g, items: arrayMove(g.items, oldIndex, newIndex) };
					});
				} else if (currentKey !== targetKey) {
					const moving = groups
						.find((g) => g.key === currentKey)
						?.items.find((item) => getItemId(item) === activeItemId);
					if (moving) {
						nextGroups = groups.map((g) => {
							if (g.key === currentKey) {
								return {
									...g,
									items: g.items.filter(
										(item) => getItemId(item) !== activeItemId
									),
								};
							}
							if (g.key === targetKey) {
								const without = g.items.filter(
									(item) => getItemId(item) !== activeItemId
								);
								const overIndex =
									overType === 'trade'
										? without.findIndex((item) => getItemId(item) === overId)
										: -1;
								const insertAt = overIndex >= 0 ? overIndex : without.length;
								const next = [...without];
								next.splice(insertAt, 0, moving);
								return { ...g, items: next };
							}
							return g;
						});
					}
				}
			}
			setGroups(nextGroups);
			if (targetKey && currentKey !== targetKey) {
				setOpenKeys((prev) =>
					prev.includes(targetKey) ? prev : [...prev, targetKey]
				);
			}
			const affected = [dragSourceKeyRef.current, currentKey, targetKey].filter(
				(k): k is string => Boolean(k)
			);
			setActiveId(null);
			setActiveType(null);
			dragSourceKeyRef.current = null;
			onPersistItems(nextGroups, affected);
			return;
		}

		finishDrag();
	};

	const defaultBadges = (group: StageGroup<Item>) => (
		<Badge size="lg" variant="secondary">
			{group.items.length}
		</Badge>
	);
	const stageBadges = renderStageBadges ?? defaultBadges;

	const activeItem =
		activeType === 'trade' && activeId
			? (items ?? []).find((item) => getItemId(item) === activeId)
			: undefined;
	const activeStage =
		activeType === 'stage' ? groups.find((g) => g.key === activeId) : undefined;

	if (!serverGroups) {
		return <div className="text-muted-foreground text-sm">{loadingLabel}</div>;
	}

	if (trimmedSearch !== '' && displayGroups.length === 0 && noResults) {
		return <>{noResults}</>;
	}

	return (
		<div className="min-h-0 flex-1 overflow-y-auto" ref={scrollerRef}>
			<DndContext
				autoScroll={autoScroll}
				collisionDetection={collisionDetection}
				measuring={MEASURING_CONFIG}
				onDragEnd={onDragEnd}
				onDragOver={onDragOver}
				onDragStart={onDragStart}
				sensors={sensors}
			>
				<Accordion
					className="flex flex-col gap-3"
					multiple
					onValueChange={(value) => setOpenKeys(value as string[])}
					value={effectiveOpenKeys}
				>
					<SortableContext
						items={stageKeys}
						strategy={verticalListSortingStrategy}
					>
						{displayGroups
							.filter((g) => g.key !== UNGROUPED_KEY)
							.map((group) => (
								<StageSection
									dndEnabled={dndEnabled && Boolean(onReorderStages)}
									emptyGroupLabel={emptyGroupLabel}
									getItemAlignStart={getItemAlignStart}
									getItemId={getItemId}
									getItemName={getItemName}
									group={group}
									key={group.key}
									renderRowContent={renderRowContent}
									renderStageActions={renderStageActions}
									renderStageBadges={stageBadges}
									renderStageColumns={renderStageColumns}
									stageColumnsClassName={stageColumnsClassName}
								/>
							))}
					</SortableContext>
					{displayGroups
						.filter((g) => g.key === UNGROUPED_KEY)
						.map((group) => (
							<UngroupedSection
								dndEnabled={dndEnabled}
								emptyGroupLabel={emptyGroupLabel}
								getItemAlignStart={getItemAlignStart}
								getItemId={getItemId}
								getItemName={getItemName}
								group={group}
								key={group.key}
								renderRowContent={renderRowContent}
								renderStageBadges={stageBadges}
								renderStageColumns={renderStageColumns}
								stageColumnsClassName={stageColumnsClassName}
							/>
						))}
				</Accordion>
				<DragOverlay>
					{activeItem ? (
						<div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-md">
							<GripVertical className="size-4 text-muted-foreground" />
							<span className="font-medium text-sm">
								{getItemName(activeItem)}
							</span>
						</div>
					) : null}
					{activeStage ? (
						<div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 font-medium text-sm shadow-md">
							<GripVertical className="size-4 text-muted-foreground" />
							{activeStage.name}
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
