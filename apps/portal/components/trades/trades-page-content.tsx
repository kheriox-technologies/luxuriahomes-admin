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
import { api } from '@workspace/backend/api';
import type { Doc, Id } from '@workspace/backend/dataModel';
import {
	Accordion,
	AccordionItem,
	AccordionPanel,
	AccordionPrimitive,
} from '@workspace/ui/components/accordion';
import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from '@workspace/ui/components/empty';
import { Group, GroupSeparator } from '@workspace/ui/components/group';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupText,
} from '@workspace/ui/components/input-group';
import { cn } from '@workspace/ui/lib/utils';
import { useMutation, useQuery } from 'convex/react';
import {
	ChevronDownIcon,
	ChevronsDownIcon,
	ChevronsUpIcon,
	GripVertical,
	Pencil,
	SearchIcon,
	Trash2,
	Wrench,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import PageHeading from '@/components/page-heading';
import AddTrade from './add-trade';
import AddTradeStage from './add-trade-stage';
import DeleteTrade from './delete-trade';
import DeleteTradeStage from './delete-trade-stage';
import EditTrade from './edit-trade';
import EditTradeStage from './edit-trade-stage';
import { UNGROUPED_KEY } from './trade-stage-form-shared';

type Trade = Doc<'trades'>;
type Stage = Doc<'tradeStages'>;

interface TradeGroup {
	key: string;
	name: string;
	stageId: Id<'tradeStages'> | null;
	trades: Trade[];
}

const CONTAINER_PREFIX = 'container:';

function tradeOrderValue(trade: Trade): number {
	return trade.order ?? Number.MAX_SAFE_INTEGER;
}

function sortTrades(trades: Trade[]): Trade[] {
	return [...trades].sort((a, b) => {
		const byOrder = tradeOrderValue(a) - tradeOrderValue(b);
		if (byOrder !== 0) {
			return byOrder;
		}
		return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
	});
}

function buildGroups(stages: Stage[], trades: Trade[]): TradeGroup[] {
	const byStage = new Map<string, Trade[]>();
	const ungrouped: Trade[] = [];
	for (const trade of trades) {
		if (trade.stageId) {
			const list = byStage.get(trade.stageId) ?? [];
			list.push(trade);
			byStage.set(trade.stageId, list);
		} else {
			ungrouped.push(trade);
		}
	}
	const groups: TradeGroup[] = stages.map((stage) => ({
		key: stage._id,
		stageId: stage._id,
		name: stage.name,
		trades: sortTrades(byStage.get(stage._id) ?? []),
	}));
	// Ungrouped bucket always trails, even when empty, so stage-less trades have a
	// home and remain a valid drop target.
	groups.push({
		key: UNGROUPED_KEY,
		stageId: null,
		name: 'Ungrouped',
		trades: sortTrades(ungrouped),
	});
	return groups;
}

function groupKeyOfTrade(groups: TradeGroup[], tradeId: string): string | null {
	for (const group of groups) {
		if (group.trades.some((t) => t._id === tradeId)) {
			return group.key;
		}
	}
	return null;
}

type SortableHandle = Pick<
	ReturnType<typeof useSortable>,
	'attributes' | 'listeners'
>;

function DragHandle({
	attributes,
	listeners,
	label,
}: {
	attributes: SortableHandle['attributes'];
	listeners: SortableHandle['listeners'];
	label: string;
}) {
	return (
		<button
			aria-label={label}
			className="flex cursor-grab touch-none items-center text-muted-foreground active:cursor-grabbing"
			type="button"
			{...attributes}
			{...listeners}
		>
			<GripVertical className="size-4" />
		</button>
	);
}

function SortableTradeRow({
	trade,
	groupKey,
	dndEnabled,
}: {
	trade: Trade;
	groupKey: string;
	dndEnabled: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: trade._id,
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
			className="flex items-center gap-2 bg-card px-3 py-2"
			ref={setNodeRef}
			style={style}
		>
			{dndEnabled ? (
				<DragHandle
					attributes={attributes}
					label={`Reorder ${trade.name}`}
					listeners={listeners}
				/>
			) : null}
			<div className="min-w-0 flex-1">
				<div className="font-medium text-foreground text-sm">{trade.name}</div>
				{trade.description ? (
					<div className="truncate text-muted-foreground text-xs">
						{trade.description}
					</div>
				) : null}
			</div>
			<Group>
				<EditTrade
					initialDescription={trade.description}
					initialName={trade.name}
					initialStageId={trade.stageId}
					tradeId={trade._id}
					trigger={
						<Button
							aria-label="Edit trade"
							size="icon"
							type="button"
							variant="outline"
						>
							<Pencil />
						</Button>
					}
				/>
				<GroupSeparator />
				<DeleteTrade
					tradeId={trade._id}
					tradeName={trade.name}
					trigger={
						<Button
							aria-label="Delete trade"
							size="icon"
							type="button"
							variant="destructive-outline"
						>
							<Trash2 />
						</Button>
					}
				/>
			</Group>
		</div>
	);
}

function TradeList({
	group,
	dndEnabled,
}: {
	group: TradeGroup;
	dndEnabled: boolean;
}) {
	// Droppable so an empty group (or the Ungrouped bucket) still accepts drops.
	const { setNodeRef } = useDroppable({
		id: `${CONTAINER_PREFIX}${group.key}`,
		data: { type: 'container', groupKey: group.key },
	});

	return (
		<div ref={setNodeRef}>
			<SortableContext
				items={group.trades.map((t) => t._id)}
				strategy={verticalListSortingStrategy}
			>
				{group.trades.length === 0 ? (
					<div className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-xs">
						No trades in this stage yet.
					</div>
				) : (
					<div className="divide-y overflow-hidden rounded-md border">
						{group.trades.map((trade) => (
							<SortableTradeRow
								dndEnabled={dndEnabled}
								groupKey={group.key}
								key={trade._id}
								trade={trade}
							/>
						))}
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

function StageSection({
	group,
	dndEnabled,
}: {
	group: TradeGroup;
	dndEnabled: boolean;
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
	const stageId = group.stageId as Id<'tradeStages'>;

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
					) : null}
					<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left font-medium text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
						<span className="font-medium">{group.name}</span>
						<Badge size="lg" variant="secondary">
							{group.trades.length}
						</Badge>
					</AccordionPrimitive.Trigger>
					<EditTradeStage
						initialName={group.name}
						stageId={stageId}
						trigger={
							<Button
								aria-label="Edit stage"
								size="icon"
								type="button"
								variant="outline"
							>
								<Pencil />
							</Button>
						}
					/>
					<DeleteTradeStage
						stageId={stageId}
						stageName={group.name}
						trigger={
							<Button
								aria-label="Delete stage"
								size="icon"
								type="button"
								variant="destructive-outline"
							>
								<Trash2 />
							</Button>
						}
					/>
					<AccordionChevronTrigger label={`Toggle ${group.name}`} />
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<TradeList dndEnabled={dndEnabled} group={group} />
				</AccordionPanel>
			</AccordionItem>
		</div>
	);
}

function UngroupedSection({
	group,
	dndEnabled,
}: {
	group: TradeGroup;
	dndEnabled: boolean;
}) {
	return (
		<div className="rounded-lg border border-dashed bg-card">
			<AccordionItem className="border-b-0" value={group.key}>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					{/* Spacer aligns the header with the draggable stage sections above. */}
					<span aria-hidden className="w-4 shrink-0" />
					<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left font-medium text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
						<span className="font-medium text-muted-foreground">
							{group.name}
						</span>
						<Badge size="lg" variant="secondary">
							{group.trades.length}
						</Badge>
					</AccordionPrimitive.Trigger>
					<AccordionChevronTrigger label={`Toggle ${group.name}`} />
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<TradeList dndEnabled={dndEnabled} group={group} />
				</AccordionPanel>
			</AccordionItem>
		</div>
	);
}

function EmptyTradesState() {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Wrench aria-hidden />
				</EmptyMedia>
				<EmptyTitle>No trades yet</EmptyTitle>
				<EmptyDescription>
					Create a stage or a trade using the buttons above.
				</EmptyDescription>
			</EmptyHeader>
		</Empty>
	);
}

export default function TradesPageContent() {
	const stages = useQuery(api.tradeStages.list.list, {});
	const trades = useQuery(api.trades.list.list, {});
	// Optimistically patch the query caches on drop so the reactive re-sync doesn't
	// briefly snap rows back to their pre-drag order while the mutation round-trips.
	const reorderStages = useMutation(
		api.tradeStages.reorder.reorder
	).withOptimisticUpdate((store, args) => {
		const current = store.getQuery(api.tradeStages.list.list, {});
		if (!current) {
			return;
		}
		const orderById = new Map(args.stageIds.map((id, index) => [id, index]));
		const next = current
			.map((stage) =>
				orderById.has(stage._id)
					? { ...stage, order: orderById.get(stage._id) as number }
					: stage
			)
			.sort((a, b) => a.order - b.order);
		store.setQuery(api.tradeStages.list.list, {}, next);
	});
	const reorderTrades = useMutation(
		api.trades.reorderTrades.reorderTrades
	).withOptimisticUpdate((store, args) => {
		const current = store.getQuery(api.trades.list.list, {});
		if (!current) {
			return;
		}
		const byId = new Map(args.updates.map((u) => [u.tradeId, u]));
		const next = current.map((trade) => {
			const update = byId.get(trade._id);
			return update
				? {
						...trade,
						stageId: update.stageId ?? undefined,
						order: update.order,
					}
				: trade;
		});
		store.setQuery(api.trades.list.list, {}, next);
	});

	const [search, setSearch] = useState('');
	const [groups, setGroups] = useState<TradeGroup[]>([]);
	const [openKeys, setOpenKeys] = useState<string[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const [activeType, setActiveType] = useState<'stage' | 'trade' | null>(null);
	const dragSourceKeyRef = useRef<string | null>(null);
	const initializedRef = useRef(false);

	const serverGroups = useMemo(() => {
		if (!(stages && trades)) {
			return null;
		}
		return buildGroups(stages, trades);
	}, [stages, trades]);

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

	const trimmedSearch = search.trim().toLowerCase();

	const { displayGroups, forcedOpenKeys } = useMemo(() => {
		if (!trimmedSearch) {
			return { displayGroups: groups, forcedOpenKeys: [] as string[] };
		}
		const matches = (value: string | undefined) =>
			(value ?? '').toLowerCase().includes(trimmedSearch);
		const forced: string[] = [];
		const filtered: TradeGroup[] = [];
		for (const group of groups) {
			const stageMatches = matches(group.name);
			const matchingTrades = group.trades.filter(
				(t) => matches(t.name) || matches(t.description)
			);
			if (!stageMatches && matchingTrades.length === 0) {
				continue;
			}
			filtered.push({
				...group,
				trades: stageMatches ? group.trades : matchingTrades,
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

	const expandAll = () => setOpenKeys(groups.map((g) => g.key));
	const collapseAll = () => setOpenKeys([]);

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

	// Pointer-based collision so the droppable directly under the cursor wins —
	// closestCenter lets a large source list beat a small collapsed stage header,
	// which is why dropping onto a collapsed stage never registered. Stage drags
	// only consider other stages; trade drags prefer a hovered row, then a
	// container, then the stage header (so collapsed headers accept drops).
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

	// Resolve the group a droppable belongs to purely from its id. Relying on
	// dnd-kit's active/over `data` is unreliable here (the active draggable's data
	// can come through empty), so id classification is the source of truth.
	const resolveGroupKey = (overId: string): string | null => {
		const cls = classifyDroppable(overId);
		if (cls === 'container') {
			return overId.slice(CONTAINER_PREFIX.length);
		}
		if (cls === 'stage') {
			return overId;
		}
		return groupKeyOfTrade(groups, overId);
	};

	const onDragStart = (event: DragStartEvent) => {
		const id = String(event.active.id);
		const type = classifyDroppable(id);
		setActiveId(id);
		setActiveType(type === 'stage' ? 'stage' : 'trade');
		dragSourceKeyRef.current =
			type === 'trade' ? groupKeyOfTrade(groups, id) : null;
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over || classifyDroppable(String(active.id)) !== 'trade') {
			return;
		}
		const activeTradeId = String(active.id);
		const sourceKey = groupKeyOfTrade(groups, activeTradeId);
		const targetKey = resolveGroupKey(String(over.id));
		if (!(sourceKey && targetKey) || sourceKey === targetKey) {
			return;
		}
		setGroups((prev) => {
			const source = prev.find((g) => g.key === sourceKey);
			const target = prev.find((g) => g.key === targetKey);
			if (!(source && target)) {
				return prev;
			}
			const moving = source.trades.find((t) => t._id === activeTradeId);
			if (!moving) {
				return prev;
			}
			const overIndex = target.trades.findIndex((t) => t._id === over.id);
			const insertAt = overIndex >= 0 ? overIndex : target.trades.length;
			return prev.map((g) => {
				if (g.key === sourceKey) {
					return {
						...g,
						trades: g.trades.filter((t) => t._id !== activeTradeId),
					};
				}
				if (g.key === targetKey) {
					const next = [...g.trades];
					next.splice(insertAt, 0, moving);
					return { ...g, trades: next };
				}
				return g;
			});
		});
	};

	const persistTradeGroups = (source: TradeGroup[], keys: string[]) => {
		const updates: Array<{
			tradeId: Id<'trades'>;
			stageId: Id<'tradeStages'> | null;
			order: number;
		}> = [];
		for (const key of new Set(keys)) {
			const group = source.find((g) => g.key === key);
			if (!group) {
				continue;
			}
			group.trades.forEach((trade, index) => {
				updates.push({
					tradeId: trade._id,
					stageId: group.stageId,
					order: index,
				});
			});
		}
		if (updates.length > 0) {
			reorderTrades({ updates }).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
		}
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
			if (over && active.id !== over.id) {
				const oldIndex = stageKeys.indexOf(String(active.id));
				const newIndex = stageKeys.indexOf(String(over.id));
				if (oldIndex !== -1 && newIndex !== -1) {
					const reordered = arrayMove(stageKeys, oldIndex, newIndex);
					// Reflect immediately, then persist.
					setGroups((prev) => {
						const byKey = new Map(prev.map((g) => [g.key, g]));
						const ordered = reordered
							.map((k) => byKey.get(k))
							.filter((g): g is TradeGroup => Boolean(g));
						const ungrouped = prev.find((g) => g.key === UNGROUPED_KEY);
						return ungrouped ? [...ordered, ungrouped] : ordered;
					});
					reorderStages({
						stageIds: reordered as Id<'tradeStages'>[],
					}).catch(() => {
						/* Convex reactive queries revert the UI automatically */
					});
				}
			}
			finishDrag();
			return;
		}

		if (type === 'trade' && over) {
			const activeTradeId = String(active.id);
			const overId = String(over.id);
			const overType = classifyDroppable(overId);
			// Where the trade lives now (onDragOver may already have relocated it) and
			// where it was dropped. Resolving the target straight from `over` means a
			// drop onto a collapsed stage header still lands in that stage — appended
			// to the end.
			const currentKey = groupKeyOfTrade(groups, activeTradeId);
			const targetKey = resolveGroupKey(overId);
			let nextGroups = groups;
			if (currentKey && targetKey) {
				if (currentKey === targetKey && overType === 'trade') {
					// Reorder within the group against the row we dropped on.
					nextGroups = groups.map((g) => {
						if (g.key !== targetKey) {
							return g;
						}
						const oldIndex = g.trades.findIndex((t) => t._id === activeTradeId);
						const newIndex = g.trades.findIndex((t) => t._id === overId);
						if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
							return g;
						}
						return { ...g, trades: arrayMove(g.trades, oldIndex, newIndex) };
					});
				} else if (currentKey !== targetKey) {
					// Move across stages: drop onto a row inserts at that row, drop onto
					// a stage header or panel appends to the end.
					const moving = groups
						.find((g) => g.key === currentKey)
						?.trades.find((t) => t._id === activeTradeId);
					if (moving) {
						nextGroups = groups.map((g) => {
							if (g.key === currentKey) {
								return {
									...g,
									trades: g.trades.filter((t) => t._id !== activeTradeId),
								};
							}
							if (g.key === targetKey) {
								const without = g.trades.filter((t) => t._id !== activeTradeId);
								const overIndex =
									overType === 'trade'
										? without.findIndex((t) => t._id === overId)
										: -1;
								const insertAt = overIndex >= 0 ? overIndex : without.length;
								const next = [...without];
								next.splice(insertAt, 0, moving);
								return { ...g, trades: next };
							}
							return g;
						});
					}
				}
			}
			setGroups(nextGroups);
			// Reveal the destination when a trade moves into a (possibly collapsed)
			// stage so the drop result is visible.
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
			persistTradeGroups(nextGroups, affected);
			return;
		}

		finishDrag();
	};

	const activeTrade =
		activeType === 'trade'
			? (trades ?? []).find((t) => t._id === activeId)
			: undefined;
	const activeStage =
		activeType === 'stage' ? groups.find((g) => g.key === activeId) : undefined;

	let content: React.ReactNode;
	if (!serverGroups) {
		content = (
			<div className="text-muted-foreground text-sm">Loading trades…</div>
		);
	} else if ((trades?.length ?? 0) === 0 && (stages?.length ?? 0) === 0) {
		content = <EmptyTradesState />;
	} else if (trimmedSearch !== '' && displayGroups.length === 0) {
		content = (
			<Empty>
				<EmptyHeader>
					<EmptyMedia variant="icon">
						<Wrench aria-hidden />
					</EmptyMedia>
					<EmptyTitle>No matching trades</EmptyTitle>
					<EmptyDescription>
						Try a different stage or trade name.
					</EmptyDescription>
				</EmptyHeader>
			</Empty>
		);
	} else {
		content = (
			<div className="min-h-0 flex-1 overflow-y-auto">
				<DndContext
					collisionDetection={collisionDetection}
					measuring={{
						droppable: { strategy: MeasuringStrategy.Always },
					}}
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
										dndEnabled={dndEnabled}
										group={group}
										key={group.key}
									/>
								))}
						</SortableContext>
						{displayGroups
							.filter((g) => g.key === UNGROUPED_KEY)
							.map((group) => (
								<UngroupedSection
									dndEnabled={dndEnabled}
									group={group}
									key={group.key}
								/>
							))}
					</Accordion>
					<DragOverlay>
						{activeTrade ? (
							<div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-md">
								<GripVertical className="size-4 text-muted-foreground" />
								<span className="font-medium text-sm">{activeTrade.name}</span>
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

	return (
		<div className={cn('flex min-h-0 flex-1 flex-col gap-4')}>
			<PageHeading
				heading="Trades"
				icon={Wrench}
				rightSlot={
					<>
						<InputGroup className="w-full sm:min-w-80 sm:max-w-2xl">
							<InputGroupAddon align="inline-start">
								<InputGroupText>
									<SearchIcon aria-hidden />
								</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								aria-label="Search trades"
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search by stage, name or description…"
								type="search"
								value={search}
							/>
						</InputGroup>
						<Button
							aria-label="Expand all"
							onClick={expandAll}
							size="icon"
							type="button"
							variant="outline"
						>
							<ChevronsDownIcon />
						</Button>
						<Button
							aria-label="Collapse all"
							onClick={collapseAll}
							size="icon"
							type="button"
							variant="outline"
						>
							<ChevronsUpIcon />
						</Button>
						<AddTradeStage />
						<AddTrade />
					</>
				}
			/>
			{content}
		</div>
	);
}
