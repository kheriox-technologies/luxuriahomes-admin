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
	Menu,
	MenuItem,
	MenuPopup,
	MenuSeparator,
	MenuTrigger,
} from '@workspace/ui/components/menu';
import { useMutation } from 'convex/react';
import {
	ChevronDownIcon,
	EllipsisVertical,
	GripVertical,
	Pencil,
	Plus,
	Trash2,
} from 'lucide-react';
import {
	type ReactNode,
	type Ref,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	DragHandle,
	InlineAddRow,
} from '@/components/quote-lists/list-primitives';
import AddQuoteTermItem from './add-quote-term-item';
import DeleteQuoteTermItem from './delete-quote-term-item';
import DeleteQuoteTermSection from './delete-quote-term-section';
import EditQuoteTermItem from './edit-quote-term-item';
import EditQuoteTermSection from './edit-quote-term-section';

export interface TermSectionNode {
	items: Doc<'quoteTermItems'>[];
	section: Doc<'quoteTermSections'>;
}

export interface QuoteTermsTreeHandle {
	collapseAll: () => void;
	expandAll: () => void;
}

// Draggable/droppable ids are namespaced so a single DndContext can host both
// levels and classify what is being dragged from the id alone.
const SECTION_PREFIX = 'section:';
const ITEM_PREFIX = 'item:';
const ITEM_BOX_PREFIX = 'itembox:';

type DragKind = 'item' | 'itembox' | 'section';

function classify(id: string): DragKind {
	if (id.startsWith(SECTION_PREFIX)) {
		return 'section';
	}
	if (id.startsWith(ITEM_BOX_PREFIX)) {
		return 'itembox';
	}
	return 'item';
}

function rawId(id: string): string {
	return id.slice(id.indexOf(':') + 1);
}

// Stable module-level reference — a fresh object each render makes dnd-kit
// re-run its measuring effects, which with `Always` loops on setState.
const MEASURING_CONFIG = {
	droppable: { strategy: MeasuringStrategy.Always },
};

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

function InlineAddItem({ sectionId }: { sectionId: Id<'quoteTermSections'> }) {
	const addItem = useMutation(api.quoteTermItems.add.add);
	return (
		<InlineAddRow
			noun="clause"
			onAdd={(text) => addItem({ text, sectionId })}
			placeholder="Add a clause and press Enter…"
		/>
	);
}

function InlineAddSection() {
	const addSection = useMutation(api.quoteTermSections.add.add);
	return (
		<InlineAddRow
			noun="section"
			onAdd={(name) => addSection({ name })}
			placeholder="Add a section and press Enter…"
		/>
	);
}

function ItemRow({
	item,
	number,
	dndEnabled,
}: {
	item: Doc<'quoteTermItems'>;
	number: string;
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
		id: `${ITEM_PREFIX}${item._id}`,
		disabled: !dndEnabled,
	});
	// The menu closes on click, so its dialogs are controlled from here rather
	// than mounted inside a MenuItem.
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div
			className="flex items-center gap-2 bg-card px-3 py-2"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			{dndEnabled ? (
				<DragHandle
					attributes={attributes}
					label={`Reorder clause ${number}`}
					listeners={listeners}
				/>
			) : (
				<span aria-hidden className="w-4 shrink-0" />
			)}
			<span className="shrink-0 text-muted-foreground text-xs tabular-nums">
				{number}
			</span>
			<p className="min-w-0 flex-1 text-foreground text-sm">{item.text}</p>
			<Menu>
				<MenuTrigger
					render={
						<Button
							aria-label={`Clause ${number} actions`}
							size="icon"
							type="button"
							variant="ghost"
						/>
					}
				>
					<EllipsisVertical className="size-4" />
				</MenuTrigger>
				<MenuPopup align="end">
					<MenuItem onClick={() => setEditOpen(true)}>
						<Pencil />
						Edit Clause
					</MenuItem>
					<MenuSeparator />
					<MenuItem onClick={() => setDeleteOpen(true)} variant="destructive">
						<Trash2 />
						Delete Clause
					</MenuItem>
				</MenuPopup>
			</Menu>
			<EditQuoteTermItem
				initialSectionId={item.sectionId}
				initialText={item.text}
				itemId={item._id}
				onOpenChange={setEditOpen}
				open={editOpen}
			/>
			<DeleteQuoteTermItem
				itemId={item._id}
				itemText={item.text}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
			/>
		</div>
	);
}

function ItemList({
	node,
	dndEnabled,
	numberOf,
}: {
	node: TermSectionNode;
	dndEnabled: boolean;
	numberOf: (id: string) => string;
}) {
	// Droppable so an empty section still accepts drops.
	const { setNodeRef } = useDroppable({
		id: `${ITEM_BOX_PREFIX}${node.section._id}`,
	});
	const itemIds = useMemo(
		() => node.items.map((item) => `${ITEM_PREFIX}${item._id}`),
		[node.items]
	);

	return (
		<div className="flex flex-col gap-2" ref={setNodeRef}>
			<InlineAddItem sectionId={node.section._id} />
			<SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
				{node.items.length === 0 ? (
					<div className="rounded-md border border-dashed px-3 py-4 text-center text-muted-foreground text-xs">
						No clauses in this section yet.
					</div>
				) : (
					<div className="divide-y overflow-hidden rounded-md border">
						{node.items.map((item) => (
							<ItemRow
								dndEnabled={dndEnabled}
								item={item}
								key={item._id}
								number={numberOf(item._id)}
							/>
						))}
					</div>
				)}
			</SortableContext>
		</div>
	);
}

function SectionAccordionItem({
	node,
	dndEnabled,
	numberOf,
}: {
	node: TermSectionNode;
	dndEnabled: boolean;
	numberOf: (id: string) => string;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: `${SECTION_PREFIX}${node.section._id}`,
		disabled: !dndEnabled,
	});
	// The menu closes on click, so its dialogs are controlled from here rather
	// than mounted inside a MenuItem.
	const [addItemOpen, setAddItemOpen] = useState(false);
	const [editOpen, setEditOpen] = useState(false);
	const [deleteOpen, setDeleteOpen] = useState(false);

	return (
		<div
			className="rounded-lg border bg-card"
			ref={setNodeRef}
			style={{
				transform: CSS.Translate.toString(transform),
				transition,
				opacity: isDragging ? 0.4 : 1,
			}}
		>
			<AccordionItem
				className="border-b-0"
				value={`${SECTION_PREFIX}${node.section._id}`}
			>
				<AccordionPrimitive.Header className="flex items-center gap-2 px-3">
					{dndEnabled ? (
						<DragHandle
							attributes={attributes}
							label={`Reorder ${node.section.name}`}
							listeners={listeners}
						/>
					) : (
						<span aria-hidden className="w-4 shrink-0" />
					)}
					<AccordionPrimitive.Trigger className="flex flex-1 cursor-pointer items-center gap-2 rounded-md py-4 text-left text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring">
						<span className="text-muted-foreground tabular-nums">
							{numberOf(node.section._id)}
						</span>
						<span className="font-medium">{node.section.name}</span>
						<Badge size="lg" variant="secondary">
							{node.items.length} clauses
						</Badge>
					</AccordionPrimitive.Trigger>
					<Menu>
						<MenuTrigger
							render={
								<Button
									aria-label={`${node.section.name} actions`}
									size="icon"
									type="button"
									variant="ghost"
								/>
							}
						>
							<EllipsisVertical className="size-4" />
						</MenuTrigger>
						<MenuPopup align="end">
							<MenuItem onClick={() => setAddItemOpen(true)}>
								<Plus />
								Add Clause
							</MenuItem>
							<MenuSeparator />
							<MenuItem onClick={() => setEditOpen(true)}>
								<Pencil />
								Edit Section
							</MenuItem>
							<MenuItem
								onClick={() => setDeleteOpen(true)}
								variant="destructive"
							>
								<Trash2 />
								Delete Section
							</MenuItem>
						</MenuPopup>
					</Menu>
					<AccordionChevronTrigger label={`Toggle ${node.section.name}`} />
				</AccordionPrimitive.Header>
				<AccordionPanel className="px-3">
					<ItemList dndEnabled={dndEnabled} node={node} numberOf={numberOf} />
				</AccordionPanel>
			</AccordionItem>
			<AddQuoteTermItem
				initialSectionId={node.section._id}
				onOpenChange={setAddItemOpen}
				open={addItemOpen}
			/>
			<EditQuoteTermSection
				initialName={node.section.name}
				onOpenChange={setEditOpen}
				open={editOpen}
				sectionId={node.section._id}
			/>
			<DeleteQuoteTermSection
				itemCount={node.items.length}
				onOpenChange={setDeleteOpen}
				open={deleteOpen}
				sectionId={node.section._id}
				sectionName={node.section.name}
			/>
		</div>
	);
}

function matchesText(value: string | undefined, needle: string): boolean {
	return (value ?? '').toLowerCase().includes(needle);
}

/**
 * Filters the tree to sections/clauses matching `needle`. A section-name match
 * keeps that section's whole subtree.
 */
function filterTree(
	tree: TermSectionNode[],
	needle: string
): TermSectionNode[] {
	const filtered: TermSectionNode[] = [];
	for (const sectionNode of tree) {
		if (matchesText(sectionNode.section.name, needle)) {
			filtered.push(sectionNode);
			continue;
		}
		const items = sectionNode.items.filter((item) =>
			matchesText(item.text, needle)
		);
		if (items.length > 0) {
			filtered.push({ ...sectionNode, items });
		}
	}
	return filtered;
}

/**
 * Outline numbers keyed by document id — `1` for the first section, `1.1` for
 * its first clause. Always computed from the unfiltered tree so numbers stay
 * stable while a search narrows what is shown.
 */
function buildNumbers(tree: TermSectionNode[]): Map<string, string> {
	const numbers = new Map<string, string>();
	for (const [sectionIndex, sectionNode] of tree.entries()) {
		const sectionNumber = String(sectionIndex + 1);
		numbers.set(sectionNode.section._id, sectionNumber);
		for (const [itemIndex, item] of sectionNode.items.entries()) {
			numbers.set(item._id, `${sectionNumber}.${itemIndex + 1}`);
		}
	}
	return numbers;
}

function allKeys(tree: TermSectionNode[]): string[] {
	return tree.map((node) => `${SECTION_PREFIX}${node.section._id}`);
}

function findItemSectionId(
	tree: TermSectionNode[],
	itemId: string
): Id<'quoteTermSections'> | null {
	for (const sectionNode of tree) {
		if (sectionNode.items.some((item) => item._id === itemId)) {
			return sectionNode.section._id;
		}
	}
	return null;
}

export function QuoteTermsTree({
	tree: serverTree,
	search = '',
	loadingLabel = 'Loading terms…',
	noResults,
	empty,
	ref,
}: {
	tree: TermSectionNode[] | undefined;
	search?: string;
	loadingLabel?: string;
	noResults?: ReactNode;
	// Shown below the inline add-section box when there are no sections yet.
	empty?: ReactNode;
	ref?: Ref<QuoteTermsTreeHandle>;
}) {
	const reorderSections = useMutation(api.quoteTermSections.reorder.reorder);
	const reorderItems = useMutation(api.quoteTermItems.reorder.reorder);

	const [tree, setTree] = useState<TermSectionNode[]>([]);
	const [openSectionKeys, setOpenSectionKeys] = useState<string[]>([]);
	const [activeId, setActiveId] = useState<string | null>(null);
	const scrollerRef = useRef<HTMLDivElement>(null);
	// Signature of the last cross-container move applied in onDragOver; guards
	// against re-processing an identical hover and looping at a container boundary.
	const lastDragOverRef = useRef<string | null>(null);

	// Mirror server data into local state so drags can relocate nodes
	// optimistically. Never overwrite mid-drag or the dragged node would snap back.
	useEffect(() => {
		if (serverTree && !activeId) {
			setTree(serverTree);
		}
	}, [serverTree, activeId]);

	useImperativeHandle(
		ref,
		() => ({
			expandAll: () => setOpenSectionKeys(allKeys(tree)),
			collapseAll: () => setOpenSectionKeys([]),
		}),
		[tree]
	);

	const trimmedSearch = search.trim().toLowerCase();
	const displayTree = useMemo(
		() => (trimmedSearch ? filterTree(tree, trimmedSearch) : tree),
		[tree, trimmedSearch]
	);
	const dndEnabled = trimmedSearch === '';
	const numbers = useMemo(() => buildNumbers(tree), [tree]);
	const numberOf = useCallback(
		(id: string) => numbers.get(id) ?? '',
		[numbers]
	);
	// While searching, force every matching section open so hits are visible.
	const forcedKeys = useMemo(() => allKeys(displayTree), [displayTree]);
	const effectiveSectionKeys = trimmedSearch ? forcedKeys : openSectionKeys;

	const sectionIds = useMemo(
		() => displayTree.map((n) => `${SECTION_PREFIX}${n.section._id}`),
		[displayTree]
	);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Only allow autoscroll on our own scroller — dnd-kit would otherwise scroll an
	// ancestor, moving every droppable under a stationary pointer and flip-flopping
	// `over` until React throws "Maximum update depth exceeded".
	const autoScroll = useMemo(
		() => ({
			canScroll: (element: Element) => element === scrollerRef.current,
		}),
		[]
	);

	// Each level only collides with droppables of its own kind (plus that kind's
	// container), so a section drag never targets a clause row and vice versa.
	const collisionDetection: CollisionDetection = (args) => {
		const kind = classify(String(args.active.id));
		if (kind === 'section') {
			return closestCenter({
				...args,
				droppableContainers: args.droppableContainers.filter(
					(c) => classify(String(c.id)) === 'section'
				),
			});
		}
		const pointerHits = pointerWithin(args);
		const hits = pointerHits.length > 0 ? pointerHits : closestCenter(args);
		if (hits.length === 0) {
			return hits;
		}
		const direct = hits.find((c) => classify(String(c.id)) === 'item');
		if (direct) {
			return [direct];
		}
		const container = hits.find((c) => classify(String(c.id)) === 'itembox');
		return container ? [container] : [];
	};

	/** The section a clause-level drop targets, from the hovered droppable id. */
	const resolveItemParent = (
		source: TermSectionNode[],
		overId: string
	): Id<'quoteTermSections'> | null => {
		const kind = classify(overId);
		if (kind === 'itembox') {
			return rawId(overId) as Id<'quoteTermSections'>;
		}
		if (kind === 'item') {
			return findItemSectionId(source, rawId(overId));
		}
		return null;
	};

	const moveItem = (
		source: TermSectionNode[],
		itemId: string,
		targetSectionId: Id<'quoteTermSections'>,
		overId: string
	): TermSectionNode[] => {
		const moving = source
			.flatMap((n) => n.items)
			.find((item) => item._id === itemId);
		if (!moving) {
			return source;
		}
		const item = moving;
		return source.map((sectionNode) => {
			const without = sectionNode.items.filter((i) => i._id !== itemId);
			if (sectionNode.section._id !== targetSectionId) {
				return without.length === sectionNode.items.length
					? sectionNode
					: { ...sectionNode, items: without };
			}
			const overIndex =
				classify(overId) === 'item'
					? without.findIndex((i) => i._id === rawId(overId))
					: -1;
			const next = [...without];
			next.splice(overIndex >= 0 ? overIndex : next.length, 0, item);
			return { ...sectionNode, items: next };
		});
	};

	const persistItems = (source: TermSectionNode[]) => {
		const updates = source.flatMap((sectionNode) =>
			sectionNode.items.map((item, index) => ({
				itemId: item._id,
				sectionId: sectionNode.section._id,
				order: index,
			}))
		);
		if (updates.length > 0) {
			reorderItems({ updates }).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
		}
	};

	const onDragStart = (event: DragStartEvent) => {
		setActiveId(String(event.active.id));
		lastDragOverRef.current = null;
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) {
			return;
		}
		const activeDndId = String(active.id);
		const overDndId = String(over.id);
		if (classify(activeDndId) !== 'item') {
			return;
		}
		// Skip if this exact hover was already applied — stops boundary flip-flop
		// from re-triggering setTree in a loop.
		const signature = `${activeDndId}:${overDndId}`;
		if (lastDragOverRef.current === signature) {
			return;
		}
		lastDragOverRef.current = signature;

		setTree((prev) => {
			const itemId = rawId(activeDndId);
			const targetSectionId = resolveItemParent(prev, overDndId);
			const currentSectionId = findItemSectionId(prev, itemId);
			if (
				!(targetSectionId && currentSectionId) ||
				targetSectionId === currentSectionId
			) {
				return prev;
			}
			return moveItem(prev, itemId, targetSectionId, overDndId);
		});
	};

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;
		const activeDndId = String(active.id);
		const kind = classify(activeDndId);
		setActiveId(null);
		if (!over) {
			return;
		}
		const overDndId = String(over.id);

		if (kind === 'section') {
			if (activeDndId === overDndId) {
				return;
			}
			const oldIndex = sectionIds.indexOf(activeDndId);
			const newIndex = sectionIds.indexOf(overDndId);
			if (oldIndex === -1 || newIndex === -1) {
				return;
			}
			const ordered = arrayMove(sectionIds, oldIndex, newIndex);
			const byKey = new Map(
				tree.map((n) => [`${SECTION_PREFIX}${n.section._id}`, n])
			);
			const next = ordered
				.map((key) => byKey.get(key))
				.filter((n): n is TermSectionNode => Boolean(n));
			setTree(next);
			reorderSections({
				sectionIds: next.map((n) => n.section._id),
			}).catch(() => {
				/* Convex reactive queries revert the UI automatically */
			});
			return;
		}

		const itemId = rawId(activeDndId);
		const targetSectionId = resolveItemParent(tree, overDndId);
		const currentSectionId = findItemSectionId(tree, itemId);
		if (!(targetSectionId && currentSectionId)) {
			return;
		}
		let next: TermSectionNode[];
		if (
			targetSectionId === currentSectionId &&
			classify(overDndId) === 'item'
		) {
			next = tree.map((sectionNode) => {
				if (sectionNode.section._id !== targetSectionId) {
					return sectionNode;
				}
				const oldIndex = sectionNode.items.findIndex((i) => i._id === itemId);
				const newIndex = sectionNode.items.findIndex(
					(i) => i._id === rawId(overDndId)
				);
				if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
					return sectionNode;
				}
				return {
					...sectionNode,
					items: arrayMove(sectionNode.items, oldIndex, newIndex),
				};
			});
		} else {
			next = moveItem(tree, itemId, targetSectionId, overDndId);
			setOpenSectionKeys((prev) => {
				const sectionKey = `${SECTION_PREFIX}${targetSectionId}`;
				return prev.includes(sectionKey) ? prev : [...prev, sectionKey];
			});
		}
		setTree(next);
		persistItems(next);
	};

	const activeLabel = useMemo(() => {
		if (!activeId) {
			return null;
		}
		const kind = classify(activeId);
		const id = rawId(activeId);
		for (const sectionNode of tree) {
			if (kind === 'section' && sectionNode.section._id === id) {
				return sectionNode.section.name;
			}
			const item = sectionNode.items.find((i) => i._id === id);
			if (kind === 'item' && item) {
				return item.text;
			}
		}
		return null;
	}, [activeId, tree]);

	if (!serverTree) {
		return <div className="text-muted-foreground text-sm">{loadingLabel}</div>;
	}

	if (trimmedSearch !== '' && displayTree.length === 0 && noResults) {
		return <>{noResults}</>;
	}

	return (
		<div ref={scrollerRef}>
			{/* Hidden while searching: the box would look like a filtered result. */}
			{dndEnabled ? (
				<div className="mb-3">
					<InlineAddSection />
				</div>
			) : null}
			{displayTree.length === 0 && !trimmedSearch ? empty : null}
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
					onValueChange={(value) => setOpenSectionKeys(value as string[])}
					value={effectiveSectionKeys}
				>
					<SortableContext
						items={sectionIds}
						strategy={verticalListSortingStrategy}
					>
						{displayTree.map((sectionNode) => (
							<SectionAccordionItem
								dndEnabled={dndEnabled}
								key={sectionNode.section._id}
								node={sectionNode}
								numberOf={numberOf}
							/>
						))}
					</SortableContext>
				</Accordion>
				<DragOverlay>
					{activeLabel ? (
						<div className="flex max-w-md items-center gap-2 rounded-md border bg-card px-3 py-2 shadow-md">
							<GripVertical className="size-4 shrink-0 text-muted-foreground" />
							<span className="truncate font-medium text-sm">
								{activeLabel}
							</span>
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		</div>
	);
}
